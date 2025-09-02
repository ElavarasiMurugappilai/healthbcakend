import { Router, Request, Response } from 'express';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /doctors/system - Get all system doctors
router.get('/system', async (req: Request, res: Response) => {
  try {
    const systemDoctors = await Doctor.find({ isSystemApproved: true }).select(
      'name specialization photo rating experience'
    );

    res.json({
      success: true,
      message: 'System doctors retrieved successfully',
      data: systemDoctors
    });
  } catch (error) {
    console.error('Error fetching system doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system doctors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /profile/selected-doctors - Save selected doctors for user
router.post('/selected', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { selectedDoctors } = req.body;

    console.log('POST /doctors/selected - Request data:', {
      userId,
      selectedDoctors,
      userFromToken: req.user,
      userIdFromUser: req.user?._id,
      userIdFromUserString: req.user?._id?.toString()
    });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    if (!Array.isArray(selectedDoctors)) {
      return res.status(400).json({
        success: false,
        message: 'selectedDoctors must be an array'
      });
    }

    // Validate that all doctor IDs exist
    const doctorIds = selectedDoctors.filter(id => typeof id === 'string');
    const existingDoctors = await Doctor.find({ 
      _id: { $in: doctorIds },
      isSystemApproved: true 
    });

    if (existingDoctors.length !== doctorIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some doctor IDs are invalid or not system doctors'
      });
    }

    // Update user's selected doctors
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { selectedDoctors: doctorIds },
      { new: true }
    ).populate('selectedDoctors', 'name specialization photo rating experience');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Selected doctors updated successfully',
      data: {
        selectedDoctors: updatedUser.selectedDoctors
      }
    });
  } catch (error) {
    console.error('Error updating selected doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating selected doctors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /doctors/selected - Get user's selected doctors
router.get('/selected', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Find user and populate selected doctors
    const user = await User.findById(userId).populate('selectedDoctors', 'name specialization photo rating experience');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Selected doctors retrieved successfully',
      data: {
        selectedDoctors: user.selectedDoctors || []
      }
    });
  } catch (error) {
    console.error('Error fetching selected doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching selected doctors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
