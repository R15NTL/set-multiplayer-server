import type { SocketEmitter } from "../types";

export interface ReceiveRoomsItem {
  id: string;
  name: string;
  playerCount: number;
}

export const lobbyEmitters = {
  receiveRooms: (data: ReceiveRoomsItem[], cb: SocketEmitter) => {
    cb("receive-rooms", data);
  },
};
