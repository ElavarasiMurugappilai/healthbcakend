"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingAppointments = exports.deleteAppointment = exports.updateAppointment = exports.updateAppointmentStatus = exports.getUserAppointments = exports.createAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const createAppointment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const appointmentData = {
            ...req.body,
            userId
        };
        const appointment = new Appointment_1.default(appointmentData);
        await appointment.save();
        await appointment.populate('doctorId', 'name specialty');
        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: error.message
        });
    }
};
exports.createAppointment = createAppointment;
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { status, type, limit = 50, page = 1 } = req.query;
        const query = { userId };
        if (status) {
            query.status = status;
        }
        if (type) {
            query.type = type;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const appointments = await Appointment_1.default.find(query)
            .populate('doctorId', 'name specialty avatar')
            .sort({ date: 1, time: 1 })
            .limit(Number(limit))
            .skip(skip);
        const total = await Appointment_1.default.countDocuments(query);
        res.json({
            success: true,
            data: appointments,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};
exports.getUserAppointments = getUserAppointments;
const updateAppointmentStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { status } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!['upcoming', 'completed', 'cancelled', 'no-show'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: upcoming, completed, cancelled, or no-show'
            });
        }
        const appointment = await Appointment_1.default.findOneAndUpdate({ _id: id, userId }, {
            status,
            updatedAt: new Date()
        }, { new: true }).populate('doctorId', 'name specialty');
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment
        });
    }
    catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment status',
            error: error.message
        });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
const updateAppointment = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const appointment = await Appointment_1.default.findOneAndUpdate({ _id: id, userId }, { ...req.body, updatedAt: new Date() }, { new: true }).populate('doctorId', 'name specialty');
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    }
    catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
            error: error.message
        });
    }
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const appointment = await Appointment_1.default.findOneAndDelete({
            _id: id,
            userId
        });
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete appointment',
            error: error.message
        });
    }
};
exports.deleteAppointment = deleteAppointment;
const getUpcomingAppointments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const appointments = await Appointment_1.default.find({
            userId,
            status: 'upcoming',
            date: { $gte: new Date() }
        })
            .populate('doctorId', 'name specialty avatar')
            .sort({ date: 1, time: 1 })
            .limit(10);
        res.json({
            success: true,
            data: appointments
        });
    }
    catch (error) {
        console.error('Error fetching upcoming appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming appointments',
            error: error.message
        });
    }
};
exports.getUpcomingAppointments = getUpcomingAppointments;
//# sourceMappingURL=appointmentController.js.map