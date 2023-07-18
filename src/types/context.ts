import { RoomCache } from "../cache/roomCache";
import { Server, Socket } from "socket.io";

export interface Context {
  io: Server;
  roomCache: RoomCache;
}

export interface IOContext extends Context {
  socket: Socket;
}
