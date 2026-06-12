import { Server } from "socket.io";

import { Message } from "../models/Message";

import { SOCKET_EVENTS } from "@chat-app/shared";

import { SendMessagePayload } from "@chat-app/shared";

import { User } from "../models/User";

export const initializeSockets = (io: Server) => {
  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    console.log("Socket connected:", socket.id);
    console.log("Authenticated user:", socket.data.userId);

    socket.on(
      SOCKET_EVENTS.SEND_MESSAGE,
      async (payload: SendMessagePayload, callback?: Function) => {
        try {
          const user = await User.findById(socket.data.userId);

          if (!user) {
            if (callback) callback({ success: false, error: "User not found" });
            return socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, {
              message: "User not found",
            });
          }

          const savedMessage = await Message.create({
            text: payload.text,
            sender: user._id,
          });

          const message = {
            _id: savedMessage.id,
            text: savedMessage.text,
            senderId: user.id,
            senderName: user.username,
            createdAt: savedMessage.createdAt.toISOString(),
          };

          socket.broadcast.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
          if (callback) {
            callback({ success: true, message });
          } else {
            socket.emit(SOCKET_EVENTS.MESSAGE_SENT, { success: true });
          }
        } catch (error) {
          if (callback)
            callback({ success: false, error: "Failed to send message" });
          socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, {
            message: "Failed to send message",
          });
        }
      },
    );
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on(SOCKET_EVENTS.START_TYPING, async () => {
      const user = await User.findById(socket.data.userId);
      if (user) {
        socket.broadcast.emit(SOCKET_EVENTS.USER_TYPING, {
          userId: user.id,
          username: user.username,
          isTyping: true,
        });
      }
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, async () => {
      const user = await User.findById(socket.data.userId);
      if (user) {
        socket.broadcast.emit(SOCKET_EVENTS.USER_TYPING, {
          userId: user.id,
          username: user.username,
          isTyping: false,
        });
      }
    });
  });
};
