import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import CareTeam from "../models/CareTeam";
import mongoose from "mongoose";

// GET /api/care-team/suggested-doctors
export const getSuggestedDoctors = async (req: Request, res: Response) => {
  try {
    console.log("📋 Fetching system-approved doctors");
    
    const doctors = await Doctor.find({ isSystemApproved: true })
      .select("name email specialization photo rating experience")
      .sort({ rating: -1, experience: -1 });
    
    console.log(`✅ Found ${doctors.length} system-approved doctors`);
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching suggested doctors:", error);
    res.status(500).json({ error: "Failed to fetch suggested doctors" });
  }
};

// POST /api/care-team/add-doctor
export const addDoctorToCareTeam = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    // Validate doctorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid doctor ID" });
    }

    console.log(`📝 Adding doctor ${doctorId} to care team for user ${userId}`);

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if already in care team
    const existingEntry = await CareTeam.findOne({ userId, doctorId });
    if (existingEntry) {
      if (existingEntry.accepted) {
        return res.status(400).json({ error: "Doctor already in care team" });
      } else {
        // Update to accepted
        existingEntry.accepted = true;
        await existingEntry.save();
        
        const populatedEntry = await CareTeam.findById(existingEntry._id)
          .populate("doctorId", "name email specialization photo rating");
        
        console.log(`✅ Doctor ${doctor.name} accepted to care team`);
        return res.json(populatedEntry);
      }
    }

    // Create new care team entry
    const careTeamEntry = new CareTeam({
      userId,
      doctorId,
      accepted: true,
      isActive: true
    });

    await careTeamEntry.save();
    
    const populatedEntry = await CareTeam.findById(careTeamEntry._id)
      .populate("doctorId", "name email specialization photo rating");

    console.log(`✅ Doctor ${doctor.name} added to care team`);
    res.json(populatedEntry);
  } catch (error) {
    console.error("❌ Error adding doctor to care team:", error);
    res.status(500).json({ error: "Failed to add doctor to care team" });
  }
};

// GET /api/care-team
export const getMyCareTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log(`📋 Fetching care team for user ${userId}`);

    const careTeam = await CareTeam.find({ 
      userId, 
      accepted: true, 
      isActive: true 
    }).populate("doctorId", "name email specialization photo rating experience");

    console.log(`✅ Found ${careTeam.length} care team members`);
    res.json(careTeam);
  } catch (error) {
    console.error("❌ Error fetching care team:", error);
    res.status(500).json({ error: "Failed to fetch care team" });
  }
};
