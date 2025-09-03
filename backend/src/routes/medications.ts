import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUserMedications,
  addMedicationSchedule,
  updateMedicationSchedule,
  getMedicationHistory,
  getTodaySchedule,
  markMedicationTaken,
  markMedicationMissed,
  getPendingMedications
} from '../controllers/medicationController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user medications
router.get('/user', getUserMedications);

// Add medication to schedule
router.post('/schedule', addMedicationSchedule);

// Update medication schedule
router.patch('/schedule/:id', updateMedicationSchedule);

// Get medication history
router.get('/history', getMedicationHistory);

// Get today's medication schedule
router.get('/today', getTodaySchedule);

// Mark medication as taken
router.patch('/:id/taken', markMedicationTaken);

// Mark medication as missed
router.patch('/:id/missed', markMedicationMissed);

// Get pending medications (for quiz/initialization)
router.get('/pending', getPendingMedications);

export default router;