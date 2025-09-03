import express from "express";
import {
  getSchedule,
  addMedication,
  updateStatus,
  getUserMedications,
  addMedicationSchedule,
  updateMedicationSchedule,
  getMedicationHistory,
  getTodaySchedule,
  markMedicationTaken,
  markMedicationMissed,
  getPendingMedications
} from "../controllers/medicationController";
import authMiddleware from "../middleware/authMiddleware";
import { getSuggestions, acceptSuggestion, rejectSuggestion } from "../controllers/suggestionController";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user medications
router.get("/user", getUserMedications);

// Add medication to schedule
router.post("/schedule", addMedicationSchedule);

// Update medication schedule
router.patch("/schedule/:id", updateMedicationSchedule);

// Get medication history
router.get("/history", getMedicationHistory);

// Get today's medication schedule
router.get("/today", getTodaySchedule);

// Mark medication as taken
router.patch("/:id/taken", markMedicationTaken);

// Mark medication as missed
router.patch("/:id/missed", markMedicationMissed);

// Get pending medications (for quiz/initialization)
router.get("/pending", getPendingMedications);

// New routes
router.get("/schedule", getSchedule);
router.post("/add", addMedication);
router.patch("/:id/status", updateStatus);

// Suggestion routes
router.get("/", getSuggestions);
router.patch("/:id/accept", acceptSuggestion);
router.patch("/:id/reject", rejectSuggestion);

export default router;