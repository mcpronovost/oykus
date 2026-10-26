import express from "express";
import { prisma } from "./db/index.js";
import errorHandler from "./shared/middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  });

  // mount core and plugin routes here

  app.use(errorHandler);

  return app;
}