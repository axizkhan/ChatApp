import { api } from "./api";

export const fetchMessages = async () => {
  console.log("fetch message recieve api calledd");
  const response = await api.get("/messages");

  return response.data.data;
};
