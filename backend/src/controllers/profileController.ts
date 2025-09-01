import { Request, Response } from "express";
import UserProfile from "../models/UserProfile";
import User from "../models/userModel";
import CareTeam from "../models/CareTeam";
import Medication from "../models/Medication";

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

    // Clean profile data - remove empty strings that violate enum constraints
    const cleanedProfileData = { ...profile.toObject() };
    if (cleanedProfileData.gender === '') {
      delete cleanedProfileData.gender;
    }

    // Update user profile in User model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profile: {
          ...cleanedProfileData
        }
      },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
      console.log("❌ User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile saved successfully for user:", userId);
    return res.json({ 
      message: "Profile saved", 
      profile,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Error in upsertQuiz:", errorMessage);
    return res.status(500).json({ message: errorMessage || "Error saving profile" });
  }
}

// Get logged-in user's profile with user data
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
    
    // Get the complete user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.log("❌ User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch care team members
    const careTeamMembers = await CareTeam.find({ userId }).populate('doctorId');
    const careTeam = careTeamMembers.map(member => ({
      name: member.doctorId?.name || member.doctorData?.name || 'Unknown Doctor',
      role: member.doctorId?.specialization || member.doctorData?.specialization || 'Doctor',
      img: member.doctorId?.profilePhoto || '',
      messages: []
    }));

    // Fetch user medications
    const userMedications = await Medication.find({ userId, status: 'accepted' }).populate('doctorId');
    const medications = userMedications.map(med => ({
      name: med.name,
      dosage: med.dosage,
      status: 'Upcoming',
      time: '08:00',
      qty: '1'
    }));

    // Combine profile with care team and medication data
    const enrichedProfile = {
      ...profile?.toObject(),
      careTeam,
      medications,
      trackGlucose: profile?.trackGlucose || false,
      takeMeds: medications.length > 0
    };
    
    console.log("✅ Profile fetched successfully for user:", userId);
    return res.json({
      profile: enrichedProfile,
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
    console.error("❌ Error in getMyProfile:", errorMessage);
    return res.status(500).json({ message: errorMessage || "Error fetching profile" });
  }
}
