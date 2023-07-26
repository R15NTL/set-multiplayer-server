import { ReceiveRoomsItem } from "../../socket/emitters/lobby/lobbyEmitters";
import { roomCache } from "../../instances";

export const parseAllRooms = (): ReceiveRoomsItem[] => {
  const rooms = Array.from(roomCache.getAllRooms().values());

  const parsedRooms = rooms.map((room) => ({
    id: room.room_id,
    name: room.room_name,
    playerCount: room.room_players.size,
  }));

  return parsedRooms;
};
