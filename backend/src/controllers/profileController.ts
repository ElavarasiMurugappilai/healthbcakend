import { Request, Response } from "express";
import UserProfile from "../models/UserProfile";
import User from "../models/userModel";

// Save or update profile (quiz data)
export async function upsertQuiz(req: Request & { user?: { id: string } }, res: Response) {
  try {
    console.log("🔍 upsertQuiz called with user:", req.user);
    
    const userId = req.user?.id;
    if (!userId) {
      console.log("❌ No user ID in request");
      return res.status(401).json({ message: "Unauthorized - No user ID" });
    }

    console.log("✅ Processing quiz for user:", userId);
    const body = req.body;

    // Find & update, or create if not exists
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: body },
      { upsert: true, new: true }
    );

    // Get the complete user data to return to frontend
    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.log("❌ User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile saved successfully for user:", userId);
    return res.json({ 
      message: "Profile saved", 
      profile,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        conditions: user.conditions,
        goals: user.goals,
        avatar: user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Error in upsertQuiz:", errorMessage);
    return res.status(500).json({ message: errorMessage || "Error saving profile" });
  }
}

// Get logged-in user's profile
export async function getMyProfile(req: Request & { user?: { id: string } }, res: Response) {
  try {
    console.log("🔍 getMyProfile called with user:", req.user);
    
    const userId = req.user?.id;
    if (!userId) {
      console.log("❌ No user ID in request");
      return res.status(401).json({ message: "Unauthorized - No user ID" });
    }

    console.log("✅ Fetching profile for user:", userId);
    const profile = await UserProfile.findOne({ userId });
    
    console.log("✅ Profile fetched successfully for user:", userId);
    return res.json(profile || null);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Error in getMyProfile:", errorMessage);
    return res.status(500).json({ message: errorMessage || "Error fetching profile" });
  }
}
