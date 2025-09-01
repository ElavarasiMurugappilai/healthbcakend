import { Router } from "express";
import { getGoals, upsertTargets, updateProgress } from "../controllers/fitnessGoalController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getGoals);           // GET /api/goals
router.post("/", authenticateToken, upsertTargets);     // POST /api/goals (set targets)
router.patch("/progress", authenticateToken, updateProgress); // PATCH /api/goals/progress

export default router;
