import { RoomSettings } from "../../../../cache/roomCache";
import { verifyToken } from "../../../../auth/verifyToken";
import * as yup from "yup";
import { IOContext } from "../../../../types/context";
import { updateLobbyRooms } from "../../../emitters/lobby/emitToLobby";

interface GetRoomsParams {
  token: string;
  room_name: string;
  settings: RoomSettings;
}

const schema = yup.object().shape({
  token: yup.string().required(),
  room_name: yup.string().required(),
  settings: yup.object().shape({
    remove_from_lobby_when_not_waiting_for_players: yup.boolean().required(),
  }),
});

import { updateGameRoom } from "../../../emitters/game/emitToGame";

export const createRoomHandler = async (
  context: IOContext,
  params: GetRoomsParams
) => {
  // console.log({ context });
  const { roomCache, socket, io } = context;

  try {
    await schema.validate(params);
  } catch (error) {
    throw new Error(
      error instanceof yup.ValidationError ? error.message : "Invalid params"
    );
  }

  const { token, settings, room_name } = params;

  const user = verifyToken(token);

  if (!user) throw new Error("Invalid token");

  const roomId = roomCache.createRoom({
    roomName: room_name,
    settings,
    socket,
    user,
  });

  socket.join(roomId);
  io.to(roomId).emit("room-created", { roomId });

  updateLobbyRooms(context);
  updateGameRoom(context, roomId);
};
