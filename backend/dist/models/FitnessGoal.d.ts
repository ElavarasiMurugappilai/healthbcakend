import mongoose, { Schema, Document } from "mongoose";
export interface IFitnessGoal extends Document {
    userId: Schema.Types.ObjectId;
    stepsTarget: number;
    caloriesTarget: number;
    workoutTarget: number;
    waterTarget: number;
    progress: {
        steps: number;
        calories: number;
        workout: number;
        water: number;
    };
}
declare const _default: mongoose.Model<IFitnessGoal, {}, {}, {}, mongoose.Document<unknown, {}, IFitnessGoal> & IFitnessGoal & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=FitnessGoal.d.ts.map