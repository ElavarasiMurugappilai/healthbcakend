import mongoose, { Schema, Document } from "mongoose";
export interface IMedicationSuggestion extends Document {
    userId: Schema.Types.ObjectId;
    doctorId: Schema.Types.ObjectId;
    medicationName: string;
    dosage: string;
    frequency: string;
    reason?: string;
    status: 'pending' | 'accepted' | 'rejected';
    suggestedAt: Date;
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedicationSuggestion, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationSuggestion> & IMedicationSuggestion & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MedicationSuggestion.d.ts.map