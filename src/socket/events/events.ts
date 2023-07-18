import { Server, Socket } from "socket.io";
import { RoomCache } from "../../cache/roomCache";
import { getRooms } from "./handlers";
import { IOContext } from "../../types/context";

export const events = (context: IOContext) => {
  const { io, socket, roomCache } = context;

  socket.on("get-rooms", () => {
    try {
      getRooms(context);
    } catch (error) {
      // TODO: Handle error
    }
  });

  socket.on("create-room", (params) => {});

  socket.on("disconnect", () => {});
};
