import express, { RequestHandler } from "express";
import { MessageController } from "../../controllers/message";
import {
  validatePhoneNumber,
  validatePhoneNumbers,
  validateSendMessage,
} from "../../middleware/validation";

const router = express.Router();
const messageController = new MessageController();

// Get chat history between two specific users
router.get(
  "/chat/:phoneNumbers",
  validatePhoneNumbers,
  messageController.getUserChatHistoryByPhone as RequestHandler
);

// Get all chat history for a specific user
router.get(
  "/user/:phoneNumber/chats",
  validatePhoneNumber,
  messageController.getAllUserChatHistory as RequestHandler
);

// Send a new message
router.post(
  "/send",
  validateSendMessage,
  messageController.sendMessage as RequestHandler
);

export default router;
