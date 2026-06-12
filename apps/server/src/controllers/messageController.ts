import { Request, Response } from "express";

import { getMessages } from "../services/messageService";
import { successResponse } from "../utils/apiResponse";

export const fetchMessages = async (req: Request, res: Response) => {
  const messages = await getMessages();

  res
    .status(200)
    .json(successResponse("Messages Load Successfully", { data: messages }));
};
