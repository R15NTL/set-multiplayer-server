import { IOContext } from "../../../../types/context";

import { removePlayerFromRoom } from "../../../../features/players/removePlayerFromRoom";

export const leaveRoomHandler = (context: IOContext) => {
  const { socket, roomCache } = context;

  // Validation
  const userId = roomCache.getUserBySocketId(socket.id);
  if (!userId) throw new Error("User is not in a room.");

  // Remove player from room
  const status = removePlayerFromRoom(context, {
    userId: userId.user_id,
    updateLobby: true,
    updateGame: true,
    removedByHost: false,
  });

  if (status !== true) throw new Error(status);
};
