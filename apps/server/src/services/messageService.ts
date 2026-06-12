import { Message } from "../models/Message";
import { IUser } from "../models/User";
import { IMessage } from "../models/Message";

export const getMessages = async () => {
  const messages = await Message.find()
    .populate<{ sender: IUser }>("sender", "username")
    .sort({ createdAt: 1 });

  return messages.map((message) => {
    const sender = message.sender as IUser;
    return {
      _id: message.id,

      text: message.text,

      senderId: sender._id.toString(),

      senderName: sender.username,

      createdAt: message.createdAt.toISOString(),
    };
  });
};
