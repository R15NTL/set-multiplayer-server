// .env
import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";

import { events } from "./socket/events/events";

import { io, roomCache } from "./instances";

io.on("connection", (socket) => {
  socket.join("lobby");

  events({ socket });
});

const randomSecret = crypto.randomBytes(64).toString("hex");
console.log(randomSecret);
