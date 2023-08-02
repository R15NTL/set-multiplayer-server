import { Room } from "../../../../../cache/roomCache";
import { IOContext } from "../../../../../types/context";
import { roomCache } from "../../../../../instances";

export const validateFindSetEvent = (
  context: IOContext,
  gameType: Room["game_type"]
) => {
  const { socket } = context;

  const user = roomCache.getUserBySocketId(socket.id);
  if (!user) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(user.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Verify the game mode is competitive.
  if (room.game_type !== gameType)
    throw new Error(`Game mode is not '${gameType}'.`);

  // Verify user a user playing the game.
  const player = room.room_players.get(user.user_id);
  if (!player || player.status !== "player")
    throw new Error("You are not a player.");

  return { user, roomId, room, player };
};
