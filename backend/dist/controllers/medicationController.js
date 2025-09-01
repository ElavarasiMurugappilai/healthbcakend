"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingMedications = exports.getUserMedications = exports.updateMedicationStatus = exports.suggestMedication = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Medication_1 = __importDefault(require("../models/Medication"));
const suggestMedication = async (req, res) => {
    try {
        const { userId, name, dosage, frequency, instructions } = req.body;
        const doctorId = req.user?._id;
        const medication = new Medication_1.default({
            userId,
            doctorId,
            name,
            dosage,
            frequency,
            instructions,
            status: "pending",
        });
        await medication.save();
        const populatedMedication = await Medication_1.default.findById(medication._id)
            .populate('doctorId', 'name specialization')
            .populate('userId', 'name email');
        res.status(201).json(populatedMedication);
    }
    catch (error) {
        console.error("Error suggesting medication:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.suggestMedication = suggestMedication;
const updateMedicationStatus = async (req, res) => {
    try {
        const { medicationId, name, dosage, status, scheduledTimes } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        console.log("🔍 Incoming body:", req.body);
        console.log("🔍 Medication accept request:", { medicationId, status, userId });
        if (medicationId && mongoose_1.default.Types.ObjectId.isValid(medicationId)) {
            const med = await Medication_1.default.findByIdAndUpdate(medicationId, {
                status,
                scheduledTimes,
                acceptedAt: status === "accepted" ? new Date() : undefined
            }, { new: true }).populate("doctorId", "name specialization");
            if (!med) {
                return res.status(404).json({ error: "Medication not found" });
            }
            console.log(`✅ Updated existing medication: ${med.name}`);
            return res.json(med);
        }
        if (!name || !dosage) {
            return res.status(400).json({ error: "Manual medications require name and dosage" });
        }
        console.log(`📝 Creating new medication: ${name}`);
        const existingMed = await Medication_1.default.findOne({ userId, name, dosage });
        if (existingMed) {
            console.log(`✅ Medication already exists, updating status: ${name}`);
            const updatedMed = await Medication_1.default.findByIdAndUpdate(existingMed._id, {
                status: status || "accepted",
                acceptedAt: status === "accepted" ? new Date() : undefined,
                scheduledTimes: scheduledTimes || existingMed.scheduledTimes
            }, { new: true }).populate("doctorId", "name specialization");
            return res.json(updatedMed);
        }
        const newMed = new Medication_1.default({
            userId,
            name,
            dosage,
            frequency: "Once daily",
            status: status || "accepted",
            acceptedAt: status === "accepted" ? new Date() : undefined,
            scheduledTimes: scheduledTimes || []
        });
        await newMed.save();
        const populatedMed = await Medication_1.default.findById(newMed._id)
            .populate("doctorId", "name specialization");
        console.log(`✅ Created new medication: ${newMed.name}`);
        return res.json(populatedMed);
    }
    catch (error) {
        console.error("❌ updateMedicationStatus error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateMedicationStatus = updateMedicationStatus;
const getUserMedications = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const medications = await Medication_1.default.find({ userId })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(medications);
    }
    catch (error) {
        console.error("Error fetching medications:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserMedications = getUserMedications;
const getPendingMedications = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const pendingMedications = await Medication_1.default.find({
            userId,
            status: "pending"
        })
            .populate('doctorId', 'name specialization photo')
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(pendingMedications);
    }
    catch (error) {
        console.error("Error fetching pending medications:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getPendingMedications = getPendingMedications;
//# sourceMappingURL=medicationController.js.map