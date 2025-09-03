import { Request, Response } from "express";
import MedicationSuggestion from "../models/MedicationSuggestion";
import MedicationSchedule from "../models/MedicationSchedule";
import Notification from "../models/Notification";
import mongoose from "mongoose";

// POST /api/medication/suggest
export const suggestMedication = async (req: Request, res: Response) => {
  try {
    const { userId, medicationName, dosage, instructions } = req.body;
    const doctorId = req.user?._id; // Assuming doctor is authenticated

    if (!userId || !medicationName || !dosage || !instructions) {
      return res.status(400).json({ 
        error: "userId, medicationName, dosage, and instructions are required" 
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid user or doctor ID" });
    }

    console.log(`📝 Doctor ${doctorId} suggesting medication ${medicationName} to user ${userId}`);

    const suggestion = new MedicationSuggestion({
      userId,
      doctorId,
      medicationName,
      dosage,
      instructions,
      accepted: false
    });

    await suggestion.save();
    
    const populatedSuggestion = await MedicationSuggestion.findById(suggestion._id)
      .populate("doctorId", "name specialization")
      .populate("userId", "name email");

    console.log(`✅ Medication suggestion created: ${medicationName}`);
    res.json(populatedSuggestion);
  } catch (error) {
    console.error("❌ Error creating medication suggestion:", error);
    res.status(500).json({ error: "Failed to create medication suggestion" });
  }
};

// GET /api/medication/suggestions
export const getMedicationSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log(`📋 Fetching medication suggestions for user ${userId}`);

    const suggestions = await MedicationSuggestion.find({ 
      userId, 
      accepted: false 
    }).populate("doctorId", "name specialization photo")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${suggestions.length} pending medication suggestions`);
    res.json(suggestions);
  } catch (error) {
    console.error("❌ Error fetching medication suggestions:", error);
    res.status(500).json({ error: "Failed to fetch medication suggestions" });
  }
};

// POST /api/medication/accept
export const acceptMedicationSuggestion = async (req: Request, res: Response) => {
  try {
    const suggestionId = req.params.id;
    const userId = req.user._id; // from auth middleware

    // Find suggestion
    const suggestion = await MedicationSuggestion.findById(suggestionId);
    if (!suggestion) return res.status(404).json({ success: false, message: "Suggestion not found" });

    // Update status
    suggestion.status = "accepted";
    suggestion.respondedAt = new Date();
    await suggestion.save();

    // Add to MedicationSchedule
    await MedicationSchedule.create({
      user: userId,
      name: suggestion.medicationName,
      dosage: suggestion.dosage,
      status: "Upcoming",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Create notification
    await Notification.create({
      user: userId,
      type: "medication",
      message: `Medication "${suggestion.medicationName}" added to your schedule.`,
      read: false,
      createdAt: new Date(),
    });

    return res.json({ success: true, message: "Medication accepted and added to schedule." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/medication/schedule
export const getMedicationSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log(`📋 Fetching medication schedule for user ${userId}`);

    const schedule = await MedicationSchedule.find({ 
      userId, 
      isActive: true 
    }).sort({ scheduleTime: 1 });

    console.log(`✅ Found ${schedule.length} scheduled medications`);
    res.json(schedule);
  } catch (error) {
    console.error("❌ Error fetching medication schedule:", error);
    res.status(500).json({ error: "Failed to fetch medication schedule" });
  }
};
