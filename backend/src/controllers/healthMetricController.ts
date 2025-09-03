import { Request, Response } from 'express';
import HealthMetric from '../models/HealthMetric';
import HealthInsight from '../models/HealthInsight';
import { AuthRequest } from '../middleware/auth';

// Get user's health metrics with filtering
export const getHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { type, startDate, endDate, limit = 100 } = req.query;

    let query: any = { userId };
    
    if (type) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate as string);
      if (endDate) query.recordedAt.$lte = new Date(endDate as string);
    }

    const metrics = await HealthMetric.find(query)
      .sort({ recordedAt: -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.json({
      success: true,
      data: metrics,
      count: metrics.length
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health metrics'
    });
  }
};

// Add new health metric
export const addHealthMetric = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { type, value, secondaryValue, unit, recordedAt, notes, source } = req.body;

    const metric = new HealthMetric({
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

    // Generate insights based on the new metric
    await generateInsightsForMetric(userId, metric);

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Health metric added successfully'
    });
  } catch (error) {
    console.error('Error adding health metric:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add health metric'
    });
  }
};

// Get health trends
export const getHealthTrends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { type, period = '30' } = req.query;

    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let matchQuery: any = {
      userId,
      recordedAt: { $gte: startDate }
    };

    if (type) {
      matchQuery.type = type;
    }

    const trends = await HealthMetric.aggregate([
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
  } catch (error) {
    console.error('Error fetching health trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health trends'
    });
  }
};

// Get latest values for each metric type
export const getLatestMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const latestMetrics = await HealthMetric.aggregate([
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
  } catch (error) {
    console.error('Error fetching latest metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest metrics'
    });
  }
};

// Update health metric
export const updateHealthMetric = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const updates = req.body;

    const metric = await HealthMetric.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error('Error updating health metric:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health metric'
    });
  }
};

// Delete health metric
export const deleteHealthMetric = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    const metric = await HealthMetric.findOneAndDelete({ _id: id, userId });

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
  } catch (error) {
    console.error('Error deleting health metric:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health metric'
    });
  }
};

// Get health insights
export const getHealthInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { type, severity, isRead, limit = 20 } = req.query;

    let query: any = { userId };
    
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const insights = await HealthInsight.find(query)
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.json({
      success: true,
      data: insights,
      count: insights.length
    });
  } catch (error) {
    console.error('Error fetching health insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health insights'
    });
  }
};

// Mark insight as read
export const markInsightAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;

    const insight = await HealthInsight.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

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
  } catch (error) {
    console.error('Error marking insight as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark insight as read'
    });
  }
};

// Helper function to generate insights based on new metrics
async function generateInsightsForMetric(userId: any, metric: any) {
  try {
    // Get recent metrics of the same type for trend analysis
    const recentMetrics = await HealthMetric.find({
      userId,
      type: metric.type,
      recordedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }).sort({ recordedAt: -1 }).limit(5);

    if (recentMetrics.length >= 3) {
      const values = recentMetrics.map(m => m.value);
      const trend = calculateTrend(values);
      
      if (trend.direction !== 'stable') {
        await HealthInsight.create({
          userId,
          type: 'trend',
          title: `${metric.type.replace('_', ' ')} Trend Alert`,
          message: `Your ${metric.type.replace('_', ' ')} has been ${trend.direction} over the last week.`,
          severity: trend.direction === 'increasing' && metric.type === 'blood_pressure' ? 'warning' : 'info',
          relatedMetricType: metric.type
        });
      }
    }

    // Generate specific alerts based on metric type and values
    await generateSpecificAlerts(userId, metric);

  } catch (error) {
    console.error('Error generating insights:', error);
  }
}

function calculateTrend(values: number[]) {
  if (values.length < 3) return { direction: 'stable', change: 0 };
  
  const recent = values.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
  const older = values.slice(-2).reduce((a, b) => a + b, 0) / 2;
  const change = ((recent - older) / older) * 100;
  
  if (Math.abs(change) < 5) return { direction: 'stable', change };
  return { direction: change > 0 ? 'increasing' : 'decreasing', change };
}

async function generateSpecificAlerts(userId: any, metric: any) {
  let alertMessage = '';
  let severity: 'info' | 'warning' | 'critical' = 'info';
  
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
    await HealthInsight.create({
      userId,
      type: 'alert',
      title: `${metric.type.replace('_', ' ')} Alert`,
      message: alertMessage,
      severity,
      relatedMetricType: metric.type
    });
  }
}
