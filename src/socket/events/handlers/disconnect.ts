import { IOContext } from "../../../types/context";
import { updateGameRoom } from "../../emitters/game/emitToGame";
import { updateLobbyRooms } from "../../emitters/lobby/emitToLobby";
import { roomCache } from "../../../instances";

export const disconnectHandler = (context: IOContext) => {
  const { socket } = context;

  const user = roomCache.getUserBySocketId(socket.id);

  if (!user) return;

  const roomId = roomCache.getRoomIdByUser(user.user_id);

  if (!roomId) return;

  socket.leave(roomId);
  roomCache.removeFromRoom(user.user_id, roomId);

  console.log("disconnecting", user.user_id, roomId);

  updateLobbyRooms();

  updateGameRoom(roomId);
};
