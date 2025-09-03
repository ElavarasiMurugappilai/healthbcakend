import express from "express";
import { 
  suggestMedication, 
  updateMedicationStatus, 
  getUserMedications, 
  getPendingMedications,
  getMedicationHistory,
  getTodaySchedule,
  markMedicationTaken,
  markMedicationMissed
} from "../controllers/medicationController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// POST /api/medication/suggest
router.post("/suggest", authenticateToken, suggestMedication);

// GET /api/medication/user
router.get("/user", authenticateToken, getUserMedications);

// GET /api/medication/pending
router.get("/pending", authenticateToken, getPendingMedications);

// GET /api/medication/history
router.get("/history", authenticateToken, getMedicationHistory);

// GET /api/medication/today
router.get("/today", authenticateToken, getTodaySchedule);

// POST /api/medication/update-status
router.post("/update-status", authenticateToken, updateMedicationStatus);

// POST /api/medication/:id/taken
router.post("/:id/taken", authenticateToken, markMedicationTaken);

// POST /api/medication/:id/missed
router.post("/:id/missed", authenticateToken, markMedicationMissed);

export default router;
