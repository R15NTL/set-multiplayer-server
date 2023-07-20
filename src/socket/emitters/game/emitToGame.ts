import { Context } from "../../../types/context";
import { gameEmitters } from "./gameEmitters";
import { parseRoom } from "../../../features/parseRooms/parseRoom";

export const updateGameRoom = (context: Context, roomId: string) => {
  const { io, roomCache } = context;

  const room = roomCache.getRoomById(roomId);

  if (!room) throw new Error("Room does not exist");

  const parsedRoom = parseRoom(context, roomId);

  gameEmitters.receiveRoom(parsedRoom, (...args) =>
    io.to(roomId).emit(...args)
  );
};
