import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Mock challenges data
const mockChallenges = [
  {
    id: '1',
    name: 'Daily Steps Challenge',
    description: 'Walk 8,000 steps every day for a week',
    type: 'fitness',
    goal: 8000,
    progress: 6500,
    unit: 'steps',
    duration: '7 days',
    reward: '50 points',
    status: 'active',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    icon: '🚶‍♂️'
  },
  {
    id: '2',
    name: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily',
    type: 'wellness',
    goal: 8,
    progress: 6,
    unit: 'glasses',
    duration: '7 days',
    reward: '30 points',
    status: 'active',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    icon: '💧'
  },
  {
    id: '3',
    name: 'Meditation Streak',
    description: 'Meditate for 10 minutes daily',
    type: 'mental_health',
    goal: 10,
    progress: 10,
    unit: 'minutes',
    duration: '5 days',
    reward: '40 points',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    icon: '🧘‍♀️'
  },
  {
    id: '4',
    name: 'Healthy Eating',
    description: 'Eat 5 servings of fruits and vegetables daily',
    type: 'nutrition',
    goal: 5,
    progress: 3,
    unit: 'servings',
    duration: '14 days',
    reward: '75 points',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    icon: '🥗'
  },
  {
    id: '5',
    name: 'Sleep Schedule',
    description: 'Get 8 hours of sleep every night',
    type: 'wellness',
    goal: 8,
    progress: 7.5,
    unit: 'hours',
    duration: '7 days',
    reward: '60 points',
    status: 'active',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    icon: '😴'
  }
];

// GET /api/challenges - Get all user challenges
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    res.json({
      success: true,
      data: mockChallenges,
      count: mockChallenges.length
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges'
    });
  }
});

// GET /api/challenges/active - Get active challenges
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const activeChallenges = mockChallenges.filter(challenge => challenge.status === 'active');
    
    res.json({
      success: true,
      data: activeChallenges,
      count: activeChallenges.length
    });
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active challenges'
    });
  }
});

// GET /api/challenges/completed - Get completed challenges
router.get('/completed', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const completedChallenges = mockChallenges.filter(challenge => challenge.status === 'completed');
    
    res.json({
      success: true,
      data: completedChallenges,
      count: completedChallenges.length
    });
  } catch (error) {
    console.error('Error fetching completed challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed challenges'
    });
  }
});

// PATCH /api/challenges/:id/progress - Update challenge progress
router.patch('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const userId = req.user?.userId;
    
    if (typeof progress !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number'
      });
    }
    
    // Find challenge
    const challengeIndex = mockChallenges.findIndex(challenge => challenge.id === id);
    
    if (challengeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Update progress
    mockChallenges[challengeIndex].progress = Math.min(progress, mockChallenges[challengeIndex].goal);
    
    // Check if challenge is completed
    if (mockChallenges[challengeIndex].progress >= mockChallenges[challengeIndex].goal) {
      mockChallenges[challengeIndex].status = 'completed';
    }
    
    res.json({
      success: true,
      message: 'Challenge progress updated successfully',
      data: mockChallenges[challengeIndex]
    });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update challenge progress'
    });
  }
});

// POST /api/challenges/join - Join a new challenge
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { name, description, type, goal, unit, duration } = req.body;
    
    // Validate required fields
    if (!name || !goal || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, goal, unit'
      });
    }
    
    // Create new challenge
    const newChallenge = {
      id: (mockChallenges.length + 1).toString(),
      name,
      description: description || '',
      type: type || 'general',
      goal,
      progress: 0,
      unit,
      duration: duration || '7 days',
      reward: '25 points',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      icon: '🎯'
    };
    
    // Add to mock data
    mockChallenges.push(newChallenge);
    
    res.status(201).json({
      success: true,
      message: 'Challenge joined successfully',
      data: newChallenge
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join challenge'
    });
  }
});

// DELETE /api/challenges/:id - Leave/quit a challenge
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    // Find challenge
    const challengeIndex = mockChallenges.findIndex(challenge => challenge.id === id);
    
    if (challengeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Remove challenge
    const removedChallenge = mockChallenges.splice(challengeIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Challenge left successfully',
      data: removedChallenge
    });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave challenge'
    });
  }
});

export default router;
