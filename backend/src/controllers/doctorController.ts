import { Request, Response } from "express";
import mongoose from "mongoose";
import Doctor from "../models/Doctor";
import CareTeam from "../models/CareTeam";
import { AuthRequest } from "../middleware/auth";

// Get system-approved doctors
export const getSystemDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({ isSystemDoctor: true }).select('-__v');
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching system doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add doctor to user's care team
export const addToCareTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, doctorData } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let doctor;

    // If doctorData is provided, create a new personal doctor
    if (doctorData) {
      doctor = new Doctor({
        ...doctorData,
        isSystemDoctor: false,
        addedBy: userId,
      });
      await doctor.save();
    } else if (doctorId) {
      // Only query DB if doctorId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ message: "Invalid doctor ID format" });
      }
      
      // Use existing doctor
      doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
    } else {
      return res.status(400).json({ message: "Doctor ID or doctor data required" });
    }

    // Check if already in care team
    const existingCareTeam = await CareTeam.findOne({
      userId,
      doctorId: doctor._id,
    });

    if (existingCareTeam) {
      return res.status(400).json({ message: "Doctor already in care team" });
    }

    // Add to care team with isActive field
    const careTeamEntry = new CareTeam({
      userId,
      doctorId: doctor._id,
      isActive: true,
    });

    await careTeamEntry.save();

    const populatedEntry = await CareTeam.findById(careTeamEntry._id)
      .populate('doctorId', 'name specialization photo rating experience');

    res.status(201).json(populatedEntry);
  } catch (error) {
    console.error("Error adding to care team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's care team
export const getCareTeam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const careTeam = await CareTeam.find({ userId, isActive: true })
      .populate('doctorId', 'name specialization photo rating experience')
      .select('-__v');

    res.json(careTeam);
  } catch (error) {
    console.error("Error fetching care team:", error);
    res.status(500).json({ message: "Server error" });
  }
};
