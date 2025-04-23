import dotenv from "dotenv";

dotenv.config();

export const SERVER_CONFIG = {
  PORT: Number(process.env.PORT) || 8080,
  DATABASE_URL: process.env.DATABASE_URL || "",
};
