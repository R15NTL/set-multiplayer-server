import { IOContext } from "../../../../../types/context";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { updateLobbyRooms } from "../../../../emitters/lobby/emitToLobby";

export const playerAcceptJoinRequestHandler = (context: IOContext) => {
  const { socket, roomCache } = context;

  // Validation
  const user = roomCache.getUserBySocketId(socket.id);
  if (!user) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(user.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Accept the join request
  const playerStatus = room.game_type === "knockout" ? "audience" : "player";
  context.roomCache.acceptJoinRequest(roomId, user, socket, playerStatus);

  updateGameRoom(context, roomId);
  updateLobbyRooms(context);
};
