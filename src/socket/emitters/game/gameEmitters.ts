import { Room, Player, JoinRequestPlayer } from "../../../cache/roomCache";
import type { SocketEmitter } from "../types";

export interface ReceiveRoom {
  room_id: Room["room_id"];
  room_name: Room["room_name"];
  settings: Room["settings"];
  host: Room["host"];
  room_players: Player[];
  game_status: Room["game_status"];
  game_state: Room["game_state"];
  join_requests: JoinRequestPlayer[];
}

export const gameEmitters = {
  receiveRoom: (room: ReceiveRoom, cb: SocketEmitter) => {
    cb("receive-room", room);
  },
};
