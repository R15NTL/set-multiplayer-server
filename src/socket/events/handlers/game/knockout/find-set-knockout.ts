import { IOContext } from "../../../../../types/context";
import * as yup from "yup";
import GameLogic from "../../../../../gameLogic/gameLogic";
import { gameEmitters } from "../../../../emitters/game/gameEmitters";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { validateFindSetEvent } from "../utils/findSet";
import { autoStartKnockoutRound } from "../utils/autoStartKnockoutRound";
import { roomCache, io } from "../../../../../instances";

interface FindSetKnockoutParams {
  card_positions: number[];
}

const findSetKnockoutParamsSchema = yup.object().shape({
  card_positions: yup.array().of(yup.number()).length(3).required(),
});

export const findSetKnockoutHandler = (
  context: IOContext,
  params: FindSetKnockoutParams
) => {
  // Validation
  findSetKnockoutParamsSchema.validateSync(params);
  const { user, roomId, room } = validateFindSetEvent(context, "knockout");

  // Verify the status of the game is in-game and the game is in progress.
  if (
    room.game_status !== "in-game" ||
    !room.game_state ||
    room.game_state?.endOfGame === true
  )
    throw new Error("Game is not in progress.");

  // Find the set
  const gameLogic = new GameLogic(room.game_state);

  const isSet = gameLogic.findSet({
    cardIdA: params.card_positions[0],
    cardIdB: params.card_positions[1],
    cardIdC: params.card_positions[2],
  });

  if (!isSet) return;

  roomCache.incrementPlayerScore(roomId, user.user_id, 3);

  const snapshot = gameLogic.saveGame();

  // Handle end of game.
  if (snapshot.endOfGame === true) {
    gameEmitters.endOfGame({ room_id: roomId }, (...args) =>
      io.to(roomId).emit(...args)
    );

    // Find the player(s) with the lowest score:
    const playerArray = Array.from(room.room_players.values());

    const lowestScore = Math.min(...playerArray.map((player) => player.score));

    const playersThatAreNotOut = playerArray.filter(
      (player) => player.status === "player"
    );

    const playersWithLowestScore = playersThatAreNotOut.filter(
      (player) => player.score === lowestScore
    );

    if (playersWithLowestScore.length === playersThatAreNotOut.length) {
      // All players in the game have a tied score.
      // No one is eliminated.
      // Do nothing.
    } else {
      playersWithLowestScore.forEach((player) => {
        roomCache.updatePlayerStatus(
          roomId,
          player.user.user_id,
          "knocked-out"
        );
      });
    }

    // If there are still players in the game, start a new round in 5 seconds.
    const playersInGame = Array.from(room.room_players.values()).filter(
      (player) => player.status === "player"
    );

    if (playersInGame.length > 1) {
      setTimeout(() => {
        autoStartKnockoutRound(roomId);
      }, 5000);
    }
  }

  // Update the game state in the room cache.
  roomCache.updateGameState(roomId, snapshot);

  // Emit the game state to the room.
  updateGameRoom(roomId);
};
