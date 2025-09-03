import express from "express";
import { getSuggestions, acceptSuggestion, rejectSuggestion } from "../controllers/suggestionController";
import authMiddleware from "../middleware/authMiddleware"; // <-- Import here

const router = express.Router();

router.get("/", authMiddleware, getSuggestions); // <-- Use here
router.patch("/:id/accept", authMiddleware, acceptSuggestion);
router.patch("/:id/reject", authMiddleware, rejectSuggestion);

export default router;