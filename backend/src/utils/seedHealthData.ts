import HealthMetric from '../models/HealthMetric';
import HealthInsight from '../models/HealthInsight';
import User from '../models/User';

export const seedHealthData = async () => {
  try {
    console.log('🌱 Seeding health data...');

    // Get a sample user for seeding (optional - for demo purposes)
    const sampleUser = await User.findOne();
    if (!sampleUser) {
      console.log('⚠️ No users found, skipping health data seed');
      return;
    }

    // Check if health metrics already exist
    const existingMetrics = await HealthMetric.findOne({ userId: sampleUser._id });
    if (existingMetrics) {
      console.log('✅ Health metrics already seeded');
      return;
    }

    // Sample health metrics for demonstration
    const sampleMetrics = [
      {
        userId: sampleUser._id,
        type: 'weight',
        value: 70.5,
        unit: 'kg',
        recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        source: 'manual'
      },
      {
        userId: sampleUser._id,
        type: 'blood_pressure',
        value: 120,
        secondaryValue: 80,
        unit: 'mmHg',
        recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        source: 'device'
      },
      {
        userId: sampleUser._id,
        type: 'glucose',
        value: 95,
        unit: 'mg/dL',
        recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        source: 'manual'
      },
      {
        userId: sampleUser._id,
        type: 'heart_rate',
        value: 72,
        unit: 'bpm',
        recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        source: 'device'
      }
    ];

    // Insert sample metrics
    await HealthMetric.insertMany(sampleMetrics);
    console.log('✅ Sample health metrics seeded');

    // Sample health insights
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

    // Insert sample insights
    await HealthInsight.insertMany(sampleInsights);
    console.log('✅ Sample health insights seeded');

    console.log('✅ Health data seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding health data:', error);
  }
};
