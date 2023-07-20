import { IOContext } from "../../../../types/context";
import { updateGameRoom } from "../../../emitters/game/emitToGame";

export const requestRoomDataHandler = (context: IOContext) => {
  const { socket, roomCache } = context;

  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room.");

  const roomId = roomCache.getRoomIdByUser(userId.user_id);

  if (!roomId) throw new Error("Room no longer exists.");

  updateGameRoom(context, roomId);
};
