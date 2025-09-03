"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markInsightAsRead = exports.getHealthInsights = exports.deleteHealthMetric = exports.updateHealthMetric = exports.getLatestMetrics = exports.getHealthTrends = exports.addHealthMetric = exports.getHealthMetrics = void 0;
const HealthMetric_1 = __importDefault(require("../models/HealthMetric"));
const HealthInsight_1 = __importDefault(require("../models/HealthInsight"));
const getHealthMetrics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, startDate, endDate, limit = 100 } = req.query;
        let query = { userId };
        if (type) {
            query.type = type;
        }
        if (startDate || endDate) {
            query.recordedAt = {};
            if (startDate)
                query.recordedAt.$gte = new Date(startDate);
            if (endDate)
                query.recordedAt.$lte = new Date(endDate);
        }
        const metrics = await HealthMetric_1.default.find(query)
            .sort({ recordedAt: -1 })
            .limit(parseInt(limit))
            .lean();
        res.json({
            success: true,
            data: metrics,
            count: metrics.length
        });
    }
    catch (error) {
        console.error('Error fetching health metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch health metrics'
        });
    }
};
exports.getHealthMetrics = getHealthMetrics;
const addHealthMetric = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, value, secondaryValue, unit, recordedAt, notes, source } = req.body;
        const metric = new HealthMetric_1.default({
            userId,
            type,
            value,
            secondaryValue,
            unit,
            recordedAt: recordedAt || new Date(),
            notes,
            source: source || 'manual'
        });
        await metric.save();
        await generateInsightsForMetric(userId, metric);
        res.status(201).json({
            success: true,
            data: metric,
            message: 'Health metric added successfully'
        });
    }
    catch (error) {
        console.error('Error adding health metric:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add health metric'
        });
    }
};
exports.addHealthMetric = addHealthMetric;
const getHealthTrends = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, period = '30' } = req.query;
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        let matchQuery = {
            userId,
            recordedAt: { $gte: startDate }
        };
        if (type) {
            matchQuery.type = type;
        }
        const trends = await HealthMetric_1.default.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        type: '$type',
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } }
                    },
                    avgValue: { $avg: '$value' },
                    minValue: { $min: '$value' },
                    maxValue: { $max: '$value' },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    data: {
                        $push: {
                            date: '$_id.date',
                            avgValue: '$avgValue',
                            minValue: '$minValue',
                            maxValue: '$maxValue',
                            count: '$count'
                        }
                    }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
        res.json({
            success: true,
            data: trends,
            period: `${days} days`
        });
    }
    catch (error) {
        console.error('Error fetching health trends:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch health trends'
        });
    }
};
exports.getHealthTrends = getHealthTrends;
const getLatestMetrics = async (req, res) => {
    try {
        const userId = req.user._id;
        const latestMetrics = await HealthMetric_1.default.aggregate([
            { $match: { userId } },
            { $sort: { recordedAt: -1 } },
            {
                $group: {
                    _id: '$type',
                    latest: { $first: '$$ROOT' }
                }
            },
            { $replaceRoot: { newRoot: '$latest' } },
            { $sort: { recordedAt: -1 } }
        ]);
        res.json({
            success: true,
            data: latestMetrics
        });
    }
    catch (error) {
        console.error('Error fetching latest metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch latest metrics'
        });
    }
};
exports.getLatestMetrics = getLatestMetrics;
const updateHealthMetric = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const updates = req.body;
        const metric = await HealthMetric_1.default.findOneAndUpdate({ _id: id, userId }, updates, { new: true, runValidators: true });
        if (!metric) {
            return res.status(404).json({
                success: false,
                message: 'Health metric not found'
            });
        }
        res.json({
            success: true,
            data: metric,
            message: 'Health metric updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating health metric:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update health metric'
        });
    }
};
exports.updateHealthMetric = updateHealthMetric;
const deleteHealthMetric = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const metric = await HealthMetric_1.default.findOneAndDelete({ _id: id, userId });
        if (!metric) {
            return res.status(404).json({
                success: false,
                message: 'Health metric not found'
            });
        }
        res.json({
            success: true,
            message: 'Health metric deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting health metric:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete health metric'
        });
    }
};
exports.deleteHealthMetric = deleteHealthMetric;
const getHealthInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, severity, isRead, limit = 20 } = req.query;
        let query = { userId };
        if (type)
            query.type = type;
        if (severity)
            query.severity = severity;
        if (isRead !== undefined)
            query.isRead = isRead === 'true';
        const insights = await HealthInsight_1.default.find(query)
            .sort({ generatedAt: -1 })
            .limit(parseInt(limit))
            .lean();
        res.json({
            success: true,
            data: insights,
            count: insights.length
        });
    }
    catch (error) {
        console.error('Error fetching health insights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch health insights'
        });
    }
};
exports.getHealthInsights = getHealthInsights;
const markInsightAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const insight = await HealthInsight_1.default.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true });
        if (!insight) {
            return res.status(404).json({
                success: false,
                message: 'Health insight not found'
            });
        }
        res.json({
            success: true,
            data: insight,
            message: 'Insight marked as read'
        });
    }
    catch (error) {
        console.error('Error marking insight as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark insight as read'
        });
    }
};
exports.markInsightAsRead = markInsightAsRead;
async function generateInsightsForMetric(userId, metric) {
    try {
        const recentMetrics = await HealthMetric_1.default.find({
            userId,
            type: metric.type,
            recordedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ recordedAt: -1 }).limit(5);
        if (recentMetrics.length >= 3) {
            const values = recentMetrics.map(m => m.value);
            const trend = calculateTrend(values);
            if (trend.direction !== 'stable') {
                await HealthInsight_1.default.create({
                    userId,
                    type: 'trend',
                    title: `${metric.type.replace('_', ' ')} Trend Alert`,
                    message: `Your ${metric.type.replace('_', ' ')} has been ${trend.direction} over the last week.`,
                    severity: trend.direction === 'increasing' && metric.type === 'blood_pressure' ? 'warning' : 'info',
                    relatedMetricType: metric.type
                });
            }
        }
        await generateSpecificAlerts(userId, metric);
    }
    catch (error) {
        console.error('Error generating insights:', error);
    }
}
function calculateTrend(values) {
    if (values.length < 3)
        return { direction: 'stable', change: 0 };
    const recent = values.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
    const older = values.slice(-2).reduce((a, b) => a + b, 0) / 2;
    const change = ((recent - older) / older) * 100;
    if (Math.abs(change) < 5)
        return { direction: 'stable', change };
    return { direction: change > 0 ? 'increasing' : 'decreasing', change };
}
async function generateSpecificAlerts(userId, metric) {
    let alertMessage = '';
    let severity = 'info';
    switch (metric.type) {
        case 'blood_pressure':
            if (metric.value > 140 || (metric.secondaryValue && metric.secondaryValue > 90)) {
                alertMessage = 'Your blood pressure reading is elevated. Consider consulting your healthcare provider.';
                severity = 'warning';
            }
            break;
        case 'glucose':
            if (metric.value > 180) {
                alertMessage = 'Your blood glucose level is high. Monitor closely and follow your diabetes management plan.';
                severity = 'warning';
            }
            break;
        case 'heart_rate':
            if (metric.value > 100 || metric.value < 60) {
                alertMessage = 'Your heart rate is outside the normal range. Consider monitoring throughout the day.';
                severity = 'info';
            }
            break;
    }
    if (alertMessage) {
        await HealthInsight_1.default.create({
            userId,
            type: 'alert',
            title: `${metric.type.replace('_', ' ')} Alert`,
            message: alertMessage,
            severity,
            relatedMetricType: metric.type
        });
    }
}
//# sourceMappingURL=healthMetricController.js.map