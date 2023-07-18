import { Socket } from "socket.io";

export type SocketEmitter = (event: string, ...args: any[]) => void;
