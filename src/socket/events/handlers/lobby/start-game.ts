import { IOContext } from "../../../../types/context";
import GameLogic from "../../../../gameLogic/gameLogic";
import * as yup from "yup";
import { updateGameRoom } from "../../../emitters/game/emitToGame";
import { updateLobbyRooms } from "../../../emitters/lobby/emitToLobby";
import { removePlayerFromRoom } from "../../../../features/players/removePlayerFromRoom";

interface StartGameParams {
  players_to_remove: string[];
}

const startGameParamsSchema = yup.object().shape({
  players_to_remove: yup.array().of(yup.string()).required(),
});

export const startGameHandler = (
  context: IOContext,
  params: StartGameParams
) => {
  const { socket, roomCache } = context;

  // Validation
  startGameParamsSchema.validateSync(params);

  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(userId.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Verify user is host
  if (room.host.user_id !== userId.user_id)
    throw new Error("Only the host can start the game.");

  // Remove players from room
  const playersToRemove = params.players_to_remove;

  playersToRemove.forEach((playerId) => {
    removePlayerFromRoom(context, {
      userId: playerId,
      updateLobby: false,
      updateGame: false,
      removedByHost: true,
    });
  });

  // Start game
  const newGame = new GameLogic();
  newGame.startGame();

  const snapshot = newGame.saveGame();

  roomCache.updateGameStatus(roomId, "in-game");
  roomCache.updateGameState(roomId, snapshot);

  updateGameRoom(context, roomId);
  updateLobbyRooms(context);
};
