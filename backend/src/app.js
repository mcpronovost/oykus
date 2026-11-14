import express from "express";
import { prisma } from "./shared/db/index.js";
import { securityHeaders } from "./shared/middlewares/securityHeaders.js";
import { csrfOriginCheck } from "./shared/middlewares/csrf.js";
import errorHandler from "./shared/middlewares/errorHandler.js";
import authRoutes from "./core/auth/auth.routes.js";
import spacesRoutes from "./core/spaces/spaces.routes.js";
import usersRoutes from "./core/users/users.routes.js";
import encyclopediaRoutes from "./features/encyclopedia/encyclopedia.routes.js";
import notesRoutes from "./features/notes/notes.routes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: "100kb" }));
  app.use(csrfOriginCheck);

  app.get("/api/v1/health", async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/spaces", spacesRoutes);
  app.use("/api/v1/encyclopedia", encyclopediaRoutes);
  app.use("/api/v1/notes", notesRoutes);

  app.use(errorHandler);

  return app;
}
