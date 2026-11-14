import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as encyclopediaControllers from "./encyclopedia.controllers.js";

const router = Router();

router.use(requireAuth);

router.get("/topics", encyclopediaControllers.listTopics);
router.get("/categories", encyclopediaControllers.listCategories);

router.post("/", encyclopediaControllers.create);
router.get("/:id", encyclopediaControllers.get);
router.patch("/:id", encyclopediaControllers.update);
router.delete("/:id", encyclopediaControllers.remove);

export default router;
