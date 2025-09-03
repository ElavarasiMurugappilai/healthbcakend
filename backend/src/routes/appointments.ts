import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Mock appointments data - will be replaced with database later
const mockAppointments = [
  {
    id: '1',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'upcoming',
    location: 'Heart Care Center',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff'
  },
  {
    id: '2',
    doctor: 'Dr. Michael Chen',
    specialty: 'Endocrinologist',
    date: '2024-01-20',
    time: '2:30 PM',
    type: 'Follow-up',
    status: 'upcoming',
    location: 'Diabetes Care Clinic',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff'
  },
  {
    id: '3',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'General Practitioner',
    date: '2024-01-08',
    time: '9:15 AM',
    type: 'Check-up',
    status: 'completed',
    location: 'Main Health Center',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=f59e0b&color=fff'
  },
  {
    id: '4',
    doctor: 'Dr. James Wilson',
    specialty: 'Cardiologist',
    date: '2023-12-20',
    time: '11:00 AM',
    type: 'Consultation',
    status: 'completed',
    location: 'Heart Care Center',
    avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=8b5cf6&color=fff'
  }
];

// GET /api/appointments/upcoming - Get upcoming appointments
router.get('/upcoming', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    // Filter upcoming appointments
    const upcomingAppointments = mockAppointments.filter(apt => apt.status === 'upcoming');
    
    res.json({
      success: true,
      data: upcomingAppointments,
      count: upcomingAppointments.length
    });
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming appointments'
    });
  }
});

// GET /api/appointments/history - Get past appointments
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    // Filter completed appointments
    const pastAppointments = mockAppointments.filter(apt => apt.status === 'completed');
    
    res.json({
      success: true,
      data: pastAppointments,
      count: pastAppointments.length
    });
  } catch (error) {
    console.error('Error fetching appointment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment history'
    });
  }
});

// GET /api/appointments - Get all appointments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    res.json({
      success: true,
      data: mockAppointments,
      count: mockAppointments.length
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// POST /api/appointments/book - Book a new appointment
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { doctor, specialty, date, time, type, location } = req.body;
    
    // Validate required fields
    if (!doctor || !date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: doctor, date, time, type'
      });
    }
    
    // Create new appointment
    const newAppointment = {
      id: (mockAppointments.length + 1).toString(),
      doctor,
      specialty: specialty || 'General',
      date,
      time,
      type,
      status: 'upcoming',
      location: location || 'Main Health Center',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor)}&background=3b82f6&color=fff`
    };
    
    // Add to mock data (in real implementation, save to database)
    mockAppointments.push(newAppointment);
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: newAppointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment'
    });
  }
});

// PATCH /api/appointments/:id/cancel - Cancel an appointment
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    // Find appointment
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Update status to cancelled
    mockAppointments[appointmentIndex].status = 'cancelled';
    
    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: mockAppointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment'
    });
  }
});

export default router;
