import mongoose, { Schema, Document } from "mongoose";

export interface IFitnessGoal extends Document {
  userId: Schema.Types.ObjectId;
  stepsTarget: number;       // e.g. 8000
  caloriesTarget: number;    // e.g. 500
  workoutTarget: number;     // sessions per week
  waterTarget: number;       // ml/day (or liters * 1000)

  // Quiz-derived preferences
  primaryFitnessGoal: string;
  exerciseDaysPerWeek: number;
  preferredActivities: string[];
  exerciseDuration: string;
  workoutDifficulty: string;

  progress: {
    steps: number;           // today's steps
    calories: number;        // today's calories burned
    workout: number;         // completed sessions this week
    water: number;           // today's ml consumed
  };

  weeklyStats: {
    totalSteps: number;
    totalCalories: number;
    totalWorkouts: number;
    totalWater: number;
    weekStartDate: Date;
  };
}

const FitnessGoalSchema = new Schema<IFitnessGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    stepsTarget: { type: Number, default: 8000 },
    caloriesTarget: { type: Number, default: 500 },
    workoutTarget: { type: Number, default: 5 },
    waterTarget: { type: Number, default: 2000 },
    
    // Quiz-derived preferences
    primaryFitnessGoal: { type: String, default: "general_fitness" },
    exerciseDaysPerWeek: { type: Number, default: 3 },
    preferredActivities: [{ type: String }],
    exerciseDuration: { type: String, default: "30min" },
    workoutDifficulty: { type: String, default: "beginner" },
    
    progress: {
      steps: { type: Number, default: 0 },
      calories: { type: Number, default: 0 },
      workout: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
    },
    
    weeklyStats: {
      totalSteps: { type: Number, default: 0 },
      totalCalories: { type: Number, default: 0 },
      totalWorkouts: { type: Number, default: 0 },
      totalWater: { type: Number, default: 0 },
      weekStartDate: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFitnessGoal>("FitnessGoal", FitnessGoalSchema);
