import express from "express";
import { 
  suggestMedication, 
  updateMedicationStatus, 
  getUserMedications, 
  getPendingMedications 
} from "../controllers/medicationController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Doctor suggests medication (protected)
router.post("/suggest", authenticateToken, suggestMedication);

// User accepts/declines medication (protected)
router.post("/accept", authenticateToken, updateMedicationStatus);

// Get user's medications (protected)
router.get("/user", authenticateToken, getUserMedications);

// Get pending medication suggestions (protected)
router.get("/pending", authenticateToken, getPendingMedications);

export default router;
