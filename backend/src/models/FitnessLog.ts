import mongoose, { Schema, Document } from "mongoose";

export interface IFitnessLog extends Document {
  userId: Schema.Types.ObjectId;
  date: Date;
  steps: number;
  calories: number;
  workoutMinutes: number;
  waterIntake: number; // in ml
  workoutType?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FitnessLogSchema = new Schema<IFitnessLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    steps: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    workoutMinutes: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
    workoutType: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

// Compound index for efficient queries
FitnessLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IFitnessLog>("FitnessLog", FitnessLogSchema);
