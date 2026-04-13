import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, list, stats } from "./project.controller";

const router = Router();

router.get("/", authenticate, list);
router.post("/", authenticate, create);
router.get("/:id/stats", authenticate, stats);

export default router;
