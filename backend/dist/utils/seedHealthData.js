"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedHealthData = void 0;
const HealthMetric_1 = __importDefault(require("../models/HealthMetric"));
const HealthInsight_1 = __importDefault(require("../models/HealthInsight"));
const User_1 = __importDefault(require("../models/User"));
const seedHealthData = async () => {
    try {
        console.log('🌱 Seeding health data...');
        const sampleUser = await User_1.default.findOne();
        if (!sampleUser) {
            console.log('⚠️ No users found, skipping health data seed');
            return;
        }
        const existingMetrics = await HealthMetric_1.default.findOne({ userId: sampleUser._id });
        if (existingMetrics) {
            console.log('✅ Health metrics already seeded');
            return;
        }
        const sampleMetrics = [
            {
                userId: sampleUser._id,
                type: 'weight',
                value: 70.5,
                unit: 'kg',
                recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                source: 'manual'
            },
            {
                userId: sampleUser._id,
                type: 'blood_pressure',
                value: 120,
                secondaryValue: 80,
                unit: 'mmHg',
                recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                source: 'device'
            },
            {
                userId: sampleUser._id,
                type: 'glucose',
                value: 95,
                unit: 'mg/dL',
                recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                source: 'manual'
            },
            {
                userId: sampleUser._id,
                type: 'heart_rate',
                value: 72,
                unit: 'bpm',
                recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                source: 'device'
            }
        ];
        await HealthMetric_1.default.insertMany(sampleMetrics);
        console.log('✅ Sample health metrics seeded');
        const sampleInsights = [
            {
                userId: sampleUser._id,
                type: 'trend',
                title: 'Weight Trend',
                message: 'Your weight has been stable over the past week. Keep up the good work!',
                severity: 'info',
                relatedMetricType: 'weight'
            },
            {
                userId: sampleUser._id,
                type: 'recommendation',
                title: 'Blood Pressure Check',
                message: 'Your blood pressure readings are within normal range. Continue monitoring regularly.',
                severity: 'success',
                relatedMetricType: 'blood_pressure'
            },
            {
                userId: sampleUser._id,
                type: 'alert',
                title: 'Glucose Monitoring',
                message: 'Remember to check your glucose levels regularly, especially after meals.',
                severity: 'info',
                relatedMetricType: 'glucose'
            }
        ];
        await HealthInsight_1.default.insertMany(sampleInsights);
        console.log('✅ Sample health insights seeded');
        console.log('✅ Health data seeding completed successfully');
    }
    catch (error) {
        console.error('❌ Error seeding health data:', error);
    }
};
exports.seedHealthData = seedHealthData;
//# sourceMappingURL=seedHealthData.js.map