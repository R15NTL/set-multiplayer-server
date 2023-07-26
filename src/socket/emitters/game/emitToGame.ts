import { gameEmitters } from "./gameEmitters";
import { parseRoom } from "../../../features/parseRooms/parseRoom";
import { io, roomCache } from "../../../instances";

export const updateGameRoom = (roomId: string) => {
  const room = roomCache.getRoomById(roomId);

  // Todo: handle room not found
  if (!room) return;

  const parsedRoom = parseRoom(roomId);

  gameEmitters.receiveRoom(parsedRoom, (...args) =>
    io.to(roomId).emit(...args)
  );
};
