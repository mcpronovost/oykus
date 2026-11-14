import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as encyclopediaControllers from "./encyclopedia.controllers.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/:topic", encyclopediaControllers.list);

export default router;
