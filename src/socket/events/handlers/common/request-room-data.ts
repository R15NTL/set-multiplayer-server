import { IOContext } from "../../../../types/context";
import { updateGameRoom } from "../../../emitters/game/emitToGame";
import { roomCache } from "../../../../instances";

export const requestRoomDataHandler = (context: IOContext) => {
  const { socket } = context;

  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room.");

  const roomId = roomCache.getRoomIdByUser(userId.user_id);

  if (!roomId) throw new Error("Room no longer exists.");

  updateGameRoom(roomId);
};
