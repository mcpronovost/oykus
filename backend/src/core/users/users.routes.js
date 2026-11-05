import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as usersControllers from "./users.controllers.js";

const router = Router();

router.get("/me", requireAuth, usersControllers.me);

export default router;
