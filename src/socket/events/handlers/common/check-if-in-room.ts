import { IOContext } from "../../../../types/context";
import { updateGameRoom } from "../../../emitters/game/emitToGame";
import { roomCache } from "../../../../instances";

export const checkIfInRoomHandler = (context: IOContext) => {
  const { socket } = context;

  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) return;

  const roomId = roomCache.getRoomIdByUser(userId.user_id);

  if (!roomId) return;

  const room = roomCache.getRoomById(roomId);
  const players = room?.room_players;
  const isPlayer = players?.has(userId.user_id);

  if (!isPlayer) return;

  socket.join(roomId);
  updateGameRoom(roomId);
};
