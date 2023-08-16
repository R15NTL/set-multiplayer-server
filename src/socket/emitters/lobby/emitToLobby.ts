import { lobbyEmitters } from "./lobbyEmitters";
import { parseAllRooms } from "../../../features/parseRooms/parseAllRooms";
import { io } from "../../../instances";

export const updateLobbyRooms = () => {
  const parsedRooms = parseAllRooms();

  lobbyEmitters.receiveRooms(parsedRooms, (...args) =>
    io.to("lobby").emit(...args)
  );
};
