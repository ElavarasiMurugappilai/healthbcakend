import mongoose, { Schema, Document } from "mongoose";
export interface IMedicationSchedule extends Document {
    userId: Schema.Types.ObjectId;
    medicationName: string;
    dosage: string;
    scheduleTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedicationSchedule, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationSchedule> & IMedicationSchedule & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MedicationSchedule.d.ts.map