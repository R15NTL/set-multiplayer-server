import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
