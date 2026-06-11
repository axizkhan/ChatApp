import { io, Socket } from "socket.io-client";

import { SOCKET_EVENTS } from "@chat-app/shared/src/socket/event";

import { ConnectionStatus } from "../types/socket";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

class SocketService {
  private socket: Socket | null = null;
  private connectionStatus: ConnectionStatus = "disconnected";

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.connectionStatus = "connecting";

    this.socket = io(SOCKET_URL as string, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("Socket connected");
      this.connectionStatus = "connected";
    });

    this.socket.on("reconnect_attempt", () => {
      console.log("Socket reconnecting");
      this.connectionStatus = "reconnecting";
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Socket disconnected");
      this.connectionStatus = "disconnected";
    });

    this.socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });
  }
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.connectionStatus = "disconnected";
  }

  emit(event: string, payload?: unknown) {
    this.socket?.emit(event, payload);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  getSocket() {
    return this.socket;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }
}
export const socketService = new SocketService();
