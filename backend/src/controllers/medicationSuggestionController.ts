import { Request, Response } from "express";
import MedicationSuggestion from "../models/MedicationSuggestion";
import MedicationSchedule from "../models/MedicationSchedule";
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
    const { suggestionId, scheduleTime } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!suggestionId || !scheduleTime) {
      return res.status(400).json({ 
        error: "suggestionId and scheduleTime are required" 
      });
    }

    // Validate suggestionId
    if (!mongoose.Types.ObjectId.isValid(suggestionId)) {
      return res.status(400).json({ error: "Invalid suggestion ID" });
    }

    console.log(`📝 User ${userId} accepting medication suggestion ${suggestionId}`);

    // Find and update the suggestion
    const suggestion = await MedicationSuggestion.findById(suggestionId);
    if (!suggestion) {
      return res.status(404).json({ error: "Medication suggestion not found" });
    }

    if (suggestion.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to accept this suggestion" });
    }

    if (suggestion.accepted) {
      return res.status(400).json({ error: "Medication suggestion already accepted" });
    }

    // Mark suggestion as accepted
    suggestion.accepted = true;
    await suggestion.save();

    // Create medication schedule entry
    const scheduleEntry = new MedicationSchedule({
      userId,
      medicationName: suggestion.medicationName,
      dosage: suggestion.dosage,
      scheduleTime,
      isActive: true
    });

    await scheduleEntry.save();

    console.log(`✅ Medication ${suggestion.medicationName} accepted and scheduled`);
    res.json({
      suggestion,
      schedule: scheduleEntry
    });
  } catch (error) {
    console.error("❌ Error accepting medication suggestion:", error);
    res.status(500).json({ error: "Failed to accept medication suggestion" });
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
