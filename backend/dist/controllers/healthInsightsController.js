"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthInsights = exports.getWellnessMetrics = exports.getVitalsSummary = exports.getLatestValues = exports.getTrends = void 0;
const Measurement_1 = __importDefault(require("../models/Measurement"));
const getTrends = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { metric, days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));
        const matchStage = {
            userId,
            date: { $gte: startDate }
        };
        if (metric) {
            matchStage.type = metric;
        }
        const trends = await Measurement_1.default.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        type: '$type',
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$date'
                            }
                        }
                    },
                    avgValue: { $avg: '$value' },
                    minValue: { $min: '$value' },
                    maxValue: { $max: '$value' },
                    count: { $sum: 1 },
                    values: { $push: '$value' }
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
            {
                $project: {
                    metric: '$_id',
                    data: 1,
                    _id: 0
                }
            }
        ]);
        res.json({
            success: true,
            data: trends
        });
    }
    catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trends',
            error: error.message
        });
    }
};
exports.getTrends = getTrends;
const getLatestValues = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { metrics } = req.query;
        const matchStage = { userId };
        if (metrics) {
            const metricArray = Array.isArray(metrics) ? metrics : [metrics];
            matchStage.type = { $in: metricArray };
        }
        const latestValues = await Measurement_1.default.aggregate([
            { $match: matchStage },
            {
                $sort: { date: -1 }
            },
            {
                $group: {
                    _id: '$type',
                    latestMeasurement: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$latestMeasurement'
                }
            }
        ]);
        res.json({
            success: true,
            data: latestValues
        });
    }
    catch (error) {
        console.error('Error fetching latest values:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch latest values',
            error: error.message
        });
    }
};
exports.getLatestValues = getLatestValues;
const getVitalsSummary = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const vitalTypes = ['blood_pressure', 'heart_rate', 'blood_glucose', 'weight', 'temperature'];
        const summary = await Measurement_1.default.aggregate([
            {
                $match: {
                    userId,
                    type: { $in: vitalTypes }
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $group: {
                    _id: '$type',
                    latestValue: { $first: '$value' },
                    latestDate: { $first: '$date' },
                    unit: { $first: '$unit' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    metric: '$_id',
                    latestValue: 1,
                    latestDate: 1,
                    unit: 1,
                    totalMeasurements: '$count',
                    _id: 0
                }
            }
        ]);
        res.json({
            success: true,
            data: summary
        });
    }
    catch (error) {
        console.error('Error fetching vitals summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vitals summary',
            error: error.message
        });
    }
};
exports.getVitalsSummary = getVitalsSummary;
const getWellnessMetrics = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const wellnessTypes = ['sleep_hours', 'steps', 'calories_burned', 'water_intake', 'mood'];
        const metrics = await Measurement_1.default.aggregate([
            {
                $match: {
                    userId,
                    type: { $in: wellnessTypes }
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $group: {
                    _id: {
                        type: '$type',
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$date'
                            }
                        }
                    },
                    avgValue: { $avg: '$value' },
                    values: { $push: '$value' }
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    dailyData: {
                        $push: {
                            date: '$_id.date',
                            avgValue: '$avgValue'
                        }
                    }
                }
            },
            {
                $project: {
                    metric: '$_id',
                    dailyData: 1,
                    _id: 0
                }
            }
        ]);
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        console.error('Error fetching wellness metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wellness metrics',
            error: error.message
        });
    }
};
exports.getWellnessMetrics = getWellnessMetrics;
const getHealthInsights = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const recentMeasurements = await Measurement_1.default.find({
            userId,
            date: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        }).sort({ date: -1 });
        const insights = generateHealthInsights(recentMeasurements);
        res.json({
            success: true,
            data: {
                insights,
                dataPoints: recentMeasurements.length,
                analysisPeriod: '30 days'
            }
        });
    }
    catch (error) {
        console.error('Error generating health insights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate health insights',
            error: error.message
        });
    }
};
exports.getHealthInsights = getHealthInsights;
function generateHealthInsights(measurements) {
    const insights = [];
    const bpMeasurements = measurements.filter(m => m.type === 'blood_pressure');
    if (bpMeasurements.length > 0) {
        const avgSystolic = bpMeasurements.reduce((sum, m) => sum + m.value, 0) / bpMeasurements.length;
        if (avgSystolic > 140) {
            insights.push('Your average systolic blood pressure is elevated. Consider consulting your healthcare provider.');
        }
        else if (avgSystolic < 90) {
            insights.push('Your average systolic blood pressure is low. Monitor for symptoms of hypotension.');
        }
        else {
            insights.push('Your blood pressure readings are within a healthy range. Keep up the good work!');
        }
    }
    const weightMeasurements = measurements.filter(m => m.type === 'weight');
    if (weightMeasurements.length > 1) {
        const sortedWeights = weightMeasurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const firstWeight = sortedWeights[0].value;
        const lastWeight = sortedWeights[sortedWeights.length - 1].value;
        const weightChange = lastWeight - firstWeight;
        if (Math.abs(weightChange) > 2) {
            const direction = weightChange > 0 ? 'increased' : 'decreased';
            insights.push(`Your weight has ${direction} by ${Math.abs(weightChange).toFixed(1)} kg over the past month.`);
        }
    }
    const sleepMeasurements = measurements.filter(m => m.type === 'sleep_hours');
    if (sleepMeasurements.length > 0) {
        const avgSleep = sleepMeasurements.reduce((sum, m) => sum + m.value, 0) / sleepMeasurements.length;
        if (avgSleep < 7) {
            insights.push('Your average sleep duration is below the recommended 7-9 hours. Consider improving your sleep hygiene.');
        }
        else if (avgSleep > 9) {
            insights.push('You\'re getting plenty of sleep! This is great for your overall health.');
        }
    }
    if (measurements.length < 10) {
        insights.push('Consider tracking more health metrics regularly for better insights.');
    }
    return insights.length > 0 ? insights : ['Keep tracking your health metrics for personalized insights!'];
}
//# sourceMappingURL=healthInsightsController.js.map