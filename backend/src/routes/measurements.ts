import express, { Request, Response } from 'express';
import Measurement from '../models/Measurement';
import { authenticateToken } from '../middleware/auth';
import { measurementValidation, handleValidationErrors, bloodPressureValidation } from '../utils/validation';

const router = express.Router();

// POST /measurements - Create new measurement entry
router.post('/', authenticateToken, measurementValidation, handleValidationErrors, bloodPressureValidation, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { type, value, unit, timestamp, notes, source, metadata } = req.body;

    const measurement = new Measurement({
      userId: req.user._id,
      type,
      value,
      unit,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      notes,
      source: source || 'manual',
      metadata
    });

    const savedMeasurement = await measurement.save();

    console.log(`✅ Measurement saved: ${type} for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Measurement saved successfully',
      data: savedMeasurement
    });
  } catch (error: any) {
    console.error('❌ Measurement creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving measurement',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /measurements/batch - Create multiple measurements
router.post('/batch', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { measurements } = req.body;

    if (!Array.isArray(measurements)) {
      return res.status(400).json({
        success: false,
        message: 'Measurements must be an array'
      });
    }

    const savedMeasurements = [];
    const errors = [];

    for (let i = 0; i < measurements.length; i++) {
      try {
        const measurementData = measurements[i];
        const measurement = new Measurement({
          userId: req.user._id,
          type: measurementData.type,
          value: measurementData.value,
          unit: measurementData.unit,
          timestamp: measurementData.timestamp ? new Date(measurementData.timestamp) : new Date(),
          notes: measurementData.notes,
          source: measurementData.source || 'manual',
          metadata: measurementData.metadata
        });

        const saved = await measurement.save();
        savedMeasurements.push(saved);
      } catch (error: any) {
        errors.push({
          index: i,
          error: error.message,
          data: measurements[i]
        });
      }
    }

    console.log(`✅ Batch measurements saved: ${savedMeasurements.length}/${measurements.length} for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: `Saved ${savedMeasurements.length} of ${measurements.length} measurements`,
      data: {
        saved: savedMeasurements,
        errors: errors
      }
    });
  } catch (error: any) {
    console.error('❌ Batch measurement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving batch measurements',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /measurements - Query measurements with filters
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      type,
      startDate,
      endDate,
      limit = '100',
      offset = '0',
      sort = 'desc'
    } = req.query;

    // Build query
    const query: any = { userId: req.user._id };

    if (type) {
      if (Array.isArray(type)) {
        query.type = { $in: type };
      } else {
        query.type = type;
      }
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate as string);
      }
    }

    // Execute query
    const measurements = await Measurement.find(query)
      .sort({ timestamp: sort === 'asc' ? 1 : -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .lean();

    // Get total count for pagination
    const totalCount = await Measurement.countDocuments(query);

    res.json({
      success: true,
      data: {
        measurements,
        pagination: {
          total: totalCount,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: totalCount > parseInt(offset as string) + measurements.length
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Measurements query error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching measurements',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /measurements/latest - Get latest measurements by type
router.get('/latest', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { types } = req.query;
    let measurementTypes: string[];

    if (types) {
      measurementTypes = Array.isArray(types) ? types as string[] : [types as string];
    } else {
      measurementTypes = ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water'];
    }

    const latestMeasurements = await (Measurement as any).getLatestByType(
      req.user._id,
      measurementTypes
    );

    res.json({
      success: true,
      data: latestMeasurements
    });
  } catch (error: any) {
    console.error('❌ Latest measurements error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest measurements',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /measurements/stats - Get measurement statistics
router.get('/stats', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { type, days = '30' } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Measurement type is required'
      });
    }

    const daysBack = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const measurements = await Measurement.find({
      userId: req.user._id,
      type,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    if (measurements.length === 0) {
      return res.json({
        success: true,
        data: {
          count: 0,
          average: null,
          min: null,
          max: null,
          trend: null
        }
      });
    }

    // Calculate statistics
    const values = measurements.map(m => {
      if (type === 'blood_pressure') {
        return m.metadata?.systolic || 0;
      }
      return Number(m.value) || 0;
    }).filter(v => v > 0);

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Simple trend calculation (comparing first half vs second half)
    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint);
    const secondHalf = values.slice(midpoint);
    
    let trend = 'stable';
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      const change = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      if (change > 5) trend = 'increasing';
      else if (change < -5) trend = 'decreasing';
    }

    res.json({
      success: true,
      data: {
        count: measurements.length,
        average: Math.round(average * 100) / 100,
        min,
        max,
        trend,
        period: `${daysBack} days`
      }
    });
  } catch (error: any) {
    console.error('❌ Measurement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating measurement statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /measurements/:id - Delete a measurement
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    const measurement = await Measurement.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found'
      });
    }

    console.log(`✅ Measurement deleted: ${id} for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Measurement deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Measurement deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting measurement',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
