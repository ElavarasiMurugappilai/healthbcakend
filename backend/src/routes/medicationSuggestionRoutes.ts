import { Router } from "express";
import { 
  suggestMedication, 
  getMedicationSuggestions, 
  acceptMedicationSuggestion,
  getMedicationSchedule 
} from "../controllers/medicationSuggestionController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// POST /api/medication/suggest
router.post("/suggest", authenticateToken, suggestMedication);

// GET /api/medication/suggestions
router.get("/suggestions", authenticateToken, getMedicationSuggestions);

// POST /api/medication/accept
router.post("/accept", authenticateToken, acceptMedicationSuggestion);

// GET /api/medication/schedule
router.get("/schedule", authenticateToken, getMedicationSchedule);

export default router;
