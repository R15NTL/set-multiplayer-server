import { handleSocketEventError } from "./errorHandler";
import { IOContext } from "../../types/context";
// Handlers
import {
  getRoomsHandler,
  createRoomHandler,
  startGameHandler,
  requestRoomDataHandler,
  leaveRoomHandler,
  joinRoomHandler,
  hostValidateJoinRequestHandler,
  hostRemovePlayerFromRoomHandler,
  disconnectHandler,
  playerAcceptJoinRequestHandler,
  startNewRoundHandler,
  findSetCompetitiveHandler,
  findSetKnockoutHandler,
  sendChatMessageHandler,
  checkIfInRoomHandler,
} from "./handlers";

export const events = (context: IOContext) => {
  const socket = context.socket;

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

  socket.on("start-game", (params) => {
    try {
      console.log("start-game");
      startGameHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  // Game/Common

  socket.on("host-validate-join-request", (params) => {
    try {
      hostValidateJoinRequestHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("host-remove-player", (params) => {
    try {
      hostRemovePlayerFromRoomHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("player-accept-join-request", () => {
    try {
      playerAcceptJoinRequestHandler(context);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("start-new-round", (params) => {
    try {
      startNewRoundHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  socket.on("send-chat-message", (params) => {
    try {
      sendChatMessageHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  // Game/Competitive
  socket.on("find-set-competitive", (params) => {
    try {
      findSetCompetitiveHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

  // Game/Knockout
  socket.on("find-set-knockout", (params) => {
    try {
      findSetKnockoutHandler(context, params);
    } catch (error) {
      handleSocketEventError(context, error);
    }
  });

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

  socket.on("check-if-in-room", () => {
    try {
      checkIfInRoomHandler(context);
    } catch (error) {
      // Fail silently
    }
  });

  socket.on("disconnect", () => {
    try {
      disconnectHandler(context);
    } catch (error) {}
  });
};
