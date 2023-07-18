import { IOContext } from "../../../types/context";
import { getAllRooms } from "../../../features/sendRooms/sendRooms";
import { lobbyEmitters } from "../../emitters/lobby/lobbyEmitters";

export const getRooms = (context: IOContext) => {
  const { socket } = context;

  const parsedRooms = getAllRooms(context);

  lobbyEmitters.receiveRooms(socket.emit, parsedRooms);
};
