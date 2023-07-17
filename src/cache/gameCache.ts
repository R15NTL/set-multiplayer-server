import { Socket } from "socket.io";

type User = {
  user_id: string;
  username: string;
};

type UserMapValue = Socket;

type SocketMapValue = User;

type Room = {
  room_id: string;
  room_name: string;
  room_users: Map<string, User>;
  host: string;
  game_state: any;
};

export class GameCache {
  private userToSocket: Map<string, UserMapValue>;
  private sockets: Map<string, SocketMapValue>;
  private rooms: Map<string, Room>;
  private userToRoom: Map<string, string>;

  constructor() {
    this.userToSocket = new Map();
    this.sockets = new Map();
    this.rooms = new Map();
    this.userToRoom = new Map();
  }

  getUserToSocket = (uid: string) => this.userToSocket.get(uid) ?? null;
  getUserBySocketId = (socketId: string) => this.sockets.get(socketId);
  getUsersInRoom = (room: string) => this.rooms.get(room)?.room_users ?? null;

  socketConnection = (socket: Socket, user: User) => {
    this.sockets.set(socket.id, user);
    this.userToSocket.set(user.user_id, socket);
  };

  socketDisconnection = (socket: Socket) => {
    const user = this.getUserBySocketId(socket.id);

    // Remove user from room
    if (user && this.userToRoom.has(user.user_id)) {
      const room = this.userToRoom.get(user.user_id);
      if (room) {
        this.removeFromRoom(user.user_id, room);
      }
    }

    // Remove user from cache
    if (user) {
      this.userToSocket.delete(user.user_id);
      this.sockets.delete(socket.id);
    }
  };

  addToRoom = (uid: string, room: string) => {
    const socket = this.getUserToSocket(uid);
    if (!socket) {
      return;
    }
    const user = this.getUserBySocketId(socket.id);

    if (!user) {
      return;
    }

    const roomUsers = this.rooms.get(room)?.room_users;
    if (roomUsers) {
      roomUsers.set(uid, user);
      this.userToRoom.set(uid, room);
    }
  };

  removeFromRoom = (uid: string, room: string) => {
    const roomUsers = this.rooms.get(room)?.room_users;
    if (roomUsers) {
      roomUsers.delete(uid);
      this.userToRoom.delete(uid);
    }
  };
}
