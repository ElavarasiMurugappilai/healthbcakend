import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Mock health insights data
const mockHealthInsights = {
  vitals: {
    bloodGlucose: {
      current: 102,
      unit: 'mg/dL',
      status: 'normal',
      trend: 'stable',
      lastUpdated: '2024-01-15T08:30:00Z',
      history: [98, 105, 102, 99, 103, 101, 102]
    },
    heartRate: {
      current: 72,
      unit: 'bpm',
      status: 'normal',
      trend: 'stable',
      lastUpdated: '2024-01-15T08:30:00Z',
      history: [68, 74, 72, 70, 75, 71, 72]
    },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      unit: 'mmHg',
      status: 'normal',
      trend: 'stable',
      lastUpdated: '2024-01-15T08:30:00Z'
    },
    weight: {
      current: 70.5,
      unit: 'kg',
      status: 'normal',
      trend: 'decreasing',
      lastUpdated: '2024-01-15T07:00:00Z',
      history: [72.1, 71.8, 71.2, 70.9, 70.7, 70.6, 70.5]
    }
  },
  wellness: {
    sleep: {
      lastNight: 7.5,
      average: 7.2,
      unit: 'hours',
      quality: 'good',
      trend: 'improving',
      lastUpdated: '2024-01-15T06:00:00Z'
    },
    steps: {
      today: 6500,
      goal: 8000,
      unit: 'steps',
      progress: 81.25,
      trend: 'increasing',
      lastUpdated: '2024-01-15T14:30:00Z'
    },
    water: {
      today: 6,
      goal: 8,
      unit: 'glasses',
      progress: 75,
      lastUpdated: '2024-01-15T14:30:00Z'
    }
  },
  insights: [
    {
      id: '1',
      type: 'positive',
      title: 'Great Blood Sugar Control',
      message: 'Your blood glucose levels have been consistently within the normal range this week.',
      priority: 'low',
      category: 'diabetes'
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Increase Daily Steps',
      message: 'You\'re 1,500 steps away from your daily goal. A 15-minute walk could help you reach it!',
      priority: 'medium',
      category: 'fitness'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Sleep Quality Improved',
      message: 'Your sleep quality has improved by 20% over the past week. Keep up the good bedtime routine!',
      priority: 'low',
      category: 'wellness'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Medication Due',
      message: 'Don\'t forget to take your evening medication in 2 hours.',
      priority: 'high',
      category: 'medication'
    }
  ],
  trends: {
    weekly: {
      bloodGlucose: { average: 101.2, change: -2.1, status: 'improving' },
      weight: { average: 70.8, change: -1.6, status: 'improving' },
      steps: { average: 7200, change: 800, status: 'improving' },
      sleep: { average: 7.2, change: 0.5, status: 'improving' }
    },
    monthly: {
      bloodGlucose: { average: 103.5, change: -5.2, status: 'improving' },
      weight: { average: 71.2, change: -2.8, status: 'improving' },
      steps: { average: 6800, change: 1200, status: 'improving' },
      sleep: { average: 6.9, change: 0.8, status: 'improving' }
    }
  }
};

// GET /api/health-insights - Get all health insights
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    res.json({
      success: true,
      data: mockHealthInsights
    });
  } catch (error) {
    console.error('Error fetching health insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health insights'
    });
  }
});

// GET /api/health-insights/vitals - Get vital signs data
router.get('/vitals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    res.json({
      success: true,
      data: mockHealthInsights.vitals
    });
  } catch (error) {
    console.error('Error fetching vitals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vitals'
    });
  }
});

// GET /api/health-insights/wellness - Get wellness metrics
router.get('/wellness', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    res.json({
      success: true,
      data: mockHealthInsights.wellness
    });
  } catch (error) {
    console.error('Error fetching wellness data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wellness data'
    });
  }
});

// GET /api/health-insights/latest - Get latest metrics summary
router.get('/latest', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const latestMetrics = {
      bloodGlucose: mockHealthInsights.vitals.bloodGlucose.current,
      heartRate: mockHealthInsights.vitals.heartRate.current,
      weight: mockHealthInsights.vitals.weight.current,
      sleep: mockHealthInsights.wellness.sleep.lastNight,
      steps: mockHealthInsights.wellness.steps.today,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: latestMetrics
    });
  } catch (error) {
    console.error('Error fetching latest metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest metrics'
    });
  }
});

// GET /api/health-insights/trends - Get health trends
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { period = 'weekly' } = req.query;
    
    const trends = period === 'monthly' 
      ? mockHealthInsights.trends.monthly 
      : mockHealthInsights.trends.weekly;
    
    res.json({
      success: true,
      data: trends,
      period
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trends'
    });
  }
});

// POST /api/health-insights/measurement - Add new measurement
router.post('/measurement', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { type, value, unit, timestamp } = req.body;
    
    // Validate required fields
    if (!type || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, value'
      });
    }
    
    // Update mock data based on measurement type
    const measurementTimestamp = timestamp || new Date().toISOString();
    
    switch (type) {
      case 'bloodGlucose':
        mockHealthInsights.vitals.bloodGlucose.current = value;
        mockHealthInsights.vitals.bloodGlucose.lastUpdated = measurementTimestamp;
        mockHealthInsights.vitals.bloodGlucose.history.push(value);
        if (mockHealthInsights.vitals.bloodGlucose.history.length > 7) {
          mockHealthInsights.vitals.bloodGlucose.history.shift();
        }
        break;
      case 'weight':
        mockHealthInsights.vitals.weight.current = value;
        mockHealthInsights.vitals.weight.lastUpdated = measurementTimestamp;
        mockHealthInsights.vitals.weight.history.push(value);
        if (mockHealthInsights.vitals.weight.history.length > 7) {
          mockHealthInsights.vitals.weight.history.shift();
        }
        break;
      case 'heartRate':
        mockHealthInsights.vitals.heartRate.current = value;
        mockHealthInsights.vitals.heartRate.lastUpdated = measurementTimestamp;
        break;
      case 'steps':
        mockHealthInsights.wellness.steps.today = value;
        mockHealthInsights.wellness.steps.progress = (value / mockHealthInsights.wellness.steps.goal) * 100;
        mockHealthInsights.wellness.steps.lastUpdated = measurementTimestamp;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid measurement type'
        });
    }
    
    res.status(201).json({
      success: true,
      message: 'Measurement recorded successfully',
      data: {
        type,
        value,
        unit,
        timestamp: measurementTimestamp
      }
    });
  } catch (error) {
    console.error('Error recording measurement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record measurement'
    });
  }
});

export default router;
