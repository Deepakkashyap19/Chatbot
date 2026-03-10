import express from "express";
import messageController from "../controllers/chatbot.message.js";
const router = express.Router();

router.post("https://chatbot-1-pngn.onrender.com/", messageController);

export default router;
