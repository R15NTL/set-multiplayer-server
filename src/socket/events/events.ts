import { handleSocketEventError } from "./errorHandler";
import { getRooms } from "./handlers/lobby";
import { IOContext } from "../../types/context";

export const events = (context: IOContext) => {
  const { socket } = context;

  socket.on("get-rooms", () => {
    try {
      getRooms(context);
    } catch (error) {
      // console.log(error);
      handleSocketEventError(context, error);
    }
  });

  socket.on("create-room", (params) => {});

  socket.on("disconnect", () => {});
};
