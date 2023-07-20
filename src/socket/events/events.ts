import { handleSocketEventError } from "./errorHandler";
import { IOContext } from "../../types/context";
// Handlers
import { disconnectHandler } from "./handlers/disconnect";
import { requestGameDataHandler, startGameHandler } from "./handlers/game";
import { getRoomsHandler, createRoomHandler } from "./handlers/lobby";

export const events = (context: IOContext) => {
  const { socket } = context;

  socket.on("get-rooms", () => {
    try {
      getRoomsHandler(context);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("create-room", async (params) => {
    try {
      await createRoomHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("request-game-data", () => {
    try {
      requestGameDataHandler(context);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("start-game", async (params) => {
    try {
      await startGameHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("disconnect", () => {
    try {
      disconnectHandler(context);
    } catch (error) {}
  });
};
