import mongoose, { Schema, Document } from "mongoose";
export interface IFitnessGoal extends Document {
    userId: Schema.Types.ObjectId;
    stepsTarget: number;
    caloriesTarget: number;
    workoutTarget: number;
    waterTarget: number;
    primaryFitnessGoal: string;
    exerciseDaysPerWeek: number;
    preferredActivities: string[];
    exerciseDuration: string;
    workoutDifficulty: string;
    progress: {
        steps: number;
        calories: number;
        workout: number;
        water: number;
    };
    weeklyStats: {
        totalSteps: number;
        totalCalories: number;
        totalWorkouts: number;
        totalWater: number;
        weekStartDate: Date;
    };
}
declare const _default: mongoose.Model<IFitnessGoal, {}, {}, {}, mongoose.Document<unknown, {}, IFitnessGoal> & IFitnessGoal & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=FitnessGoal.d.ts.map