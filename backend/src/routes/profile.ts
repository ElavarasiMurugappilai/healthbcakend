import { Router } from "express";
import { protectLite } from "../middleware/authMiddleware";
import { upsertQuiz, getMyProfile } from "../controllers/profileController"; // ✅ correct filename

const router = Router();

// Save or update quiz data
router.post("/quiz", protectLite, upsertQuiz);

// Get logged-in user profile
router.get("/me", protectLite, getMyProfile);

export default router;
