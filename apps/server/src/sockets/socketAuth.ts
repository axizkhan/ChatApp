import { Socket } from "socket.io";

import { verifyToken } from "../utils/jwt";

interface JwtPayload {
  userId: string;
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = verifyToken(token) as JwtPayload;

    socket.data.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};
