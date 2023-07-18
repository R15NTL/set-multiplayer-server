import { Server, Socket } from "socket.io";
import { RoomCache } from "../../../cache/roomCache";
import { IOContext } from "../../../types/context";

export const getRooms = ({ roomCache, socket }: IOContext) => {
  const rooms = Array.from(roomCache.getAllRooms().values());

  const parsedRooms = rooms.map((room) => ({
    id: room.room_id,
    name: room.room_id,
    playerCount: room.room_players.size,
  }));

  socket.emit("receive-rooms", parsedRooms);
};
