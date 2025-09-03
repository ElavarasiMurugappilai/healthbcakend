import { Request, Response } from "express";
import MedicationSuggestion from "../models/MedicationSuggestion";
import MedicationSchedule from "../models/MedicationSchedule";
import Notification from "../models/Notification";
import MedicationHistory from "../models/MedicationHistory";

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await MedicationSuggestion.find({ userId: req.user.id })
      .populate("doctorId", "name specialization photo")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch suggestions" });
  }
};

export const acceptSuggestion = async (req: Request, res: Response) => {
  try {
    const suggestion = await MedicationSuggestion.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!suggestion) return res.status(404).json({ success: false, message: "Suggestion not found" });

    suggestion.status = "accepted";
    suggestion.respondedAt = new Date();
    await suggestion.save();

    // Create MedicationSchedule entry
    const medSchedule = await MedicationSchedule.create({
      userId: req.user.id,
      name: suggestion.medicationName,
      dosage: suggestion.dosage,
      qty: "1",
      status: "Upcoming",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    // Create Notification
    await Notification.create({
      userId: req.user.id,
      type: "medication_added",
      message: `New medication added: ${suggestion.medicationName}`,
      refId: medSchedule._id,
      isRead: false,
    });

    // Audit trail
    await MedicationHistory.create({
      userId: req.user.id,
      doctorId: suggestion.doctorId,
      medicationName: suggestion.medicationName,
      action: "accepted",
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Medication suggestion accepted and scheduled.",
      data: medSchedule,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to accept suggestion" });
  }
};

export const rejectSuggestion = async (req: Request, res: Response) => {
  try {
    const suggestion = await MedicationSuggestion.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!suggestion) return res.status(404).json({ success: false, message: "Suggestion not found" });

    suggestion.status = "rejected";
    suggestion.respondedAt = new Date();
    await suggestion.save();

    // Audit trail
    await MedicationHistory.create({
      userId: req.user.id,
      doctorId: suggestion.doctorId,
      medicationName: suggestion.medicationName,
      action: "missed", // or "rejected" if you want to add that
      timestamp: new Date(),
    });

    res.json({ success: true, message: "Medication suggestion rejected.", data: suggestion });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to reject suggestion" });
  }
};