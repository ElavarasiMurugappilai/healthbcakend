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

// GET /api/medication/pending (alias for suggestions for quiz compatibility)
router.get("/pending", authenticateToken, getMedicationSuggestions);

// PATCH /api/medication/:id/accept
router.patch("/:id/accept", authenticateToken, acceptMedicationSuggestion);

// GET /api/medication/schedule
router.get("/schedule", authenticateToken, getMedicationSchedule);

export default router;
