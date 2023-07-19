import { RoomCache, User, Room } from "../../src/cache/roomCache";
import { Socket } from "socket.io";

// Mock randomUUID from 'crypto' to return a predictable value.
jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "1234"),
}));

// Mocking the socket instance.
const mockSocket = (id?: string) => ({ id: id ?? "socketId" } as Socket);

describe("RoomCache", () => {
  let roomCache: RoomCache;

  let testUser: User;
  let secondUser: User;
  let thirdUser: User;
  let fourthUser: User;

  let testSocket: Socket;
  let testSettings: Room["settings"];

  beforeEach(() => {
    testUser = { user_id: "user1", username: "TestUser" };
    secondUser = { user_id: "user2", username: "TestUser2" };
    thirdUser = { user_id: "user3", username: "TestUser3" };
    fourthUser = { user_id: "user4", username: "TestUser4" };

    roomCache = new RoomCache();
    testSocket = mockSocket();
    testSettings = { remove_from_lobby_in_game: true };
  });

  test("createRoom should create a room and return room id", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });
    expect(roomId).toEqual("1234");
  });

  test("createRoom should throw an error when creating a room with a user that is already in a room", () => {
    const roomIdA = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room A",
      settings: testSettings,
      gameType: "competitive",
    });

    expect(() =>
      roomCache.createRoom({
        user: testUser,
        socket: mockSocket("socketId2"),
        roomName: "Test Room B",
        settings: testSettings,
        gameType: "competitive",
      })
    ).toThrowError("You are already in a room.");

    expect(roomCache.getAllRooms().size).toEqual(1);
  });

  test("createRoom should add user to cache when creating a room", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });
    // Get socket from cache by user id.
    const socket = roomCache.getUserToSocket(testUser.user_id);
    // Get user from cache by this socket id.
    const user = roomCache.getUserBySocketId(socket?.id ?? "");
    expect(user).toEqual(testUser);

    // Expect the user room to match the newly created room.
    expect(roomCache.getRoomIdByUser(testUser.user_id)).toEqual(roomId);
  });

  test("createRoom should add a user to cache when adding a user to a room", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.addToRoom(roomId, secondUser, mockSocket("socketId2"), "player");

    // Get socket from cache by user id.
    const socket = roomCache.getUserToSocket(secondUser.user_id);
    // Get user from cache by this socket id.
    const user = roomCache.getUserBySocketId(socket?.id ?? "");
    expect(user).toEqual(secondUser);

    // Expect the user room to match the newly created room.
    expect(roomCache.getRoomIdByUser(secondUser.user_id)).toEqual(roomId);
  });

  test("addToRoom should add an additional to room", () => {
    const additionalUser = { user_id: "user2", username: "TestUser2" };

    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.addToRoom(
      roomId,
      additionalUser,
      mockSocket("additionalSocketId"),
      "player"
    );

    const roomUsers = roomCache.getPlayersInRoom(roomId);

    expect(roomUsers?.size).toEqual(2);
    expect(roomUsers?.get(testUser.user_id)?.user).toEqual(testUser);
    expect(roomUsers?.get(additionalUser.user_id)?.user).toEqual(
      additionalUser
    );
  });

  test("addToRoom should throw an error when adding a user that is already in a room to a room", () => {
    // Create a room.
    const roomIdA = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room A",
      settings: testSettings,
      gameType: "competitive",
    });

    // Create a second room.
    roomCache.createRoom({
      user: secondUser,
      socket: mockSocket("socketId2"),
      roomName: "Test Room B",
      settings: testSettings,
      gameType: "competitive",
    });

    expect(() =>
      roomCache.addToRoom(
        roomIdA,
        secondUser,
        mockSocket("socketId2"),
        "player"
      )
    ).toThrowError("You are already in a room.");
  });

  test("AddToRoom should throw an error when adding a user to a room that does not exist", () => {
    expect(() =>
      roomCache.addToRoom(
        "nonExistentRoomId",
        secondUser,
        mockSocket("socketId2"),
        "player"
      )
    ).toThrowError("Room no longer exists.");
  });

  test("removeFromRoom should remove user from room with two users, update the cache and update host", () => {
    const secondUser = { user_id: "user2", username: "TestUser2" };

    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.addToRoom(
      roomId,
      secondUser,
      mockSocket("additionalSocketId"),
      "player"
    );

    roomCache.removeFromRoom(testUser.user_id, roomId);
    const roomUsers = roomCache.getPlayersInRoom(roomId);

    // Expect the second user to still be in the room
    expect(roomUsers?.get(secondUser.user_id)?.user).toEqual(secondUser);
    // Check the room size
    expect(roomUsers?.size).toEqual(1);
    // Expect the host to be updated to the second user
    expect(roomCache.getRoomById(roomId)?.host).toEqual(secondUser);
    // Expect the first user to be removed from the cache
    expect(roomCache.getUserBySocketId(testSocket.id)).toBeNull();
    expect(roomCache.getUserToSocket(testUser.user_id)).toBeNull();
  });

  test("removeFromRoom should delete room when last user is removed", () => {
    const secondUser = { user_id: "user2", username: "TestUser2" };

    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.addToRoom(
      roomId,
      secondUser,
      mockSocket("additionalSocketId"),
      "player"
    );

    // Expect the room to exist
    expect(roomCache.getRoomById(roomId)).toBeTruthy();

    // Expect the first user to be in the room
    expect(
      roomCache.getPlayersInRoom(roomId)?.get(testUser.user_id)?.user
    ).toEqual(testUser);
    // Expect the second user to be in the room
    expect(
      roomCache.getPlayersInRoom(roomId)?.get(secondUser.user_id)?.user
    ).toEqual(secondUser);

    // Remove the first user from the room
    roomCache.removeFromRoom(testUser.user_id, roomId);
    // Expect the first user to be removed from the cache
    expect(roomCache.getUserBySocketId(testSocket.id)).toBeNull();
    expect(roomCache.getUserToSocket(testUser.user_id)).toBeNull();

    roomCache.removeFromRoom(secondUser.user_id, roomId);
    // Expect the second user to be removed from the cache
    expect(roomCache.getUserBySocketId("additionalSocketId")).toBeNull();
    expect(roomCache.getUserToSocket(secondUser.user_id)).toBeNull();

    // Expect the room to be deleted
    const room = roomCache.getRoomById(roomId);
    expect(room).toBeNull();
  });

  it("should update game status", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    const room = roomCache.getRoomById(roomId);

    // Expect the game status to be waiting-for-players
    expect(room?.game_status).toEqual("waiting-for-players");
    // Update the game status to in-game
    roomCache.updateGameStatus(roomId, "in-game");
    expect(room?.game_status).toEqual("in-game");
  });

  test("terminateRoom should terminate room and remove all users from cache", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    // Add 3 more users to the room

    roomCache.addToRoom(
      roomId,
      secondUser,
      mockSocket("secondSocketId"),
      "player"
    );
    roomCache.addToRoom(
      roomId,
      thirdUser,
      mockSocket("thirdSocketId"),
      "player"
    );
    roomCache.addToRoom(
      roomId,
      fourthUser,
      mockSocket("forthSocketId"),
      "player"
    );

    roomCache.terminateRoom(roomId);
    const room = roomCache.getRoomById(roomId);
    expect(room).toBeNull();

    // Expect all users to be removed from the cache
    expect(roomCache.getUserBySocketId(testSocket.id)).toBeNull();
    expect(roomCache.getUserToSocket(testUser.user_id)).toBeNull();

    expect(roomCache.getUserBySocketId("secondSocketId")).toBeNull();
    expect(roomCache.getUserToSocket(secondUser.user_id)).toBeNull();

    expect(roomCache.getUserBySocketId("thirdSocketId")).toBeNull();
    expect(roomCache.getUserToSocket(thirdUser.user_id)).toBeNull();

    expect(roomCache.getUserBySocketId("forthSocketId")).toBeNull();
    expect(roomCache.getUserToSocket(fourthUser.user_id)).toBeNull();
  });

  test("addToJoinRequests should add user to join requests", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    // Add second user to join requests
    roomCache.addToJoinRequests({
      roomId,
      user: secondUser,
      socket: mockSocket("secondSocketId"),
    });

    // Expect second user to be in join requests
    expect(
      roomCache.getRoomJoinRequests(roomId)?.get(secondUser.user_id)?.user
    ).toEqual(secondUser);
  });

  test("acceptJoinRequest should throw an error room does not exist", () => {
    expect(() => {
      roomCache.acceptJoinRequest(
        "non-existent-room-id",
        secondUser,
        mockSocket("secondSocketId"),
        "player"
      );
    }).toThrowError("Room no longer exists.");
  });

  test("acceptJoinRequest should throw an error if user has not been accepted by the host", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.addToJoinRequests({
      roomId,
      user: secondUser,
      socket: mockSocket("secondSocketId"),
    });

    expect(() =>
      roomCache.acceptJoinRequest(
        roomId,
        secondUser,
        mockSocket("secondSocketId"),
        "player"
      )
    ).toThrowError("Join request has not been accepted yet by the host.");
  });

  test("acceptJoinRequest should throw an error if user is not in join requests", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    expect(() =>
      roomCache.acceptJoinRequest(
        roomId,
        secondUser,
        mockSocket("secondSocketId"),
        "player"
      )
    ).toThrowError("Join request no longer exists.");
  });

  test("acceptJoinRequest should remove user from join requests then add to the room", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    // Add second user to join requests
    roomCache.addToJoinRequests({
      roomId,
      user: secondUser,
      socket: mockSocket("secondSocketId"),
    });

    // Expect second user to be in join requests
    expect(
      roomCache.getRoomJoinRequests(roomId)?.get(secondUser.user_id)?.user
    ).toEqual(secondUser);

    // Set join request to accepted
    roomCache.setUserJoinRequestToAccepted(roomId, secondUser.user_id);

    // Add second user to the room
    roomCache.acceptJoinRequest(
      roomId,
      secondUser,
      mockSocket("secondSocketId"),
      "player"
    );

    // Expect the second user to be in the room
    expect(
      roomCache.getPlayersInRoom(roomId)?.get(secondUser.user_id)?.user
    ).toEqual(secondUser);

    // Expect second user to be removed from join requests
    expect(
      roomCache.getRoomJoinRequests(roomId)?.get(secondUser.user_id)
    ).toBeUndefined();
  });

  test("removeJoinRequest should remove user from join requests", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });
    // Add second user to join requests
    roomCache.addToJoinRequests({
      roomId,
      user: secondUser,
      socket: mockSocket("secondSocketId"),
    });

    // Expect second user to be in join requests
    expect(
      roomCache.getRoomJoinRequests(roomId)?.get(secondUser.user_id)?.user
    ).toEqual(secondUser);

    // Remove second user from join requests
    roomCache.removeUserJoinRequest(roomId, secondUser.user_id);

    // Expect second user to be removed from join requests
    expect(
      roomCache.getRoomJoinRequests(roomId)?.get(secondUser.user_id)
    ).toBeUndefined();

    // Expect second user not to be in cache
    expect(roomCache.getUserBySocketId("secondSocketId")).toBeNull();
    expect(roomCache.getUserToSocket(secondUser.user_id)).toBeNull();
    expect(roomCache.isUserInRoom(secondUser.user_id)).toBe(false);
  });

  test("resetPlayerScores should update player scores", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.updatePlayerScore(roomId, testUser.user_id, 10);

    const player = roomCache.getPlayersInRoom(roomId)?.get(testUser.user_id);
    expect(player?.score).toEqual(10);
  });

  test("resetPlayerScores should reset all player scores", () => {
    const roomId = roomCache.createRoom({
      user: testUser,
      socket: testSocket,
      roomName: "Test Room",
      settings: testSettings,
      gameType: "competitive",
    });

    roomCache.addToRoom(
      roomId,
      secondUser,
      mockSocket("secondSocketId"),
      "player"
    );

    roomCache.addToRoom(
      roomId,
      thirdUser,
      mockSocket("thirdSocketId"),
      "player"
    );

    roomCache.updatePlayerScore(roomId, testUser.user_id, 10);
    roomCache.updatePlayerScore(roomId, secondUser.user_id, 20);
    roomCache.updatePlayerScore(roomId, thirdUser.user_id, 30);
    expect(
      roomCache.getPlayersInRoom(roomId)?.get(testUser.user_id)?.score
    ).toEqual(10);
    expect(
      roomCache.getPlayersInRoom(roomId)?.get(secondUser.user_id)?.score
    ).toEqual(20);
    expect(
      roomCache.getPlayersInRoom(roomId)?.get(thirdUser.user_id)?.score
    ).toEqual(30);

    roomCache.resetPlayerScores(roomId);

    const players = roomCache.getPlayersInRoom(roomId);

    expect(players?.get(testUser.user_id)?.score).toEqual(0);
    expect(players?.get(secondUser.user_id)?.score).toEqual(0);
    expect(players?.get(thirdUser.user_id)?.score).toEqual(0);
  });
});
