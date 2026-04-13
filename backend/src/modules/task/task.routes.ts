import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, list, update, remove } from "./task.controller";

const router = Router();

router.get("/projects/:id/tasks", authenticate, list);
router.post("/projects/:id/tasks", authenticate, create);
router.patch("/tasks/:id", authenticate, update);
router.delete("/tasks/:id", authenticate, remove);

export default router;
