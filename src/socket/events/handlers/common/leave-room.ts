import { IOContext } from "../../../../types/context";
import { roomCache } from "../../../../instances";
import { removePlayerFromRoom } from "../../../../features/players/removePlayerFromRoom";
import { commonEmitters } from "../../../emitters/common/commonEmitters";

export const leaveRoomHandler = (context: IOContext) => {
  const { socket } = context;

  // Validation
  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room.");

  // Remove player from room
  const status = removePlayerFromRoom({
    userId: userId.user_id,
    updateLobby: true,
    updateGame: true,
    removedByHost: false,
  });

  if (status !== true) throw new Error(status);

  commonEmitters.removedFromRoom({ removed_by_host: false }, (...args) =>
    socket.emit(...args)
  );
};
