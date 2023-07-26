import { IOContext } from "../../../../../types/context";
import * as yup from "yup";
import GameLogic from "../../../../../gameLogic/gameLogic";
import { gameEmitters } from "../../../../emitters/game/gameEmitters";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { validateFindSetEvent } from "../utils/findSet";
import { roomCache, io } from "../../../../../instances";

interface FindSetCompetitiveParams {
  card_positions: number[];
}

const findSetCompetitiveParamsSchema = yup.object().shape({
  card_positions: yup.array().of(yup.number()).length(3).required(),
});

export const findSetCompetitiveHandler = (
  context: IOContext,
  params: FindSetCompetitiveParams
) => {
  // Validation
  findSetCompetitiveParamsSchema.validateSync(params);

  const { user, roomId, room } = validateFindSetEvent(context, "competitive");

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

  if (isSet) {
    roomCache.incrementPlayerScore(roomId, user.user_id, 3);
  }

  const snapshot = gameLogic.saveGame();

  // Handle end of game.
  if (snapshot.endOfGame === true) {
    gameEmitters.endOfGame({ room_id: roomId }, (...args) =>
      io.to(roomId).emit(...args)
    );
  }

  // Update the game state in the room cache.
  roomCache.updateGameState(roomId, snapshot);

  // Emit the game state to the room.
  updateGameRoom(roomId);
};
