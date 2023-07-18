import { Socket } from "socket.io";

type SocketEmitter = Socket["emit"];

export interface ReceiveRoomsItem {
  id: string;
  name: string;
  playerCount: number;
}

export const lobbyEmitters = {
  receiveRooms: (emitter: SocketEmitter, data: ReceiveRoomsItem[]) =>
    emitter("receive-rooms", data),
};
