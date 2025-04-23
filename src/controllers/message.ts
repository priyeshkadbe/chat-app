import { Request, Response } from "express";
import { Messages } from "../services/messages";
import { DatabaseError, NotFoundError, ValidationError } from "../utils/errors";

export class MessageController {
  private messages: Messages;

  constructor() {
    this.messages = new Messages();
  }

  getUserChatHistoryByPhone = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { phoneNumbers } = req.params;
      const [phone1, phone2] = phoneNumbers.split("-");

      if (!phone1 || !phone2) {
        throw new ValidationError(
          "Both phone numbers are required and should be separated by a hyphen"
        );
      }

      const messages = await this.messages.getMessagesBetweenUsersByPhone(
        phone1,
        phone2
      );

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch chat history");
    }
  };

  getAllUserChatHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { phoneNumber } = req.params;

      if (!phoneNumber) {
        throw new ValidationError("Phone number is required");
      }

      const messages = await this.messages.getAllMessagesForUser(phoneNumber);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch chat history");
    }
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { senderPhone, receiverPhone, content } = req.body;

      if (!senderPhone || !receiverPhone || !content) {
        throw new ValidationError(
          "Sender phone, receiver phone, and message content are required"
        );
      }

      const message = await this.messages.sendMessage(
        senderPhone,
        receiverPhone,
        content
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to send message");
    }
  };
}
