import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import * as notesControllers from "./notes.controllers.js";

const router = Router();

router.use(requireAuth);

router.get("/categories", notesControllers.listCategories);
router.post("/categories", notesControllers.createCategory);
router.patch("/categories/:id", notesControllers.updateCategory);
router.delete("/categories/:id", notesControllers.removeCategory);

router.get("/", notesControllers.list);
router.post("/", notesControllers.create);
router.get("/:id", notesControllers.get);
router.patch("/:id", notesControllers.update);
router.delete("/:id", notesControllers.remove);

export default router;
