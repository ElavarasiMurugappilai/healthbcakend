"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCareTeam = exports.addToCareTeam = exports.getSystemDoctors = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const CareTeam_1 = __importDefault(require("../models/CareTeam"));
const getSystemDoctors = async (req, res) => {
    try {
        const doctors = await Doctor_1.default.find({ isSystemDoctor: true }).select('-__v');
        res.json(doctors);
    }
    catch (error) {
        console.error("Error fetching system doctors:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getSystemDoctors = getSystemDoctors;
const addToCareTeam = async (req, res) => {
    try {
        const { doctorId, doctorData } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        let doctor;
        if (doctorData) {
            doctor = new Doctor_1.default({
                ...doctorData,
                isSystemDoctor: false,
                addedBy: userId,
            });
            await doctor.save();
        }
        else if (doctorId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
                return res.status(400).json({ message: "Invalid doctor ID format" });
            }
            doctor = await Doctor_1.default.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
        }
        else {
            return res.status(400).json({ message: "Doctor ID or doctor data required" });
        }
        const existingCareTeam = await CareTeam_1.default.findOne({
            userId,
            doctorId: doctor._id,
        });
        if (existingCareTeam) {
            return res.status(400).json({ message: "Doctor already in care team" });
        }
        const careTeamEntry = new CareTeam_1.default({
            userId,
            doctorId: doctor._id,
            isActive: true,
        });
        await careTeamEntry.save();
        const populatedEntry = await CareTeam_1.default.findById(careTeamEntry._id)
            .populate('doctorId', 'name specialization photo rating experience');
        res.status(201).json(populatedEntry);
    }
    catch (error) {
        console.error("Error adding to care team:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addToCareTeam = addToCareTeam;
const getCareTeam = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const careTeam = await CareTeam_1.default.find({ userId, isActive: true })
            .populate('doctorId', 'name specialization photo rating experience')
            .select('-__v');
        res.json(careTeam);
    }
    catch (error) {
        console.error("Error fetching care team:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCareTeam = getCareTeam;
//# sourceMappingURL=doctorController.js.map