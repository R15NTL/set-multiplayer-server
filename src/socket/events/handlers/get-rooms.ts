import { Server, Socket } from "socket.io";
import { RoomCache } from "../../../cache/roomCache";

export const getRooms = (io: Server, socket: Socket, roomCache: RoomCache) => {
  const rooms = Array.from(roomCache.getAllRooms().values());

  const parsedRooms = rooms.map((room) => ({
    id: room.room_id,
    name: room.room_id,
    playerCount: room.room_players.size,
  }));

  socket.emit("receive-rooms", parsedRooms);
};
