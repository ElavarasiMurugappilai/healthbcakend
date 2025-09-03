import { Request, Response } from 'express';
import Notification from '../models/Notification';

type AuthRequest = Request;

// Get user notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { isRead, type, priority, limit = 50, page = 1 } = req.query;

    const query: any = { userId };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      meta: {
        total,
        unreadCount,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Create notification
export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const notificationData = {
      ...req.body,
      userId
    };

    const notification = new Notification(notificationData);
    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, updatedAt: new Date() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
};

// Delete notification
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const stats = await Notification.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: {
            isRead: '$isRead',
            type: '$type'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.isRead',
          types: {
            $push: {
              type: '$_id.type',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      }
    ]);

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        unreadCount,
        breakdown: stats
      }
    });
  } catch (error: any) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    });
  }
};

// Create system notification (for internal use)
export const createSystemNotification = async (
  userId: string,
  title: string,
  message: string,
  options: {
    type?: 'medication' | 'appointment' | 'challenge' | 'measurement' | 'system' | 'fitness' | 'general';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
  } = {}
) => {
  try {
    const notification = new Notification({
      userId,
      type: options.type || 'system',
      title,
      message,
      priority: options.priority || 'medium',
      actionUrl: options.actionUrl,
      actionText: options.actionText,
      metadata: options.metadata
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating system notification:', error);
    throw error;
  }
};