import { api } from "./api";

export const fetchMessages = async () => {
  const response = await api.get("/messages");

  return response.data.data;
};
