"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorSuggestions = exports.respondToSuggestion = exports.getSuggestedDoctors = exports.getCareTeam = exports.addToCareTeam = exports.getSystemDoctors = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const CareTeam_1 = __importDefault(require("../models/CareTeam"));
const DoctorSuggestion_1 = __importDefault(require("../models/DoctorSuggestion"));
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
        const userId = req.user.id;
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
        const userId = req.user.id;
        const careTeam = await CareTeam_1.default.find({ userId })
            .populate("doctorId", "name specialization photo rating experience")
            .sort({ createdAt: -1 });
        res.json(careTeam);
    }
    catch (error) {
        console.error("Error fetching care team:", error);
        res.status(500).json({ error: "Failed to fetch care team" });
    }
};
exports.getCareTeam = getCareTeam;
const getSuggestedDoctors = async (req, res) => {
    try {
        const userId = req.user.id;
        const existingSuggestions = await DoctorSuggestion_1.default.find({ userId }).select('doctorId status');
        const suggestedDoctorIds = existingSuggestions.map(s => s.doctorId);
        const systemDoctors = await Doctor_1.default.find({
            isSystemDoctor: true,
            _id: { $nin: suggestedDoctorIds }
        }).limit(5);
        const pendingSuggestions = await DoctorSuggestion_1.default.find({
            userId,
            status: 'pending'
        }).populate('doctorId', 'name specialization photo rating experience');
        res.json({
            availableDoctors: systemDoctors,
            pendingSuggestions
        });
    }
    catch (error) {
        console.error("Error fetching suggested doctors:", error);
        res.status(500).json({ error: "Failed to fetch suggested doctors" });
    }
};
exports.getSuggestedDoctors = getSuggestedDoctors;
const respondToSuggestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { suggestionId, action } = req.body;
        if (!suggestionId || !['accept', 'reject'].includes(action)) {
            return res.status(400).json({ error: "Invalid suggestion ID or action" });
        }
        const suggestion = await DoctorSuggestion_1.default.findById(suggestionId).populate('doctorId');
        if (!suggestion || suggestion.userId.toString() !== userId) {
            return res.status(404).json({ error: "Suggestion not found" });
        }
        suggestion.status = action === 'accept' ? 'accepted' : 'rejected';
        suggestion.respondedAt = new Date();
        await suggestion.save();
        if (action === 'accept') {
            const existingCareTeam = await CareTeam_1.default.findOne({
                userId,
                doctorId: suggestion.doctorId
            });
            if (!existingCareTeam) {
                await CareTeam_1.default.create({
                    userId,
                    doctorId: suggestion.doctorId,
                    isActive: true
                });
            }
        }
        res.json({ message: `Doctor suggestion ${action}ed successfully` });
    }
    catch (error) {
        console.error("Error responding to suggestion:", error);
        res.status(500).json({ error: "Failed to respond to suggestion" });
    }
};
exports.respondToSuggestion = respondToSuggestion;
const createDoctorSuggestions = async (req, res) => {
    try {
        const userId = req.user.id;
        const systemDoctors = await Doctor_1.default.find({ isSystemDoctor: true }).limit(3);
        const suggestions = [];
        for (const doctor of systemDoctors) {
            try {
                const suggestion = await DoctorSuggestion_1.default.create({
                    userId,
                    doctorId: doctor._id,
                    status: 'pending'
                });
                suggestions.push(suggestion);
            }
            catch (error) {
                if (error.code !== 11000) {
                    console.error('Error creating suggestion:', error);
                }
            }
        }
        res.json({ message: `Created ${suggestions.length} doctor suggestions` });
    }
    catch (error) {
        console.error("Error creating doctor suggestions:", error);
        res.status(500).json({ error: "Failed to create doctor suggestions" });
    }
};
exports.createDoctorSuggestions = createDoctorSuggestions;
//# sourceMappingURL=doctorController.js.map