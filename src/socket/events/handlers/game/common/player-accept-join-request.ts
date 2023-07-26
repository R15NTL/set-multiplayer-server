import { IOContext } from "../../../../../types/context";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { updateLobbyRooms } from "../../../../emitters/lobby/emitToLobby";
import { gameEmitters } from "../../../../emitters/game/gameEmitters";
import { roomCache } from "../../../../../instances";

export const playerAcceptJoinRequestHandler = (context: IOContext) => {
  const { socket } = context;

  // Validation
  const user = roomCache.getUserBySocketId(socket.id);
  if (!user) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(user.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Accept the join request
  const playerStatus = room.game_type === "knockout" ? "audience" : "player";
  roomCache.acceptJoinRequest(roomId, user, socket, playerStatus);

  gameEmitters.addedToGame({ room_id: roomId }, (...args) =>
    socket.emit(...args)
  );
  updateGameRoom(roomId);
  updateLobbyRooms();
};
