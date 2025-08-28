import { Request, Response } from "express";
import UserProfile from "../models/UserProfile";

// Save or update profile (quiz data)
export async function upsertQuiz(req: Request & { user?: { id: string } }, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const body = req.body;

    // Find & update, or create if not exists
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: body },
      { upsert: true, new: true }
    );

    return res.json({ message: "Profile saved", profile });
  } catch (err: any) {
    console.error("❌ Error in upsertQuiz:", err);
    return res.status(500).json({ message: err.message || "Error saving profile" });
  }
}

// Get logged-in user's profile
export async function getMyProfile(req: Request & { user?: { id: string } }, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await UserProfile.findOne({ userId });
    return res.json(profile || null);
  } catch (err: any) {
    console.error("❌ Error in getMyProfile:", err);
    return res.status(500).json({ message: err.message || "Error fetching profile" });
  }
}
