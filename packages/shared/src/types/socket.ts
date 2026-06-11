export interface SendMessagePayload {
  text: string;
}

export interface ReceiveMessagePayload {
  _id?: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

export interface MessageErrorPayload {
  message: string;
}

export interface MessageSentPayload {
  success: boolean;
}
