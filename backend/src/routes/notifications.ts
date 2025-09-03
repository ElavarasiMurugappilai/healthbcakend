import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats
} from '../controllers/notificationController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user notifications
router.get('/', getNotifications);

// Create notification
router.post('/', createNotification);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Get notification statistics
router.get('/stats', getNotificationStats);

export default router;