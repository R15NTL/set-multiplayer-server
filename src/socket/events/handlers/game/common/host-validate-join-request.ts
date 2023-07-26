import { IOContext } from "../../../../../types/context";
import * as yup from "yup";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { roomCache } from "../../../../../instances";

interface HostValidateJoinRequestParams {
  player_id: string;
}

const hostValidateJoinRequestParamsSchema = yup.object().shape({
  player_id: yup.string().required(),
});

export const hostValidateJoinRequestHandler = (
  context: IOContext,
  params: HostValidateJoinRequestParams
) => {
  const { socket } = context;

  // Validation
  hostValidateJoinRequestParamsSchema.validateSync(params);

  const user = roomCache.getUserBySocketId(socket.id);
  if (!user) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(user.user_id);
  if (!roomId) throw new Error("Room no longer exists.");
  const room = roomCache.getRoomById(roomId);
  if (!room) throw new Error("Room no longer exists.");

  // Verify user is host
  if (room.host.user_id !== user.user_id)
    throw new Error("Only the host can validate a join request.");

  roomCache.setUserJoinRequestToAccepted(roomId, params.player_id);

  updateGameRoom(roomId);
};
