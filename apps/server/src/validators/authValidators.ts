import * as z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username too short")
    .max(20, "Username too long"),

  password: z.string().min(6, "Password too short"),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
