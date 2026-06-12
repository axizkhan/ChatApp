export type MessageStatus = "sending" | "sent" | "failed";

export interface Message {
  _id?: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: string;
  status?: MessageStatus;
}
