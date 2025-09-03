import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  time: string;
  duration?: number; // in minutes
  type: 'consultation' | 'follow-up' | 'check-up' | 'emergency' | 'other';
  status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
  location?: string;
  notes?: string;
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30,
    min: 15,
    max: 120
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'check-up', 'emergency', 'other'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'no-show'],
    default: 'upcoming',
    index: true
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
AppointmentSchema.index({ userId: 1, date: 1 });
AppointmentSchema.index({ userId: 1, status: 1 });
AppointmentSchema.index({ date: 1, status: 1 });

// Virtual for formatted date
AppointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for full date and time
AppointmentSchema.virtual('fullDateTime').get(function() {
  return `${this.date.toISOString().split('T')[0]} ${this.time}`;
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);