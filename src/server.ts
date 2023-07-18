import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { RoomCache } from "./cache/roomCache";
import { verifyToken } from "./auth/verifyToken";
import { events } from "./socket/events/events";

// .env
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
const roomCache = new RoomCache();

io.on("connection", (socket) => {
  const token =
    socket.handshake.auth.token ??
    socket.handshake.query["development-access-token"];

  console.log("token", token);

  if (!token) {
    socket.emit("error", "No token provided");
    socket.disconnect();
    return;
  }

  const user = verifyToken(token);

  if (!user) {
    socket.emit("error", "Invalid token");
    socket.disconnect();
    return;
  }

  socket.join("lobby");

  events(io, socket, roomCache);
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
