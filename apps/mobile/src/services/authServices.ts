import { api } from "./api";

import { AuthResponse } from "../types/auth";

export const registerUser = async (username: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/register", {
    username,
    password,
  });

  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", {
    username,
    password,
  });

  return response.data;
};
