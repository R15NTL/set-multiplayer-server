import { handleSocketEventError } from "../../errorHandler";
import { IOContext } from "../../../../types/context";

export const requestGameDataHandler = (context: IOContext) => {
  const { socket, roomCache } = context;

  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room");

  const roomId = roomCache.getRoomIdByUser(userId.user_id);
};
