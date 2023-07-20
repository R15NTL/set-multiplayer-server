import { handleSocketEventError } from "./errorHandler";
import { IOContext } from "../../types/context";
// Handlers
import { disconnectHandler } from "./handlers/disconnect";
import { requestRoomDataHandler, leaveRoomHandler } from "./handlers/common";
import {
  getRoomsHandler,
  createRoomHandler,
  startGameHandler,
  joinRoomHandler,
} from "./handlers/lobby";

export const events = (context: IOContext) => {
  const { socket } = context;

  // Lobby
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

  socket.on("join-room", async (params) => {
    try {
      await joinRoomHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("start-game", async (params) => {
    try {
      startGameHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  // Game

  // Common
  socket.on("leave-room", () => {
    try {
      leaveRoomHandler(context);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("request-room-data", () => {
    try {
      requestRoomDataHandler(context);
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
