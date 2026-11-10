import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as usersControllers from "./users.controllers.js";

const router = Router();

router.get("/me", requireAuth, usersControllers.me);
router.patch("/me/current-space", requireAuth, usersControllers.setCurrentSpace);

export default router;
