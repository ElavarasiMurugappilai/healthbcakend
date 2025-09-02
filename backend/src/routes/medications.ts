import { Router, Request, Response } from 'express';
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';
const router = Router();

// GET /medications/pending - Get pending medication suggestions for user
router.get('/pending', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    // Find user and get pending medications
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return pending medications (empty array if none)
    // For now, return mock data since pendingMedications field doesn't exist in User model
    const pendingMedications = [
      {
        _id: '1',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        suggestedBy: 'Dr. Smith',
        reason: 'Blood sugar management'
      },
      {
        _id: '2', 
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        suggestedBy: 'Dr. Johnson',
        reason: 'Blood pressure control'
      }
    ];

    res.json({
      success: true,
      message: 'Pending medications retrieved successfully',
      data: pendingMedications
    });
  } catch (error) {
    console.error('Error fetching pending medications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending medications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /medications/accept - Accept a suggested medication
router.post('/accept', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { medication } = req.body;

    if (!medication || !medication.name || !medication.dosage || !medication.frequency) {
      return res.status(400).json({
        success: false,
        message: 'Medication must include name, dosage, and frequency'
      });
    }

    // Create medication object with required fields
    const newMedication = {
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      status: 'pending',
      timeSlots: medication.timeSlots || [],
      suggestedBy: medication.suggestedBy || 'System',
      reason: medication.reason || '',
      acceptedAt: new Date()
    };

    // Add medication to user's medications array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          medications: newMedication 
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication accepted and added to schedule',
      data: {
        medication: newMedication,
        totalMedications: updatedUser.medications?.length || 0
      }
    });
  } catch (error) {
    console.error('Error accepting medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting medication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /medications/decline - Decline a suggested medication
router.post('/decline', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { medicationId, reason } = req.body;

    // Log the declined medication (optional - could store in a separate collection)
    console.log(`User ${userId} declined medication ${medicationId}: ${reason}`);

    res.json({
      success: true,
      message: 'Medication declined successfully'
    });
  } catch (error) {
    console.error('Error declining medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error declining medication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
