import mongoose, { Schema, Document } from "mongoose";
export interface IFitnessLog extends Document {
    userId: Schema.Types.ObjectId;
    date: Date;
    steps: number;
    calories: number;
    workoutMinutes: number;
    waterIntake: number;
    workoutType?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IFitnessLog, {}, {}, {}, mongoose.Document<unknown, {}, IFitnessLog> & IFitnessLog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=FitnessLog.d.ts.map