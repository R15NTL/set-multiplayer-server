import { handleSocketEventError } from "./errorHandler";
import { getRooms } from "./handlers/lobby";
import { IOContext } from "../../types/context";

export const events = (context: IOContext) => {
  const { io, socket, roomCache } = context;

  socket.on("get-rooms", () => {
    try {
      getRooms(context);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("create-room", (params) => {});

  socket.on("disconnect", () => {});
};
