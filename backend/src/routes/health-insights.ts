import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getTrends,
  getLatestValues,
  getVitalsSummary,
  getWellnessMetrics,
  getHealthInsights
} from '../controllers/healthInsightsController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get aggregated trends by metric
router.get('/trends', getTrends);

// Get latest values by metric type
router.get('/latest', getLatestValues);

// Get vitals summary
router.get('/vitals', getVitalsSummary);

// Get wellness metrics
router.get('/wellness', getWellnessMetrics);

// Get AI-powered health insights
router.get('/insights', getHealthInsights);

export default router;