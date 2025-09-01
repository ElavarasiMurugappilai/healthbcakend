import { Router } from "express";
import { 
  getSuggestedDoctors, 
  addDoctorToCareTeam, 
  getMyCareTeam 
} from "../controllers/careTeamController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// GET /api/care-team/suggested-doctors
router.get("/suggested-doctors", authenticateToken, getSuggestedDoctors);

// POST /api/care-team/add-doctor
router.post("/add-doctor", authenticateToken, addDoctorToCareTeam);

// GET /api/care-team
router.get("/", authenticateToken, getMyCareTeam);

export default router;
