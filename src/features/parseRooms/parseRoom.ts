import { ReceiveRoom } from "../../socket/emitters/game/gameEmitters";
import { roomCache } from "../../instances";
import { Card } from "../../gameLogic/types";

export const parseRoom = (roomId: string): ReceiveRoom => {
  const room = roomCache.getRoomById(roomId);

  if (!room) throw new Error("Room does not exist");

  const parsedRoom: ReceiveRoom = {
    ...room,
    game_state: room.game_state
      ? {
          ...room.game_state!,
          cardStack: [] as Card[],
        }
      : null,
    room_players: Array.from(room.room_players.values()),
    join_requests: Array.from(room.join_requests.values()),
  };

  return parsedRoom;
};
