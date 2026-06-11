import { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";

import { errorResponse } from "../utils/apiResponse";

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(400).json(errorResponse(error.issues.join()));
  }

  return res.status(500).json(errorResponse("Internal server error"));
};
