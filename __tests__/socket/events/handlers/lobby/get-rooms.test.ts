import { getRoomsHandler } from "../../../../../src/socket/events/handlers/lobby/get-rooms";
import { Socket, Server } from "socket.io";
import { IOContext } from "../../../../../src/types/context";
import { RoomCache } from "../../../../../src/cache/roomCache";
import { verifyToken } from "../../../../../src/auth/verifyToken";
import { lobbyEmitters } from "../../../../../src/socket/emitters/lobby/lobbyEmitters";

const mockSocket: Partial<Socket> = {
  id: "test",
  join: jest.fn(),
  emit: jest.fn(),
};

const mockServer: Partial<Server> = {
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
};

jest.mock("../../../../../src/socket/emitters/lobby/lobbyEmitters");

describe("getRoomsHandler", () => {
  let io: Server;
  let socket: Socket;
  let roomCache: RoomCache;
  let context: IOContext;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    io = mockServer as Server;
    socket = mockSocket as Socket;
    roomCache = new RoomCache();

    context = {
      io,
      socket,
      roomCache,
    };

    spy = jest.spyOn(lobbyEmitters, "receiveRooms");
  });

  it("should emit the all rooms to the socket", () => {
    context.roomCache.createRoom({
      user: {
        user_id: "test",
        username: "Test User",
      },
      socket: mockSocket as Socket,
      roomName: "test",
      settings: {
        remove_from_lobby_in_game: false,
      },
      gameType: "competitive",
    });

    getRoomsHandler(context);

    expect(spy).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Object)]),
      expect.any(Function)
    );
  });
});
