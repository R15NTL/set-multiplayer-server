import { ReceiveRoomsItem } from "../../socket/emitters/lobby/lobbyEmitters";
import { roomCache } from "../../instances";

export const parseAllRooms = (): ReceiveRoomsItem[] => {
  const rooms = Array.from(roomCache.getAllRooms().values());

  const parsedRooms = rooms.map((room) => ({
    id: room.room_id,
    name: room.room_name,
    playerCount: room.room_players.size,
    room_status: (room.room_players.size >= 4
      ? "full"
      : room.game_status) as ReceiveRoomsItem["room_status"],
    game_type: room.game_type,
  }));

  return parsedRooms;
};
