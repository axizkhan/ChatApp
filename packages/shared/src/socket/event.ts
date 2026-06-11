export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECTING: "connecting",
  RECONNECTING: "reconnecting",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  MESSAGE_SENT: "message_sent",
  MESSAGE_ERROR: "message_error",
} as const;
