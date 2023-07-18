import { Context } from "../../types/context";
import { ReceiveRoomsItem } from "../../socket/emitters/lobby/lobbyEmitters";

export const parseAllRooms = ({ roomCache }: Context): ReceiveRoomsItem[] => {
  const rooms = Array.from(roomCache.getAllRooms().values());

  const parsedRooms = rooms.map((room) => ({
    id: room.room_id,
    name: room.room_id,
    playerCount: room.room_players.size,
  }));

  return parsedRooms;
};
