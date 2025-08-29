import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createFitnessGoals,
  getFitnessGoals,
  logFitnessActivity,
  updateFitnessProgress
} from "../controllers/fitnessController";

const router = express.Router();

// Create/update fitness goals from quiz data
router.post("/goals", authMiddleware, createFitnessGoals);

// Get fitness goals and progress
router.get("/goals", authMiddleware, getFitnessGoals);

// Log fitness activity
router.post("/log", authMiddleware, logFitnessActivity);

// Update fitness progress (for manual updates)
router.patch("/goals/progress", authMiddleware, updateFitnessProgress);

export default router;
