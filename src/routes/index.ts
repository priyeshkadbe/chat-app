import express from "express";
import v1MessageRoutes from "./v1/message";

const router = express.Router();

router.use("/v1/messages", v1MessageRoutes);

export default router;
