"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystemNotification = exports.getNotificationStats = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.createNotification = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { isRead, type, priority, limit = 50, page = 1 } = req.query;
        const query = { userId };
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
        const notifications = await Notification_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);
        const total = await Notification_1.default.countDocuments(query);
        const unreadCount = await Notification_1.default.countDocuments({
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
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
};
exports.getNotifications = getNotifications;
const createNotification = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const notificationData = {
            ...req.body,
            userId
        };
        const notification = new Notification_1.default(notificationData);
        await notification.save();
        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: notification
        });
    }
    catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create notification',
            error: error.message
        });
    }
};
exports.createNotification = createNotification;
const markAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const notification = await Notification_1.default.findOneAndUpdate({ _id: id, userId }, { isRead: true, updatedAt: new Date() }, { new: true });
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
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const result = await Notification_1.default.updateMany({ userId, isRead: false }, { isRead: true, updatedAt: new Date() });
        res.json({
            success: true,
            message: `${result.modifiedCount} notifications marked as read`
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notifications as read',
            error: error.message
        });
    }
};
exports.markAllAsRead = markAllAsRead;
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const notification = await Notification_1.default.findOneAndDelete({
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
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};
exports.deleteNotification = deleteNotification;
const getNotificationStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const stats = await Notification_1.default.aggregate([
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
        const unreadCount = await Notification_1.default.countDocuments({
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
    }
    catch (error) {
        console.error('Error fetching notification stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notification statistics',
            error: error.message
        });
    }
};
exports.getNotificationStats = getNotificationStats;
const createSystemNotification = async (userId, title, message, options = {}) => {
    try {
        const notification = new Notification_1.default({
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
    }
    catch (error) {
        console.error('Error creating system notification:', error);
        throw error;
    }
};
exports.createSystemNotification = createSystemNotification;
//# sourceMappingURL=notificationController.js.map