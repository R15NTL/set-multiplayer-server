import { Socket } from "socket.io";
import { GameSnapshot } from "../gameLogic/gameLogic";
import { randomUUID } from "crypto";

export type User = {
  user_id: string;
  username: string;
};

export type Player = {
  score: number;
  status: "player" | "audience" | "knocked-out";
  user: User;
};

export type JoinRequestPlayer = {
  accepted: boolean;
  user: User;
};

type UserMapValue = Socket;
type SocketMapValue = User;

export interface RoomSettings {
  remove_from_lobby_in_game: boolean;
}

export type Room = {
  room_id: string;
  room_name: string;
  game_type: "knockout" | "competitive";
  room_players: Map<string, Player>;
  settings: RoomSettings;
  host: User;
  game_status: "waiting-for-players" | "in-game";
  game_state: GameSnapshot | null;
  join_requests: Map<string, JoinRequestPlayer>;
};

// Parameters for creating a room.
interface CreateRoomParams {
  roomName: string;
  gameType: Room["game_type"];
  settings: Room["settings"];
  socket: Socket;
  user: User;
}

// Parameters for creating a join request.
interface CreateJoinRequestParams {
  socket: Socket;
  user: User;
  roomId: string;
}

// RoomCache class for managing game rooms and users.
export class RoomCache {
  private userToSocket: Map<string, UserMapValue>;
  private sockets: Map<string, SocketMapValue>;
  private rooms: Map<string, Room>;
  private userToRoom: Map<string, string>;

  constructor() {
    // Initialize all maps
    this.userToSocket = new Map();
    this.sockets = new Map();
    this.rooms = new Map();
    this.userToRoom = new Map();
  }

  // Private method to add a user to the cache.
  private addUserToCache = (socket: Socket, user: User, roomId: string) => {
    this.sockets.set(socket.id, user);
    this.userToSocket.set(user.user_id, socket);
    this.userToRoom.set(user.user_id, roomId);
  };

  // Private method to remove a user from the cache.
  private removeUserFromCache = (uid: string) => {
    const socket = this.userToSocket.get(uid);
    this.userToSocket.delete(uid);
    this.userToRoom.delete(uid);
    if (socket) this.sockets.delete(socket.id);
  };

  // Method to return a socket instance associated with a given user ID.
  getUserToSocket = (uid: string) => this.userToSocket.get(uid) ?? null;

  // Method to return a user associated with a given socket ID.
  getUserBySocketId = (socketId: string) => this.sockets.get(socketId) ?? null;

  // Method to return all users present in a given room.
  getPlayersInRoom = (room: string) =>
    this.rooms.get(room)?.room_players ?? null;

  // Method to return the room associated with a given user ID.
  getRoomIdByUser = (uid: string) => this.userToRoom.get(uid) ?? null;

  // Method to return all rooms.
  getAllRooms = () => this.rooms;

  // Method to get a room by ID.
  getRoomById = (roomId: string) => this.rooms.get(roomId) ?? null;

  // Method to get a rooms join requests.
  getRoomJoinRequests = (roomId: string) =>
    this.rooms.get(roomId)?.join_requests ?? null;

  // Method to get a snapshot of the cache.
  getSnapshotOfCache = () => ({
    userToSocket: this.userToSocket,
    sockets: this.sockets,
    rooms: this.rooms,
    userToRoom: this.userToRoom,
  });

  // Method to check if a user is in a room.
  isUserInRoom = (uid: string) => this.userToRoom.has(uid);

  // Method to add a user to a room
  addToRoom = (
    roomId: string,
    user: User,
    socket: Socket,
    status: Player["status"]
  ) => {
    if (this.isUserInRoom(user.user_id))
      throw new Error("You are already in a room.");

    const room = this.rooms.get(roomId);

    if (!room) throw new Error("Room no longer exists.");

    // Remove user from join requests
    if (room.join_requests.has(user.user_id)) {
      room.join_requests.delete(user.user_id);
    }

    // Add user to cache
    this.addUserToCache(socket, user, roomId);

    // Add user to room
    const roomPlayers = room.room_players;
    roomPlayers.set(user.user_id, { user, score: 0, status });

    return true;
  };

  // Method to remove a user from a room.
  removeFromRoom = (uid: string, room: string) => {
    const currentRoom = this.rooms.get(room);
    if (!currentRoom) return null;

    const roomPlayers = currentRoom?.room_players;
    const roomJoinRequests = currentRoom?.join_requests;

    // Remove user from room players
    if (roomPlayers.has(uid)) {
      roomPlayers.delete(uid);
      this.userToRoom.delete(uid);
    }

    // Remove user from join requests
    if (roomJoinRequests.has(uid)) {
      roomJoinRequests.delete(uid);
    }

    // Remove user from cache
    this.removeUserFromCache(uid);

    // Delete room if empty
    if (roomPlayers?.size === 0) {
      // Remove all join request users from cache
      roomJoinRequests?.forEach((_, uid) => {
        this.removeUserFromCache(uid);
      });
      // Delete the room
      this.rooms.delete(room);
      return null;
    } else if (roomPlayers && currentRoom?.host.user_id === uid) {
      // If host leaves, assign new host
      currentRoom.host = Array.from(roomPlayers.values())[0].user;
    }

    return currentRoom ?? null;
  };

  // Method to create a new room.
  createRoom = ({
    user,
    socket,
    roomName,
    settings,
    gameType,
  }: CreateRoomParams) => {
    const room_id = randomUUID();

    const room: Room = {
      room_id,
      game_type: gameType,
      room_name: roomName,
      room_players: new Map(),
      settings,
      host: user,
      game_status: "waiting-for-players",
      game_state: null,
      join_requests: new Map(),
    };

    if (this.isUserInRoom(user.user_id))
      throw new Error("You are already in a room.");

    this.rooms.set(room_id, room);
    this.addToRoom(room_id, user, socket, "player");

    return room_id;
  };

  // Method to update the game status of a room.
  updateGameStatus = (room: string, status: Room["game_status"]) => {
    const roomData = this.rooms.get(room);
    if (roomData) roomData.game_status = status;
  };

  // Method to update the game state of a room.
  updateGameState = (room: string, state: Room["game_state"]) => {
    const roomData = this.rooms.get(room);
    if (roomData) roomData.game_state = state;
  };

  // Method to update game type.
  updateGameType = (room: string, gameType: Room["game_type"]) => {
    const roomData = this.rooms.get(room);
    if (roomData) roomData.game_type = gameType;
  };

  // Method to update the score of a player in a room.
  updatePlayerScore = (room: string, uid: string, score: number) => {
    const roomData = this.rooms.get(room);
    if (!roomData) return false;

    const player = roomData.room_players.get(uid);
    if (!player) return false;

    player.score = score;
    return true;
  };

  // Method to increment the score of a player.
  incrementPlayerScore = (room: string, uid: string, incrementBy: number) => {
    const roomData = this.rooms.get(room);
    if (!roomData) return false;

    const player = roomData.room_players.get(uid);
    if (!player) return false;

    player.score += incrementBy;
    return true;
  };

  // Method to reset the score of all players in a room.
  resetPlayerScores = (roomId: string) => {
    const roomData = this.getRoomById(roomId);
    if (!roomData) return false;

    const roomPlayers = roomData.room_players;
    roomPlayers.forEach((player) => {
      player.score = 0;
    });

    return true;
  };

  // Method to update a player's status.
  updatePlayerStatus = (
    roomId: string,
    uid: string,
    status: Player["status"]
  ) => {
    const roomData = this.getRoomById(roomId);
    if (!roomData) return false;

    const roomPlayers = roomData.room_players;
    const player = roomPlayers.get(uid);
    if (!player) return false;

    player.status = status;
    return true;
  };

  // Method to delete a room.
  terminateRoom = (roomId: string) => {
    const room = this.getRoomById(roomId);
    if (!room) return;

    const roomUsersArray = Array.from(room.room_players.values());

    roomUsersArray.forEach((player) => {
      this.removeFromRoom(player.user.user_id, roomId);
    });
  };

  // Method to add a user to a room's join requests.
  addToJoinRequests = ({ roomId, user, socket }: CreateJoinRequestParams) => {
    const room = this.getRoomById(roomId);
    if (!room) throw new Error("Room no longer exists.");

    if (this.isUserInRoom(user.user_id))
      throw new Error("You are already in a room.");

    room.join_requests.set(user.user_id, { accepted: false, user });

    this.addUserToCache(socket, user, roomId);
    return true;
  };

  // Method for a user to accept a join request.
  acceptJoinRequest = (
    roomId: string,
    user: User,
    socket: Socket,
    status: Player["status"]
  ) => {
    const roomJoinRequests = this.getRoomJoinRequests(roomId);

    if (!roomJoinRequests) throw new Error("Room no longer exists.");

    const userJoinRequest = roomJoinRequests.get(user.user_id);
    if (!userJoinRequest) throw new Error("Join request no longer exists.");

    if (!userJoinRequest.accepted)
      throw new Error("Join request has not been accepted yet by the host.");

    this.removeUserFromCache(user.user_id);
    this.addToRoom(roomId, user, socket, status);
  };

  // Method to accept a user's join request.
  setUserJoinRequestToAccepted = (roomId: string, uid: string) => {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error("Error accepting join request.");

    const joinRequest = room.join_requests.get(uid);
    if (!joinRequest) throw new Error("Join request no longer exists.");

    joinRequest.accepted = true;
  };

  // Method to remove a user's join request.
  removeUserJoinRequest = (roomId: string, uid: string) => {
    this.removeFromRoom(uid, roomId);
  };
}
