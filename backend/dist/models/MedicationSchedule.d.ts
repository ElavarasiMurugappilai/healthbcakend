import mongoose, { Schema, Document } from "mongoose";
export interface IMedicationSchedule extends Document {
    userId: Schema.Types.ObjectId;
    medicationName: string;
    dosage: string;
    frequency: string;
    scheduleTime: string;
    source: 'manual' | 'doctor-suggestion';
    suggestionId?: Schema.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedicationSchedule, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationSchedule> & IMedicationSchedule & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MedicationSchedule.d.ts.map