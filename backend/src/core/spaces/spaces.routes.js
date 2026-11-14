import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as spacesControllers from "./spaces.controllers.js";

const router = Router();

router.use(requireAuth);

router.get("/", spacesControllers.list);
router.post("/", spacesControllers.create);
router.get("/:id/stats", spacesControllers.stats);
router.delete("/:id", spacesControllers.remove);

export default router;
