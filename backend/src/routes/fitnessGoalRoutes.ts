import { Router } from "express";
import { getGoals, upsertTargets, updateProgress } from "../controllers/fitnessGoalController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getGoals);           // GET /api/goals
router.post("/", authMiddleware, upsertTargets);     // POST /api/goals (set targets)
router.patch("/progress", authMiddleware, updateProgress); // PATCH /api/goals/progress

export default router;
