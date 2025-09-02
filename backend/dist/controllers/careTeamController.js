"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCareTeam = exports.addDoctorToCareTeam = exports.getSuggestedDoctors = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const CareTeam_1 = __importDefault(require("../models/CareTeam"));
const mongoose_1 = __importDefault(require("mongoose"));
const getSuggestedDoctors = async (req, res) => {
    try {
        console.log("📋 Fetching system-approved doctors");
        const doctors = await Doctor_1.default.find({ isSystemApproved: true })
            .select("name email specialization photo rating experience")
            .sort({ rating: -1, experience: -1 });
        console.log(`✅ Found ${doctors.length} system-approved doctors`);
        res.json(doctors);
    }
    catch (error) {
        console.error("❌ Error fetching suggested doctors:", error);
        res.status(500).json({ error: "Failed to fetch suggested doctors" });
    }
};
exports.getSuggestedDoctors = getSuggestedDoctors;
const addDoctorToCareTeam = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ error: "Invalid doctor ID" });
        }
        console.log(`📝 Adding doctor ${doctorId} to care team for user ${userId}`);
        const doctor = await Doctor_1.default.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        const existingEntry = await CareTeam_1.default.findOne({ userId, doctorId });
        if (existingEntry) {
            if (existingEntry.accepted) {
                return res.status(400).json({ error: "Doctor already in care team" });
            }
            else {
                existingEntry.accepted = true;
                await existingEntry.save();
                const populatedEntry = await CareTeam_1.default.findById(existingEntry._id)
                    .populate("doctorId", "name email specialization photo rating");
                console.log(`✅ Doctor ${doctor.name} accepted to care team`);
                return res.json(populatedEntry);
            }
        }
        const careTeamEntry = new CareTeam_1.default({
            userId,
            doctorId,
            accepted: true,
            isActive: true
        });
        await careTeamEntry.save();
        const populatedEntry = await CareTeam_1.default.findById(careTeamEntry._id)
            .populate("doctorId", "name email specialization photo rating");
        console.log(`✅ Doctor ${doctor.name} added to care team`);
        res.json(populatedEntry);
    }
    catch (error) {
        console.error("❌ Error adding doctor to care team:", error);
        res.status(500).json({ error: "Failed to add doctor to care team" });
    }
};
exports.addDoctorToCareTeam = addDoctorToCareTeam;
const getMyCareTeam = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        console.log(`📋 Fetching care team for user ${userId}`);
        const careTeam = await CareTeam_1.default.find({
            userId,
            accepted: true,
            isActive: true
        }).populate("doctorId", "name email specialization photo rating experience");
        console.log(`✅ Found ${careTeam.length} care team members`);
        res.json(careTeam);
    }
    catch (error) {
        console.error("❌ Error fetching care team:", error);
        res.status(500).json({ error: "Failed to fetch care team" });
    }
};
exports.getMyCareTeam = getMyCareTeam;
//# sourceMappingURL=careTeamController.js.map