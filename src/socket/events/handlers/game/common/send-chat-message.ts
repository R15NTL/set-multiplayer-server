import { IOContext } from "../../../../../types/context";
import * as yup from "yup";
import { roomCache } from "../../../../../instances";
import { commonEmitters } from "../../../../emitters/common/commonEmitters";
import { v4 as uuidv4 } from "uuid";
import { io } from "../../../../../instances";

interface SendChatMessageParams {
  message: string;
}

const sendChatMessageParamsSchema = yup.object().shape({
  message: yup.string().max(2).required(),
});

export const sendChatMessageHandler = (
  context: IOContext,
  params: SendChatMessageParams
) => {
  const { socket } = context;

  // Validation
  sendChatMessageParamsSchema.validateSync(params);

  const user = roomCache.getUserBySocketId(socket.id);
  if (!user) throw new Error("User is not in a room.");
  const roomId = roomCache.getRoomIdByUser(user.user_id);
  if (!roomId) throw new Error("Room no longer exists.");

  // Send message to room
  commonEmitters.receiveChatMessage(
    {
      message_id: uuidv4(),
      user_id: user.user_id,
      message: params.message,
    },
    (...args) => io.to(roomId).emit(...args)
  );
};
