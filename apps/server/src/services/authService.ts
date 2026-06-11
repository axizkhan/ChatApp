import bcrypt from "bcryptjs";

import { User } from "../models/User";

export const registerUser = async (username: string, password: string) => {
  const existingUser = await User.findOne({
    username,
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};
