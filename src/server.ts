// .env
import dotenv from "dotenv";
dotenv.config();

import { events } from "./socket/events/events";

import { io, roomCache } from "./instances";

io.on("connection", (socket) => {
  socket.join("lobby");

  events({ socket });
});
