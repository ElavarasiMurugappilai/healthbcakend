import express from "express";
import { getSystemDoctors, addToCareTeam, getCareTeam } from "../controllers/doctorController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Get system-approved doctors
router.get("/system", getSystemDoctors);

// Add doctor to care team (protected)
router.post("/careteam/add", authenticateToken, addToCareTeam);

// Get user's care team (protected)
router.get("/careteam", authenticateToken, getCareTeam);

export default router;
