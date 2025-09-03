import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthMetric extends Document {
  userId: Schema.Types.ObjectId;
  type: 'weight' | 'blood_pressure' | 'glucose' | 'heart_rate' | 'temperature' | 'oxygen_saturation';
  value: number;
  secondaryValue?: number; // For BP (diastolic), optional
  unit: string;
  recordedAt: Date;
  notes?: string;
  source: 'manual' | 'device' | 'app';
  createdAt: Date;
  updatedAt: Date;
}

const HealthMetricSchema = new Schema<IHealthMetric>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['weight', 'blood_pressure', 'glucose', 'heart_rate', 'temperature', 'oxygen_saturation'],
      required: true,
      index: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    secondaryValue: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    source: {
      type: String,
      enum: ['manual', 'device', 'app'],
      default: 'manual'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for efficient queries
HealthMetricSchema.index({ userId: 1, type: 1, recordedAt: -1 });
HealthMetricSchema.index({ userId: 1, recordedAt: -1 });

// Virtual for formatted value with unit
HealthMetricSchema.virtual('formattedValue').get(function() {
  if (this.secondaryValue) {
    return `${this.value}/${this.secondaryValue} ${this.unit}`;
  }
  return `${this.value} ${this.unit}`;
});

export default mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema);
