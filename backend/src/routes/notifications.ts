import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    userId: 'user123',
    title: 'Medication Reminder',
    message: 'Time to take your morning Metformin (500mg)',
    type: 'medication',
    priority: 'high',
    read: false,
    actionRequired: true,
    timestamp: '2024-01-15T08:00:00Z',
    data: {
      medicationId: 'med1',
      dosage: '500mg',
      time: '8:00 AM'
    }
  },
  {
    id: '2',
    userId: 'user123',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
    type: 'appointment',
    priority: 'medium',
    read: false,
    actionRequired: false,
    timestamp: '2024-01-14T18:00:00Z',
    data: {
      appointmentId: 'apt1',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '10:00 AM'
    }
  },
  {
    id: '3',
    userId: 'user123',
    title: 'Blood Glucose Check',
    message: 'Don\'t forget to check your blood glucose level before lunch',
    type: 'measurement',
    priority: 'medium',
    read: true,
    actionRequired: true,
    timestamp: '2024-01-15T11:30:00Z',
    data: {
      measurementType: 'bloodGlucose',
      suggestedTime: 'before lunch'
    }
  },
  {
    id: '4',
    userId: 'user123',
    title: 'Challenge Achievement',
    message: 'Congratulations! You completed the "Daily Steps Challenge"',
    type: 'achievement',
    priority: 'low',
    read: false,
    actionRequired: false,
    timestamp: '2024-01-14T20:30:00Z',
    data: {
      challengeId: 'challenge1',
      challengeName: 'Daily Steps Challenge',
      reward: '50 points'
    }
  },
  {
    id: '5',
    userId: 'user123',
    title: 'Health Insight',
    message: 'Your blood glucose levels have been stable this week. Great job!',
    type: 'insight',
    priority: 'low',
    read: true,
    actionRequired: false,
    timestamp: '2024-01-14T16:00:00Z',
    data: {
      metric: 'bloodGlucose',
      trend: 'stable',
      period: 'week'
    }
  },
  {
    id: '6',
    userId: 'user123',
    title: 'Medication Refill',
    message: 'Your Metformin prescription is running low. Consider refilling soon.',
    type: 'medication',
    priority: 'medium',
    read: false,
    actionRequired: true,
    timestamp: '2024-01-13T10:00:00Z',
    data: {
      medicationId: 'med1',
      medicationName: 'Metformin',
      remainingDoses: 3
    }
  }
];

// GET /api/notifications - Get all notifications for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;
    
    let userNotifications = mockNotifications.filter(notif => notif.userId === userId);
    
    // Filter unread only if requested
    if (unreadOnly === 'true') {
      userNotifications = userNotifications.filter(notif => !notif.read);
    }
    
    // Sort by timestamp (newest first)
    userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply pagination
    const startIndex = parseInt(offset as string);
    const limitNum = parseInt(limit as string);
    const paginatedNotifications = userNotifications.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedNotifications,
      total: userNotifications.length,
      unreadCount: userNotifications.filter(notif => !notif.read).length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// GET /api/notifications/unread - Get unread notifications count
router.get('/unread', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const unreadCount = mockNotifications.filter(notif => 
      notif.userId === userId && !notif.read
    ).length;
    
    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    // Find notification
    const notificationIndex = mockNotifications.findIndex(notif => 
      notif.id === id && notif.userId === userId
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Mark as read
    mockNotifications[notificationIndex].read = true;
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: mockNotifications[notificationIndex]
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// PATCH /api/notifications/mark-all-read - Mark all notifications as read
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    // Mark all user notifications as read
    let updatedCount = 0;
    mockNotifications.forEach(notif => {
      if (notif.userId === userId && !notif.read) {
        notif.read = true;
        updatedCount++;
      }
    });
    
    res.json({
      success: true,
      message: `Marked ${updatedCount} notifications as read`,
      data: { updatedCount }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    // Find notification
    const notificationIndex = mockNotifications.findIndex(notif => 
      notif.id === id && notif.userId === userId
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Remove notification
    const deletedNotification = mockNotifications.splice(notificationIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Notification deleted successfully',
      data: deletedNotification
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

// POST /api/notifications - Create a new notification (for system use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, message, type, priority = 'medium', actionRequired = false, data = {} } = req.body;
    const userId = req.user?.userId;
    
    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, message, type'
      });
    }
    
    // Create new notification
    const newNotification = {
      id: (mockNotifications.length + 1).toString(),
      userId,
      title,
      message,
      type,
      priority,
      read: false,
      actionRequired,
      timestamp: new Date().toISOString(),
      data
    };
    
    // Add to mock data
    mockNotifications.push(newNotification);
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

export default router;
