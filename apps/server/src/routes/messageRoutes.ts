import { Router } from "express";

import { fetchMessages } from "../controllers/messageController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, fetchMessages);

export default router;
