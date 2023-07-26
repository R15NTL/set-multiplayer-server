// .env
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { RoomCache } from "./cache/roomCache";

const app = express();

// Get the CORS origins from the .env file
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

// Set up CORS
const corsOptions = {
  origin: corsOrigins,
  methods: ["GET", "POST"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const httpServer = createServer(app);

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export const io = new Server(httpServer);
export const roomCache = new RoomCache();
