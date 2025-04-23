import { PrismaClient } from "@prisma/client";
import express from "express";
import { SERVER_CONFIG } from "../config/server-config";
import { errorHandler } from "../middleware/errorHandler";
import apiRoutes from "../routes";

export const createServer = (prisma: PrismaClient) => {
  const app = express();

  app.use(express.json());
  app.use("/api", apiRoutes);
  app.use(errorHandler);

  return app;
};

export const getServerPort = (): number => {
  return SERVER_CONFIG.PORT;
};
