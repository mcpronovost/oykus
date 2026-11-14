import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as notesControllers from "./notes.controllers.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", notesControllers.list);

export default router;
