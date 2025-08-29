import mongoose, { Document, Schema } from 'mongoose';

export interface IMeasurement extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'glucose' | 'blood_pressure' | 'heart_rate' | 'weight' | 'sleep' | 'steps' | 'water' | 'exercise';
  value: number | string | object;
  unit?: string;
  timestamp: Date;
  notes?: string;
  source?: 'manual' | 'device' | 'app';
  metadata?: {
    systolic?: number;
    diastolic?: number;
    duration?: number;
    quality?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MeasurementSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  type: {
    type: String,
    required: [true, 'Measurement type is required'],
    enum: ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water', 'exercise'],
    index: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: [true, 'Measurement value is required']
  },
  unit: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
    index: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  source: {
    type: String,
    enum: ['manual', 'device', 'app'],
    default: 'manual'
  },
  metadata: {
    systolic: Number,
    diastolic: Number,
    duration: Number,
    quality: String,
    // Allow additional fields
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
MeasurementSchema.index({ userId: 1, type: 1, timestamp: -1 });
MeasurementSchema.index({ userId: 1, timestamp: -1 });
MeasurementSchema.index({ type: 1, timestamp: -1 });

// Validation for specific measurement types
MeasurementSchema.pre('save', function(next) {
  const measurement = this;
  
  // Validate blood pressure measurements
  if (measurement.type === 'blood_pressure') {
    if (!measurement.metadata?.systolic || !measurement.metadata?.diastolic) {
      return next(new Error('Blood pressure measurements require systolic and diastolic values'));
    }
    if (measurement.metadata.systolic < 50 || measurement.metadata.systolic > 300) {
      return next(new Error('Invalid systolic pressure value'));
    }
    if (measurement.metadata.diastolic < 30 || measurement.metadata.diastolic > 200) {
      return next(new Error('Invalid diastolic pressure value'));
    }
  }
  
  // Validate glucose measurements
  if (measurement.type === 'glucose') {
    const value = Number(measurement.value);
    if (isNaN(value) || value < 20 || value > 600) {
      return next(new Error('Invalid glucose value'));
    }
  }
  
  // Validate weight measurements
  if (measurement.type === 'weight') {
    const value = Number(measurement.value);
    if (isNaN(value) || value < 20 || value > 1000) {
      return next(new Error('Invalid weight value'));
    }
  }
  
  // Validate heart rate measurements
  if (measurement.type === 'heart_rate') {
    const value = Number(measurement.value);
    if (isNaN(value) || value < 30 || value > 300) {
      return next(new Error('Invalid heart rate value'));
    }
  }
  
  next();
});

// Static method to get measurements by date range
MeasurementSchema.statics.getByDateRange = function(
  userId: mongoose.Types.ObjectId,
  type: string | undefined,
  startDate: Date,
  endDate: Date,
  limit: number = 100
) {
  const query: any = {
    userId,
    timestamp: { $gte: startDate, $lte: endDate }
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

// Static method to get latest measurements by type
MeasurementSchema.statics.getLatestByType = function(
  userId: mongoose.Types.ObjectId,
  types: string[]
) {
  return this.aggregate([
    { $match: { userId, type: { $in: types } } },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$type',
        latest: { $first: '$$ROOT' }
      }
    },
    { $replaceRoot: { newRoot: '$latest' } }
  ]);
};

export default mongoose.model<IMeasurement>('Measurement', MeasurementSchema);
