import { PrismaClient } from "@prisma/client";
import { DatabaseError, NotFoundError } from "../utils/errors";

interface FormattedMessage {
  content: string;
  createdAt: string;
  senderPhone: string;
  receiverPhone: string;
  senderName: string;
  receiverName: string;
}

export class Messages {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private formatMessage(message: any): FormattedMessage {
    return {
      content: message.content,
      createdAt: message.createdAt,
      senderPhone: message.sender.phoneNumber,
      receiverPhone: message.receiver.phoneNumber,
      senderName: message.sender.username,
      receiverName: message.receiver.username,
    };
  }

  async getMessagesBetweenUsersByPhone(
    phone1: string,
    phone2: string
  ): Promise<FormattedMessage[]> {
    try {
      const user1 = await this.prisma.user.findUnique({
        where: { phoneNumber: phone1 },
      });

      const user2 = await this.prisma.user.findUnique({
        where: { phoneNumber: phone2 },
      });

      if (!user1 || !user2) {
        throw new NotFoundError("One or both users not found");
      }

      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: user1.id, receiverId: user2.id },
            { senderId: user2.id, receiverId: user1.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { username: true, phoneNumber: true } },
          receiver: { select: { username: true, phoneNumber: true } },
        },
      });

      return messages.map(this.formatMessage);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch messages between users");
    }
  }

  async getAllMessagesForUser(
    phoneNumber: string
  ): Promise<FormattedMessage[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const messages = await this.prisma.message.findMany({
        where: {
          OR: [{ senderId: user.id }, { receiverId: user.id }],
        },
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { username: true, phoneNumber: true } },
          receiver: { select: { username: true, phoneNumber: true } },
        },
      });

      return messages.map(this.formatMessage);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch user messages");
    }
  }

  async sendMessage(
    senderPhone: string,
    receiverPhone: string,
    content: string
  ): Promise<FormattedMessage> {
    try {
      const sender = await this.prisma.user.findUnique({
        where: { phoneNumber: senderPhone },
      });

      const receiver = await this.prisma.user.findUnique({
        where: { phoneNumber: receiverPhone },
      });

      if (!sender || !receiver) {
        throw new NotFoundError("One or both users not found");
      }

      const message = await this.prisma.message.create({
        data: {
          content,
          senderId: sender.id,
          receiverId: receiver.id,
        },
        include: {
          sender: { select: { username: true, phoneNumber: true } },
          receiver: { select: { username: true, phoneNumber: true } },
        },
      });

      return this.formatMessage(message);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to send message");
    }
  }
}
