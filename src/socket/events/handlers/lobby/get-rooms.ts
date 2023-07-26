import { IOContext } from "../../../../types/context";
import { parseAllRooms } from "../../../../features/parseRooms/parseAllRooms";
import { lobbyEmitters } from "../../../emitters/lobby/lobbyEmitters";

export const getRoomsHandler = (context: IOContext) => {
  const { socket } = context;

  const parsedRooms = parseAllRooms();

  lobbyEmitters.receiveRooms(parsedRooms, (...args) => socket.emit(...args));
};
