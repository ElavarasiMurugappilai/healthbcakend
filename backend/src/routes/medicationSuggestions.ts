import express from "express";
import { authenticateToken } from "../middleware/auth";
import MedicationSuggestion from "../models/MedicationSuggestion";
import MedicationSchedule from "../models/MedicationSchedule";
import MedicationLog from "../models/MedicationLog";
import Doctor from "../models/Doctor";

const router = express.Router();

// POST /api/care-team/:doctorId/suggest-medication
// Doctor creates a medication suggestion for user
router.post("/:doctorId/suggest-medication", authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { medicationName, dosage, frequency, duration } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Create medication suggestion
    const suggestion = new MedicationSuggestion({
      userId,
      doctorId,
      medicationName,
      dosage,
      frequency,
      duration,
      status: 'pending'
    });

    await suggestion.save();

    // Populate doctor info for response
    await suggestion.populate('doctorId', 'name specialization');

    res.json({
      success: true,
      message: "Medication suggestion created successfully",
      data: suggestion
    });
  } catch (error) {
    console.error("Error creating medication suggestion:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/care-team/suggestions
// Fetch all medication suggestions for the user (chat history style)
router.get("/suggestions", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const suggestions = await MedicationSuggestion.find({ userId })
      .populate('doctorId', 'name specialization photo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error("Error fetching medication suggestions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PATCH /api/medications/suggestions/:id/accept
// Accept a medication (move to schedules + log)
router.patch("/suggestions/:id/accept", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Find and update suggestion
    const suggestion = await MedicationSuggestion.findOneAndUpdate(
      { _id: id, userId, status: 'pending' },
      { 
        status: 'accepted', 
        respondedAt: new Date() 
      },
      { new: true }
    ).populate('doctorId', 'name specialization');

    if (!suggestion) {
      return res.status(404).json({ 
        success: false, 
        message: "Suggestion not found or already processed" 
      });
    }

    // Create medication schedule
    const schedule = new MedicationSchedule({
      userId,
      medicationName: suggestion.medicationName,
      dosage: suggestion.dosage,
      frequency: suggestion.frequency,
      scheduleTime: "08:00", // Default time, can be customized later
      source: 'doctor-suggestion',
      suggestionId: suggestion._id,
      isActive: true
    });

    await schedule.save();

    // Create log entry for acceptance
    const logEntry = new MedicationLog({
      userId,
      medicationId: schedule._id,
      scheduledTime: new Date(),
      status: 'accepted',
      notes: `Accepted medication suggestion from Dr. ${(suggestion.doctorId as any).name}`
    });

    await logEntry.save();

    res.json({
      success: true,
      message: "Medication added to your schedule",
      data: {
        suggestion,
        schedule,
        logEntry
      }
    });
  } catch (error) {
    console.error("Error accepting medication suggestion:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PATCH /api/medications/suggestions/:id/reject
// Reject a medication (update status + log)
router.patch("/suggestions/:id/reject", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Find and update suggestion
    const suggestion = await MedicationSuggestion.findOneAndUpdate(
      { _id: id, userId, status: 'pending' },
      { 
        status: 'rejected', 
        respondedAt: new Date() 
      },
      { new: true }
    ).populate('doctorId', 'name specialization');

    if (!suggestion) {
      return res.status(404).json({ 
        success: false, 
        message: "Suggestion not found or already processed" 
      });
    }

    // Create log entry for rejection
    const logEntry = new MedicationLog({
      userId,
      medicationId: suggestion._id, // Use suggestion ID as reference
      scheduledTime: new Date(),
      status: 'rejected',
      notes: reason || `Rejected medication suggestion from Dr. ${(suggestion.doctorId as any).name}`
    });

    await logEntry.save();

    res.json({
      success: true,
      message: `You rejected Dr. ${(suggestion.doctorId as any).name}'s medication suggestion`,
      data: {
        suggestion,
        logEntry
      }
    });
  } catch (error) {
    console.error("Error rejecting medication suggestion:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
