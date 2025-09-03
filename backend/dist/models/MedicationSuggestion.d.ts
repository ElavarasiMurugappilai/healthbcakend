import mongoose, { Schema, Document } from "mongoose";
export interface IMedicationSuggestion extends Document {
    userId: Schema.Types.ObjectId;
    doctorId: Schema.Types.ObjectId;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    respondedAt?: Date;
}
declare const _default: mongoose.Model<IMedicationSuggestion, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationSuggestion> & IMedicationSuggestion & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MedicationSuggestion.d.ts.map