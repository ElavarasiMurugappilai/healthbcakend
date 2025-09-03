import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments
} from '../controllers/appointmentController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create appointment
router.post('/', createAppointment);

// Get user appointments
router.get('/', getUserAppointments);

// Get upcoming appointments
router.get('/upcoming', getUpcomingAppointments);

// Update appointment status
router.patch('/:id/status', updateAppointmentStatus);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

export default router;