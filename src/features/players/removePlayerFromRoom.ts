import { Context } from "../../types/context";
import { commonEmitters } from "../../socket/emitters/common/commonEmitters";
import { updateGameRoom } from "../../socket/emitters/game/emitToGame";
import { updateLobbyRooms } from "../../socket/emitters/lobby/emitToLobby";

interface RemovePlayerFromRoomSettings {
  userId: string;
  updateLobby: boolean;
  updateGame: boolean;
  removedByHost: boolean;
}

export const removePlayerFromRoom = (
  context: Context,
  {
    userId,
    updateLobby,
    updateGame,
    removedByHost,
  }: RemovePlayerFromRoomSettings
) => {
  const { roomCache } = context;

  const roomId = roomCache.getRoomIdByUser(userId);

  if (!roomId) return "User is not in a room.";

  const socket = roomCache.getUserToSocket(userId);

  roomCache.removeFromRoom(userId, roomId);

  if (!socket) return "User is not in a room.";

  commonEmitters.removedFromRoom(
    { removed_by_host: removedByHost },
    (...args) => socket.emit(...args)
  );

  if (updateLobby) updateLobbyRooms(context);

  if (!roomCache.getRoomById(roomId)) {
    commonEmitters.roomNoLongerExists({ room_id: roomId }, (...args) =>
      socket.emit(...args)
    );

    return true;
  }

  if (updateGame) updateGameRoom(context, roomId);

  return true;
};
