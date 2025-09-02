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

// Save selected doctors (protected)
router.post("/selected", authenticateToken, async (req: any, res: any) => {
  try {
    const { selectedDoctors } = req.body;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Update user's selected doctors
    await req.user.updateOne({
      $set: { 'profile.selectedDoctors': selectedDoctors || [] }
    });

    res.status(200).json({ message: "Selected doctors saved successfully" });
  } catch (error) {
    console.error("Error saving selected doctors:", error);
    res.status(500).json({ error: "Error saving selected doctors" });
  }
});

export default router;
