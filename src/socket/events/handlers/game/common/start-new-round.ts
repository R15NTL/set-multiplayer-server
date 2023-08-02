import { IOContext } from "../../../../../types/context";
import GameLogic from "../../../../../gameLogic/gameLogic";
import * as yup from "yup";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { updateLobbyRooms } from "../../../../emitters/lobby/emitToLobby";
import { Room } from "../../../../../cache/roomCache";
import { roomCache } from "../../../../../instances";

interface StartNewRoundParams {
  game_type: Room["game_type"];
}

const startNewRoundParamsSchema = yup.object().shape({
  game_type: yup.string().oneOf(["knockout", "competitive"]).required(),
});

export const startNewRoundHandler = (
  context: IOContext,
  params: StartNewRoundParams
) => {
  const { socket } = context;

  // Validation
  startNewRoundParamsSchema.validateSync(params);

  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(userId.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Verify user is host
  if (room.host.user_id !== userId.user_id)
    throw new Error("Only the host can start a new round.");

  // Start game
  const newGame = new GameLogic();
  newGame.startGame();

  const snapshot = newGame.saveGame();

  roomCache.updateGameType(roomId, params.game_type);
  roomCache.updateGameState(roomId, snapshot);

  // Reset player statuses
  room.room_players.forEach((player) => {
    roomCache.updatePlayerStatus(roomId, player.user.user_id, "player");
  });

  roomCache.resetPlayerScores(roomId);

  updateGameRoom(roomId);
  updateLobbyRooms();
};
