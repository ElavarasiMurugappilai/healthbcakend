import { Request, Response } from "express";
import mongoose from "mongoose";
import Medication from "../models/Medication";
import { AuthRequest } from "../middleware/auth";

// Doctor suggests medication
export const suggestMedication = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, name, dosage, frequency, instructions } = req.body;
    const doctorId = req.user?._id; // Assuming doctor is authenticated

    const medication = new Medication({
      userId,
      doctorId,
      name,
      dosage,
      frequency,
      instructions,
      status: "pending",
    });

    await medication.save();

    const populatedMedication = await Medication.findById(medication._id)
      .populate('doctorId', 'name specialization')
      .populate('userId', 'name email');

    res.status(201).json(populatedMedication);
  } catch (error) {
    console.error("Error suggesting medication:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User accepts/declines medication
export const updateMedicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { medicationId, name, dosage, status, scheduledTimes } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("🔍 Incoming body:", req.body);
    console.log("🔍 Medication accept request:", { medicationId, status, userId });

    // If medicationId is valid, update existing medication
    if (medicationId && mongoose.Types.ObjectId.isValid(medicationId)) {
      const med = await Medication.findByIdAndUpdate(
        medicationId,
        { 
          status, 
          scheduledTimes,
          acceptedAt: status === "accepted" ? new Date() : undefined
        },
        { new: true }
      ).populate("doctorId", "name specialization");
      
      if (!med) {
        return res.status(404).json({ error: "Medication not found" });
      }
      
      console.log(`✅ Updated existing medication: ${med.name}`);
      return res.json(med);
    }

    // Otherwise, treat as manual medication
    if (!name || !dosage) {
      return res.status(400).json({ error: "Manual medications require name and dosage" });
    }

    console.log(`📝 Creating new medication: ${name}`);
    
    // Check if medication already exists for this user (ignore duplicates)
    const existingMed = await Medication.findOne({ userId, name, dosage });
    if (existingMed) {
      console.log(`✅ Medication already exists, updating status: ${name}`);
      
      // Update existing medication
      const updatedMed = await Medication.findByIdAndUpdate(
        existingMed._id,
        {
          status: status || "accepted",
          acceptedAt: status === "accepted" ? new Date() : undefined,
          scheduledTimes: scheduledTimes || existingMed.scheduledTimes
        },
        { new: true }
      ).populate("doctorId", "name specialization");
      
      return res.json(updatedMed);
    }
    
    const newMed = new Medication({ 
      userId,
      name, 
      dosage, 
      frequency: "Once daily",
      status: status || "accepted",
      acceptedAt: status === "accepted" ? new Date() : undefined,
      scheduledTimes: scheduledTimes || []
    });
    
    await newMed.save();
    
    const populatedMed = await Medication.findById(newMed._id)
      .populate("doctorId", "name specialization");
    
    console.log(`✅ Created new medication: ${newMed.name}`);
    return res.json(populatedMed);

  } catch (error) {
    console.error("❌ updateMedicationStatus error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's medications
export const getUserMedications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const medications = await Medication.find({ userId })
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get pending medication suggestions for user
export const getPendingMedications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const pendingMedications = await Medication.find({ 
      userId, 
      status: "pending" 
    })
      .populate('doctorId', 'name specialization photo')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(pendingMedications);
  } catch (error) {
    console.error("Error fetching pending medications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
