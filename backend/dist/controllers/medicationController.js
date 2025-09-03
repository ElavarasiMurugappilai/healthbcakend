"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicationStatus = exports.suggestMedication = exports.getPendingMedications = exports.markMedicationMissed = exports.markMedicationTaken = exports.getTodaySchedule = exports.getMedicationHistory = exports.updateMedicationSchedule = exports.addMedicationSchedule = exports.getUserMedications = void 0;
const Medication_1 = __importDefault(require("../models/Medication"));
const MedicationSchedule_1 = __importDefault(require("../models/MedicationSchedule"));
const MedicationSuggestion_1 = __importDefault(require("../models/MedicationSuggestion"));
const getUserMedications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const medications = await Medication_1.default.find({ userId })
            .populate('doctorId', 'name specialty')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: medications
        });
    }
    catch (error) {
        console.error('Error fetching user medications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medications',
            error: error.message
        });
    }
};
exports.getUserMedications = getUserMedications;
const addMedicationSchedule = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const scheduleData = {
            ...req.body,
            userId
        };
        const schedule = new MedicationSchedule_1.default(scheduleData);
        await schedule.save();
        await schedule.populate('medicationId', 'name dosage frequency');
        res.status(201).json({
            success: true,
            message: 'Medication added to schedule successfully',
            data: schedule
        });
    }
    catch (error) {
        console.error('Error adding medication to schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add medication to schedule',
            error: error.message
        });
    }
};
exports.addMedicationSchedule = addMedicationSchedule;
const updateMedicationSchedule = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const schedule = await MedicationSchedule_1.default.findOneAndUpdate({ _id: id, userId }, { ...req.body, updatedAt: new Date() }, { new: true }).populate('medicationId', 'name dosage frequency');
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Medication schedule not found'
            });
        }
        res.json({
            success: true,
            message: 'Medication schedule updated successfully',
            data: schedule
        });
    }
    catch (error) {
        console.error('Error updating medication schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update medication schedule',
            error: error.message
        });
    }
};
exports.updateMedicationSchedule = updateMedicationSchedule;
const getMedicationHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { limit = 50, page = 1 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const history = await MedicationSchedule_1.default.find({
            userId,
            status: { $in: ['taken', 'missed', 'skipped'] }
        })
            .populate('medicationId', 'name dosage frequency')
            .sort({ updatedAt: -1 })
            .limit(Number(limit))
            .skip(skip);
        const total = await MedicationSchedule_1.default.countDocuments({
            userId,
            status: { $in: ['taken', 'missed', 'skipped'] }
        });
        res.json({
            success: true,
            data: history,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching medication history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medication history',
            error: error.message
        });
    }
};
exports.getMedicationHistory = getMedicationHistory;
const getTodaySchedule = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const today = new Date().toISOString().split('T')[0];
        const schedules = await MedicationSchedule_1.default.find({
            userId,
            date: today,
            isActive: true
        })
            .populate('medicationId', 'name dosage frequency instructions')
            .sort({ time: 1 });
        res.json({
            success: true,
            data: schedules
        });
    }
    catch (error) {
        console.error('Error fetching today\'s medication schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch today\'s medication schedule',
            error: error.message
        });
    }
};
exports.getTodaySchedule = getTodaySchedule;
const markMedicationTaken = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const schedule = await MedicationSchedule_1.default.findOneAndUpdate({ _id: id, userId }, {
            status: 'taken',
            takenAt: new Date(),
            updatedAt: new Date()
        }, { new: true }).populate('medicationId', 'name dosage frequency');
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Medication schedule not found'
            });
        }
        res.json({
            success: true,
            message: 'Medication marked as taken',
            data: schedule
        });
    }
    catch (error) {
        console.error('Error marking medication as taken:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark medication as taken',
            error: error.message
        });
    }
};
exports.markMedicationTaken = markMedicationTaken;
const markMedicationMissed = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const schedule = await MedicationSchedule_1.default.findOneAndUpdate({ _id: id, userId }, {
            status: 'missed',
            updatedAt: new Date()
        }, { new: true }).populate('medicationId', 'name dosage frequency');
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Medication schedule not found'
            });
        }
        res.json({
            success: true,
            message: 'Medication marked as missed',
            data: schedule
        });
    }
    catch (error) {
        console.error('Error marking medication as missed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark medication as missed',
            error: error.message
        });
    }
};
exports.markMedicationMissed = markMedicationMissed;
const getPendingMedications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const pendingMedications = await MedicationSuggestion_1.default.find({
            userId,
            status: 'pending'
        }).populate('doctorId', 'name specialization');
        res.json({
            success: true,
            data: pendingMedications
        });
    }
    catch (error) {
        console.error('Error fetching pending medications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending medications',
            error: error.message
        });
    }
};
exports.getPendingMedications = getPendingMedications;
const suggestMedication = async (req, res) => {
    try {
        const { userId, medicationName, dosage, frequency, duration, instructions } = req.body;
        const doctorId = req.user?.id;
        if (!doctorId) {
            return res.status(401).json({ message: 'Doctor not authenticated' });
        }
        const suggestion = new MedicationSuggestion_1.default({
            userId,
            doctorId,
            medicationName,
            dosage,
            frequency,
            duration,
            instructions,
            status: 'pending'
        });
        await suggestion.save();
        await suggestion.populate('doctorId', 'name specialization');
        res.status(201).json({
            success: true,
            message: 'Medication suggestion created successfully',
            data: suggestion
        });
    }
    catch (error) {
        console.error('Error creating medication suggestion:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create medication suggestion',
            error: error.message
        });
    }
};
exports.suggestMedication = suggestMedication;
const updateMedicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const suggestion = await MedicationSuggestion_1.default.findOneAndUpdate({ _id: id, userId }, {
            status,
            respondedAt: new Date()
        }, { new: true }).populate('doctorId', 'name specialization');
        if (!suggestion) {
            return res.status(404).json({
                success: false,
                message: 'Medication suggestion not found'
            });
        }
        if (status === 'accepted') {
            const schedule = new MedicationSchedule_1.default({
                userId,
                medicationName: suggestion.medicationName,
                dosage: suggestion.dosage,
                frequency: suggestion.frequency,
                duration: suggestion.duration,
                source: 'doctor-suggestion',
                suggestionId: suggestion._id,
                isActive: true
            });
            await schedule.save();
        }
        res.json({
            success: true,
            message: `Medication suggestion ${status} successfully`,
            data: suggestion
        });
    }
    catch (error) {
        console.error('Error updating medication status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update medication status',
            error: error.message
        });
    }
};
exports.updateMedicationStatus = updateMedicationStatus;
//# sourceMappingURL=medicationController.js.map