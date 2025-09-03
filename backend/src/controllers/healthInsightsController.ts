import { Request, Response } from 'express';
import Measurement from '../models/Measurement';

type AuthRequest = Request;

// Get aggregated trends by metric
export const getTrends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { metric, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const matchStage: any = {
      userId,
      date: { $gte: startDate }
    };

    if (metric) {
      matchStage.type = metric;
    }

    const trends = await Measurement.aggregate([
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
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trends',
      error: error.message
    });
  }
};

// Get latest values by metric type
export const getLatestValues = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { metrics } = req.query;

    const matchStage: any = { userId };

    if (metrics) {
      const metricArray = Array.isArray(metrics) ? metrics : [metrics];
      matchStage.type = { $in: metricArray };
    }

    const latestValues = await Measurement.aggregate([
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
  } catch (error: any) {
    console.error('Error fetching latest values:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest values',
      error: error.message
    });
  }
};

// Get vitals summary
export const getVitalsSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const vitalTypes = ['blood_pressure', 'heart_rate', 'blood_glucose', 'weight', 'temperature'];

    const summary = await Measurement.aggregate([
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
  } catch (error: any) {
    console.error('Error fetching vitals summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vitals summary',
      error: error.message
    });
  }
};

// Get wellness metrics
export const getWellnessMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const wellnessTypes = ['sleep_hours', 'steps', 'calories_burned', 'water_intake', 'mood'];

    const metrics = await Measurement.aggregate([
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
  } catch (error: any) {
    console.error('Error fetching wellness metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wellness metrics',
      error: error.message
    });
  }
};

// Get health insights with AI-like analysis
export const getHealthInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get recent measurements for analysis
    const recentMeasurements = await Measurement.find({
      userId,
      date: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    }).sort({ date: -1 });

    // Generate basic insights based on data patterns
    const insights = generateHealthInsights(recentMeasurements);

    res.json({
      success: true,
      data: {
        insights,
        dataPoints: recentMeasurements.length,
        analysisPeriod: '30 days'
      }
    });
  } catch (error: any) {
    console.error('Error generating health insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate health insights',
      error: error.message
    });
  }
};

// Helper function to generate basic health insights
function generateHealthInsights(measurements: any[]): string[] {
  const insights: string[] = [];

  // Analyze blood pressure trends
  const bpMeasurements = measurements.filter(m => m.type === 'blood_pressure');
  if (bpMeasurements.length > 0) {
    const avgSystolic = bpMeasurements.reduce((sum, m) => sum + m.value, 0) / bpMeasurements.length;
    if (avgSystolic > 140) {
      insights.push('Your average systolic blood pressure is elevated. Consider consulting your healthcare provider.');
    } else if (avgSystolic < 90) {
      insights.push('Your average systolic blood pressure is low. Monitor for symptoms of hypotension.');
    } else {
      insights.push('Your blood pressure readings are within a healthy range. Keep up the good work!');
    }
  }

  // Analyze weight trends
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

  // Analyze sleep patterns
  const sleepMeasurements = measurements.filter(m => m.type === 'sleep_hours');
  if (sleepMeasurements.length > 0) {
    const avgSleep = sleepMeasurements.reduce((sum, m) => sum + m.value, 0) / sleepMeasurements.length;
    if (avgSleep < 7) {
      insights.push('Your average sleep duration is below the recommended 7-9 hours. Consider improving your sleep hygiene.');
    } else if (avgSleep > 9) {
      insights.push('You\'re getting plenty of sleep! This is great for your overall health.');
    }
  }

  // General insights
  if (measurements.length < 10) {
    insights.push('Consider tracking more health metrics regularly for better insights.');
  }

  return insights.length > 0 ? insights : ['Keep tracking your health metrics for personalized insights!'];
}