import { IOContext } from "../../../../types/context";
import { parseAllRooms } from "../../../../features/parseRooms/parseAllRooms";
import { lobbyEmitters } from "../../../emitters/lobby/lobbyEmitters";

export const getRooms = (context: IOContext) => {
  const { socket } = context;

  const parsedRooms = parseAllRooms(context);

  lobbyEmitters.receiveRooms(socket.emit, parsedRooms);
};
