import { Server } from "socket.io";

import { Message } from "../models/Message";

import { SOCKET_EVENTS } from "@chat-app/shared/src/socket/event";

import { SendMessagePayload } from "@chat-app/shared/src/types/socket";

import { User } from "../models/User";

export const initializeSockets = (io: Server) => {
  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    console.log("Socket connected:", socket.id);
    console.log("Authenticated user:", socket.data.userId);

    socket.on(
      SOCKET_EVENTS.SEND_MESSAGE,
      async (payload: SendMessagePayload) => {
        try {
          const user = await User.findById(socket.data.userId);

          if (!user) {
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

          io.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
          socket.emit(SOCKET_EVENTS.MESSAGE_SENT, { success: true });
        } catch (error) {
          socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, {
            message: "Failed to send message",
          });
        }
      },
    );
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log("Socket disconnected:", reason);
    });
  });
};
