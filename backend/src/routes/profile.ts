import express, { Request, Response } from 'express';
import User from '../models/User';
import Measurement from '../models/Measurement';
import { authenticateToken } from '../middleware/auth';
import { profileValidation, handleValidationErrors, sanitizeQuizPayload } from '../utils/validation';

const router = express.Router();

// POST /profile/quiz - Resilient quiz endpoint that supports offline-first usage
router.post('/quiz', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Sanitize and validate the payload
    const sanitizedPayload = sanitizeQuizPayload(req.body);
    
    // Extract initial measurements if provided
    const { initialMeasurements, ...profileData } = sanitizedPayload;
    
    // Update user profile with upsert operation (resilient to partial payloads)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...Object.keys(profileData).reduce((acc, key) => {
            if (profileData[key] !== undefined && profileData[key] !== null) {
              acc[`profile.${key}`] = profileData[key];
            }
            return acc;
          }, {} as any),
          'profile.lastUpdated': new Date(),
          'profile.completedAt': new Date()
        }
      },
      { 
        new: true, 
        runValidators: true,
        upsert: false // Don't create new user, just update existing
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Save initial measurements if provided
    const savedMeasurements = [];
    if (initialMeasurements && Array.isArray(initialMeasurements)) {
      for (const measurement of initialMeasurements) {
        try {
          const newMeasurement = new Measurement({
            userId: req.user._id,
            type: measurement.type,
            value: measurement.value,
            unit: measurement.unit,
            timestamp: measurement.timestamp || new Date(),
            notes: measurement.notes,
            source: measurement.source || 'quiz',
            metadata: measurement.metadata
          });
          
          const saved = await newMeasurement.save();
          savedMeasurements.push(saved);
        } catch (measurementError) {
          console.warn('⚠️ Failed to save measurement:', measurementError);
          // Continue processing other measurements
        }
      }
    }

    console.log(`✅ Quiz data updated for user: ${req.user.email}`);
    if (savedMeasurements.length > 0) {
      console.log(`✅ Saved ${savedMeasurements.length} initial measurements`);
    }

    // Return profile and minimal user object for frontend localStorage update
    res.json({
      success: true,
      message: 'Quiz data saved successfully',
      data: {
        profile: updatedUser.profile,
        user: {
          _id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          isVerified: updatedUser.isVerified,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        },
        measurements: savedMeasurements
      }
    });
  } catch (error: any) {
    console.error('❌ Quiz update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving quiz data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /profile/me - Get current user profile and settings (alias for dashboard compatibility)
router.get('/me', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get latest measurements for dashboard
    const latestMeasurements = await (Measurement as any).getLatestByType(
      req.user._id,
      ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water']
    );

    // Populate selectedDoctors with doctor details
    const userWithDoctors = await User.findById(req.user._id)
      .select('-password')
      .populate('selectedDoctors', 'name specialization photo rating experience');

    res.json({
      success: true,
      data: {
        profile: req.user.profile,
        user: userWithDoctors?.getPublicProfile() || req.user.getPublicProfile(),
        latestMeasurements
      }
    });
  } catch (error: any) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /profile - Get user profile and settings
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get latest measurements for dashboard
    const latestMeasurements = await (Measurement as any).getLatestByType(
      req.user._id,
      ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water']
    );

    res.json({
      success: true,
      data: {
        profile: req.user.profile,
        user: req.user.getPublicProfile(),
        latestMeasurements
      }
    });
  } catch (error: any) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /profile/dashboard-quiz - Save dashboard customization quiz data
router.post('/dashboard-quiz', authenticateToken, async (req: any, res: Response) => {
  try {
    console.log('📥 Dashboard quiz request received');
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📥 User:', req.user?.email);

    if (!req.user) {
      console.log('❌ No authenticated user found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { selectedCards, selectedDoctors, ...dashboardPreferences } = req.body;
    
    console.log('📝 Selected cards:', selectedCards);
    console.log('📝 Dashboard preferences:', dashboardPreferences);
    
    // Validate selectedCards is an array
    if (selectedCards && !Array.isArray(selectedCards)) {
      console.log('❌ selectedCards is not an array:', typeof selectedCards);
      return res.status(400).json({
        success: false,
        message: 'selectedCards must be an array'
      });
    }

    // Update user profile with dashboard preferences and selected cards
    console.log('💾 Updating user profile...');
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'profile.dashboardPreferences': dashboardPreferences,
          'profile.selectedCards': selectedCards || [],
          'profile.dashboardQuizCompleted': true,
          'profile.dashboardQuizCompletedAt': new Date(),
          'profile.lastUpdated': new Date(),
          // Also save to main user fields for easy access
          'selectedCards': selectedCards || [],
          'selectedDoctors': selectedDoctors || [],
          'dashboardStyle': dashboardPreferences.dashboardStyle,
          'fitnessGoal': dashboardPreferences.fitnessGoal,
          'activityLevel': dashboardPreferences.activityLevel,
          'stepTarget': dashboardPreferences.stepTarget
        }
      },
      { new: true, runValidators: true }
    ).select('-password').populate('selectedDoctors', 'name specialization photo rating experience');

    if (!updatedUser) {
      console.log('❌ User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`✅ Dashboard quiz completed for user: ${req.user.email}`);
    console.log('✅ Updated profile selectedCards:', updatedUser.profile?.selectedCards);

    res.json({
      success: true,
      message: 'Dashboard preferences saved successfully',
      data: {
        profile: updatedUser.profile,
        user: updatedUser.getPublicProfile()
      }
    });
  } catch (error: any) {
    console.error('❌ Dashboard quiz save error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error saving dashboard preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /profile - Update profile data
router.put('/', authenticateToken, profileValidation, handleValidationErrors, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const sanitizedPayload = sanitizeQuizPayload(req.body);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...Object.keys(sanitizedPayload).reduce((acc, key) => {
            if (sanitizedPayload[key] !== undefined && sanitizedPayload[key] !== null) {
              acc[`profile.${key}`] = sanitizedPayload[key];
            }
            return acc;
          }, {} as any),
          'profile.lastUpdated': new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`✅ Profile updated for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedUser.profile,
        user: updatedUser.getPublicProfile()
      }
    });
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
