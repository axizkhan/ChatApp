import mongoose from "mongoose";
import { IUser } from "./User";

export interface IMessage {
  text: string;

  sender: mongoose.Types.ObjectId | IUser;

  createdAt: Date;
}

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Message = mongoose.model("Message", messageSchema);
