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

interface AddedToGameParams {
  room_id: string;
}

interface EndOfGameParams {
  room_id: string;
}

export const gameEmitters = {
  receiveRoom: (room: ReceiveRoom, cb: SocketEmitter) => {
    cb("receive-room", room);
  },
  addedToGame: (data: AddedToGameParams, cb: SocketEmitter) => {
    cb("added-to-game", data);
  },
  addedToJoinRequests: (data: AddedToGameParams, cb: SocketEmitter) => {
    cb("added-to-join-requests", data);
  },
  endOfGame: (data: EndOfGameParams, cb: SocketEmitter) =>
    cb("end-of-game", data),
};
