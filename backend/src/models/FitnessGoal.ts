import mongoose, { Schema, Document } from "mongoose";

export interface IFitnessGoal extends Document {
  userId: Schema.Types.ObjectId;
  stepsTarget: number;       // e.g. 8000
  caloriesTarget: number;    // e.g. 500
  workoutTarget: number;     // minutes/day or sessions/day (pick one)
  waterTarget: number;       // ml/day (or liters * 1000)

  progress: {
    steps: number;           // today’s steps
    calories: number;        // today’s calories burned
    workout: number;         // today’s minutes/sessions
    water: number;           // today’s ml consumed
  };
}

const FitnessGoalSchema = new Schema<IFitnessGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    stepsTarget: { type: Number, default: 8000 },
    caloriesTarget: { type: Number, default: 500 },
    workoutTarget: { type: Number, default: 30 },
    waterTarget: { type: Number, default: 2000 },
    progress: {
      steps: { type: Number, default: 0 },
      calories: { type: Number, default: 0 },
      workout: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFitnessGoal>("FitnessGoal", FitnessGoalSchema);
