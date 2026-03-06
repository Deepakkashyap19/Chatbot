import express from "express";
import messageController from "../controllers/chatbot.message.js";
const router = express.Router();

router.post("/", messageController);

export default router;
