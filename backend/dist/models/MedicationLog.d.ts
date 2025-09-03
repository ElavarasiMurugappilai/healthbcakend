import mongoose, { Schema, Document } from 'mongoose';
export interface IMedicationLog extends Document {
    userId: Schema.Types.ObjectId;
    medicationId: Schema.Types.ObjectId;
    scheduledTime: Date;
    takenTime?: Date;
    status: 'taken' | 'missed' | 'skipped' | 'accepted' | 'rejected';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedicationLog, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationLog> & IMedicationLog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MedicationLog.d.ts.map