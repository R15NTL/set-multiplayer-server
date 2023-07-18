import { Server, Socket } from "socket.io";
import { RoomCache } from "../../cache/roomCache";
import { getRooms } from "./handlers";

export const events = (io: Server, socket: Socket, roomCache: RoomCache) => {
  socket.on("get-rooms", () => {
    try {
      getRooms(io, socket, roomCache);
    } catch (error) {
      // TODO: Handle error
    }
  });

  socket.on("disconnect", () => {});
};
