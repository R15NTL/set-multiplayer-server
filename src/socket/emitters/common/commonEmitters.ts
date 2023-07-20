import type { SocketEmitter } from "../types";

interface RemovedFromRoomData {
  removed_by_host: boolean;
}

export const commonEmitters = {
  removedFromRoom: (data: RemovedFromRoomData, cb: SocketEmitter) => {
    cb("removed-from-room", data);
  },
};
