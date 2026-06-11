import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { SOCKET_EVENTS } from "@chat-app/shared";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { initializeSockets } from "./sockets";
import { socketAuthMiddleware } from "./sockets/socketAuth";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

io.use(socketAuthMiddleware);
initializeSockets(io);

const PORT = process.env.PORT || 5000;

connectDB();
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
