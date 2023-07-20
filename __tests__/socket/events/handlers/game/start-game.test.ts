import { startGameHandler } from "../../../../../src/socket/events/handlers/lobby";
import { updateGameRoom } from "../../../../../src/socket/emitters/game/emitToGame";
import { updateLobbyRooms } from "../../../../../src/socket/emitters/lobby/emitToLobby";
import { RoomCache } from "../../../../../src/cache/roomCache";
import { Socket, Server } from "socket.io";
import { IOContext } from "../../../../../src/types/context";

jest.mock("../../../../../src/socket/emitters/game/emitToGame", () => ({
  ...jest.requireActual("../../../../../src/socket/emitters/game/emitToGame"),
  updateGameRoom: jest.fn(),
}));

jest.mock("../../../../../src/socket/emitters/lobby/emitToLobby", () => ({
  ...jest.requireActual("../../../../../src/socket/emitters/lobby/emitToLobby"),
  updateLobbyRooms: jest.fn(),
}));

const mockSocket: Partial<Socket> = {
  id: "test",
  join: jest.fn(),
  emit: jest.fn(),
};

const mockServer: Partial<Server> = {
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
};

const mockUser = {
  user_id: "test-123",
  username: "Test User",
};

const mockParams = {
  players_to_remove: [],
};

describe("start-game handler", () => {
  let roomCache: RoomCache;
  let io: Server;
  let socket: Socket;
  let context: IOContext;

  beforeEach(() => {
    roomCache = new RoomCache();
    socket = mockSocket as Socket;
    io = mockServer as Server;

    context = {
      roomCache,
      socket,
      io,
    };

    roomCache.createRoom({
      user: mockUser,
      roomName: "Test room",
      socket: mockSocket as Socket,
      settings: {
        remove_from_lobby_in_game: false,
      },
      gameType: "competitive",
    });
  });

  it("should throw an error if the user is not in the room", () => {
    socket = { ...mockSocket, id: "other-id" } as Socket;

    expect(() =>
      startGameHandler({ ...context, socket }, mockParams)
    ).toThrowError("User is not in a room.");
  });

  it("should throw error if the players to remove field is not present", () => {
    expect(() => startGameHandler(context, {} as any)).toThrowError(
      "players_to_remove is a required field"
    );
  });
  it("should throw error if the players to remove field is not a string array", () => {
    expect(() =>
      startGameHandler(context, { players_to_remove: "test" } as any)
    ).toThrowError(
      'players_to_remove must be a `array` type, but the final value was: `"test"`.'
    );

    expect(() =>
      startGameHandler(context, { players_to_remove: [{}] } as any)
    ).toThrowError(
      "players_to_remove[0] must be a `string` type, but the final value was: `{}`."
    );
  });

  it("should throw error if the player is not the admin", () => {
    const otherSocket = { ...mockSocket, id: "other-id" } as Socket;

    roomCache.addToRoom(
      roomCache.getRoomIdByUser(mockUser.user_id) ?? "",
      { ...mockUser, user_id: "other-id" },
      otherSocket,
      "player"
    );

    expect(() =>
      startGameHandler({ ...context, socket: otherSocket }, mockParams)
    ).toThrowError("Only the host can start the game.");
  });

  it("should update the game status and start the game", () => {
    startGameHandler(context, mockParams);

    const roomId = roomCache.getRoomIdByUser(mockUser.user_id) ?? "";
    const room = roomCache.getRoomById(roomId);

    // Expect room status to be in-game
    expect(room?.game_status).toBe("in-game");
    // Expect the game to have started
    expect((room?.game_state?.setTable.length ?? 0) >= 12).toBe(true);
  });

  it("should update the lobby and the game room", () => {
    startGameHandler(context, mockParams);

    expect(updateLobbyRooms).toHaveBeenCalledWith(context);
    expect(updateGameRoom).toHaveBeenCalledWith(context, expect.any(String));
  });
});
