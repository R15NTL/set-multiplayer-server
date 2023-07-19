import { createRoomHandler } from "../../../../../src/socket/events/handlers/lobby/create-room";
import { RoomCache } from "../../../../../src/cache/roomCache";
import { Socket, Server } from "socket.io";
import { IOContext } from "../../../../../src/types/context";
import { verifyToken } from "../../../../../src/auth/verifyToken";
import { updateGameRoom } from "../../../../../src/socket/emitters/game/emitToGame";

jest.mock("../../../../../src/auth/verifyToken", () => ({
  ...jest.requireActual("../../../../../src/auth/verifyToken"),
  verifyToken: jest.fn(),
}));

jest.mock("../../../../../src/socket/emitters/game/emitToGame", () => ({
  ...jest.requireActual("../../../../../src/socket/emitters/game/emitToGame"),
  updateGameRoom: jest.fn(),
}));

const mockSocket: Partial<Socket> = {
  join: jest.fn(),
  emit: jest.fn(),
};

const mockServer: Partial<Server> = {
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
};

const mockParams = {
  token: "test",
  room_name: "test",
  game_type: "competitive",
  settings: {
    remove_from_lobby_in_game: false,
  },
} as any;

const mockUser = {
  user_id: "test",
  username: "Test User",
};

describe("createRoomHandler", () => {
  let roomCache: RoomCache;
  let io: Server;
  let socket: Socket;
  let context: IOContext;

  beforeEach(() => {
    roomCache = new RoomCache();
    socket = mockSocket as Socket;
    io = mockServer as Server;
    (verifyToken as jest.Mock).mockReturnValue(mockUser);
    context = {
      roomCache,
      socket,
      io,
    };
  });

  it("should throw an error when token is missing", async () => {
    const params = {
      room_name: "test",
      game_type: "competitive",
      settings: {
        remove_from_lobby_in_game: false,
      },
    } as any;

    await expect(createRoomHandler(context, params)).rejects.toThrow(
      "token is a required field"
    );
  });
  it("should throw an error when room_name is missing", async () => {
    const params = {
      token: "test",
      game_type: "competitive",
      settings: {
        remove_from_lobby_in_game: false,
      },
    } as any;

    await expect(createRoomHandler(context, params)).rejects.toThrow(
      "room_name is a required field"
    );
  });
  it("should throw an error when game_type is missing", async () => {
    const params = {
      token: "test",
      room_name: "test",
      settings: {
        remove_from_lobby_in_game: false,
      },
    } as any;

    await expect(createRoomHandler(context, params)).rejects.toThrow(
      "game_type is a required field"
    );
  });

  it("should throw an error when settings.remove_from_lobby_in_game is missing", async () => {
    const params = {
      token: "test",
      room_name: "test",
      game_type: "competitive",
      settings: {},
    } as any;

    await expect(createRoomHandler(context, params)).rejects.toThrow(
      "settings.remove_from_lobby_in_game is a required field"
    );
  });

  it("should throw an error when game_type is not a supported value", async () => {
    const params = {
      token: "test",
      room_name: "test",
      game_type: "test",
      settings: {
        remove_from_lobby_in_game: false,
      },
    } as any;

    await expect(createRoomHandler(context, params)).rejects.toThrow(
      "game_type must be one of the following values: competitive, knockout"
    );
  });

  it("should throw an error when token is invalid", async () => {
    (verifyToken as jest.Mock).mockReturnValue(null);

    await expect(createRoomHandler(context, mockParams)).rejects.toThrow(
      "Invalid token"
    );
  });

  it("should successfully create a room", async () => {
    await createRoomHandler(context, mockParams);

    // Expect there to be 1 room in the cache
    expect(roomCache.getAllRooms().size).toBe(1);

    const roomId = roomCache.getRoomIdByUser(mockUser.user_id);
    const room = roomCache.getRoomById(roomId ?? "");

    // Expect room to exist
    expect(roomId).toBeTruthy();
    // Expect room have been created with the correct values
    expect(room?.room_name).toBe(mockParams.room_name);
    expect(room?.game_type).toBe(mockParams.game_type);
    expect(room?.settings).toEqual(mockParams.settings);
    // Expect the host to be the user that created the room
    expect(room?.host.user_id).toBe(mockUser.user_id);
    // Expect the room to have 1 player
    expect(room?.room_players.size).toBe(1);
    // Expect user who created the room to be in the room
    expect(room?.room_players.get(mockUser.user_id)).toBeTruthy();

    // Expect the socket to have joined the room
    expect(socket.join).toHaveBeenCalledWith(roomId);

    // Expect the updateGameRoom emitter to have been called
    expect(updateGameRoom).toHaveBeenCalledWith(context, roomId);
  });
});
