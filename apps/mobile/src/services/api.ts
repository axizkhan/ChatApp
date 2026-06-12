import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },

  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired");

      useAuth().logout();
    }

    return Promise.reject(error);
  },
);
