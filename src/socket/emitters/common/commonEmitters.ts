import type { SocketEmitter } from "../types";

interface RemovedFromRoomData {
  removed_by_host: boolean;
}

interface RoomNoLongerExistsData {
  room_id: string;
}

interface ReceiveChatMessageData {
  user_id: string;
  message: string;
  message_id: string;
}

export const commonEmitters = {
  removedFromRoom: (data: RemovedFromRoomData, cb: SocketEmitter) => {
    cb("removed-from-room", data);
  },
  roomNoLongerExists: (data: RoomNoLongerExistsData, cb: SocketEmitter) => {
    cb("room-no-longer-exists", data);
  },
  joinRequestAccepted: (cb: SocketEmitter) => {
    cb("join-request-accepted");
  },
  receiveChatMessage: (data: ReceiveChatMessageData, cb: SocketEmitter) => {
    cb("receive-chat-message", data);
  },
};
