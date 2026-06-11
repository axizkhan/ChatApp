import { Request, Response } from "express";

import { errorResponse, successResponse } from "../utils/apiResponse";

import { loginSchema, registerSchema } from "../validators/authValidators";

import { loginUser, registerUser } from "../services/authService";

import { generateToken } from "../utils/jwt";

import { User } from "../models/User";

import { AuthRequest } from "../middleware/authMiddleware";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(
      validatedData.username,
      validatedData.password,
    );

    const token = generateToken(user.id);

    return res.status(201).json(
      successResponse("Registration successful", {
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      }),
    );
  } catch (error: any) {
    return res.status(400).json(errorResponse(error.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginUser(
      validatedData.username,
      validatedData.password,
    );

    const token = generateToken(user.id);

    return res.json(
      successResponse("Login successful", {
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      }),
    );
  } catch (error: any) {
    return res.status(400).json(errorResponse(error.message));
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    return res.json(successResponse("User fetched successfully", user));
  } catch (error: any) {
    return res.status(400).json(errorResponse(error.message));
  }
};
