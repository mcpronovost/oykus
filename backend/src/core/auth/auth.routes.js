import { Router } from "express";
import { config } from "../../shared/config/index.js";
import { rateLimit } from "../../shared/middlewares/rateLimit.js";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as authControllers from "./auth.controllers.js";

const router = Router();

const authAttemptLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  keyFn: (req) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    return `${req.ip}:${email}`;
  },
});

router.post("/register", authAttemptLimit, authControllers.register);
router.post("/login", authAttemptLimit, authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/logout-all", requireAuth, authControllers.logoutEverywhere);

export default router;
