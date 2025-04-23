import { PrismaClient } from "@prisma/client";
import express from "express";
import { SERVER_CONFIG } from "./config/server-config";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";
import { DatabaseError } from "./utils/errors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use("/api", apiRoutes);
app.use(errorHandler);

const setupDatabaseConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB successfully with Prisma!");
  } catch (error) {
    console.error("Failed to connect to MongoDB with Prisma:", error);
    throw new DatabaseError("Failed to connect to database");
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error during database disconnection:", error);
  }
};

const setupGracefulShutdown = (): void => {
  const gracefulShutdown = async (): Promise<void> => {
    console.log("Shutting down gracefully...");
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    await gracefulShutdown();
  });
  process.on("unhandledRejection", async (error) => {
    console.error("Unhandled Rejection:", error);
    await gracefulShutdown();
  });
};

const startServer = async (): Promise<void> => {
  try {
    await setupDatabaseConnection();
    setupGracefulShutdown();
    app.listen(SERVER_CONFIG.PORT, () => {
      console.log(`Server running on port ${SERVER_CONFIG.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
