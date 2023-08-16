import { IOContext } from "../../../../../types/context";
import * as yup from "yup";
import { removePlayerFromRoom } from "../../../../../features/players/removePlayerFromRoom";
import { roomCache } from "../../../../../instances";

interface HostRemovePlayerFromRoomParams {
  player_id: string;
}

const hostRemovePlayerFromRoomParamsSchema = yup.object().shape({
  player_id: yup.string().required(),
});

export const hostRemovePlayerFromRoomHandler = (
  context: IOContext,
  params: HostRemovePlayerFromRoomParams
) => {
  const { socket } = context;

  // Validation
  hostRemovePlayerFromRoomParamsSchema.validateSync(params);

  const user = roomCache.getUserBySocketId(socket.id);
  if (!user) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(user.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Verify user is host
  if (room.host.user_id !== user.user_id)
    throw new Error("Only the host can remove a player.");

  const player = room.room_players.get(params.player_id);

  if (!player) throw new Error("Player is not in the room.");

  // Remove player from room
  const playerSocket = roomCache.getUserToSocket(params.player_id);

  if (!playerSocket) throw new Error("Player is not connected.");

  playerSocket.leave(roomId);

  const status = removePlayerFromRoom({
    userId: params.player_id,
    updateLobby: true,
    updateGame: true,
    removedByHost: true,
  });

  if (status !== true) throw new Error(status);
};
