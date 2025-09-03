import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getHealthMetrics,
  addHealthMetric,
  getHealthTrends,
  getLatestMetrics,
  updateHealthMetric,
  deleteHealthMetric,
  getHealthInsights,
  markInsightAsRead
} from '../controllers/healthMetricController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Health Metrics routes
router.get('/metrics', getHealthMetrics);
router.post('/metrics', addHealthMetric);
router.get('/metrics/latest', getLatestMetrics);
router.put('/metrics/:id', updateHealthMetric);
router.delete('/metrics/:id', deleteHealthMetric);

// Health Trends routes
router.get('/trends', getHealthTrends);

// Health Insights routes
router.get('/insights', getHealthInsights);
router.patch('/insights/:id/read', markInsightAsRead);

export default router;
