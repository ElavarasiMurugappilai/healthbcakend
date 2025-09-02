import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// POST /doctors/personal - Add a personal doctor for the authenticated user
router.post('/personal', authenticateToken, async (req, res) => {
  try {
    const { name, specialization } = req.body;
    const userId = req.user?.id;

    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Name and specialization are required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Create personal doctor object
    const personalDoctor = {
      _id: new Date().getTime().toString(), // Simple ID generation
      name: name.trim(),
      specialization: specialization.trim(),
      isPersonal: true,
      addedAt: new Date()
    };

    // Add to user's personal doctors array
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          personalDoctors: personalDoctor
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Personal doctor added successfully',
      data: personalDoctor
    });

  } catch (error) {
    console.error('Error adding personal doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
