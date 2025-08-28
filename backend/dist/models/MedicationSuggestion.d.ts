import mongoose, { Schema, Document } from "mongoose";
export interface IMedicationSuggestion extends Document {
    userId: Schema.Types.ObjectId;
    doctorId: Schema.Types.ObjectId;
    doctorName: string;
    doctorRole: string;
    condition: string;
    medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        notes?: string;
    }>;
    status: "pending" | "accepted" | "rejected";
    reasonForSuggestion: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedicationSuggestion, {}, {}, {}, mongoose.Document<unknown, {}, IMedicationSuggestion> & IMedicationSuggestion & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MedicationSuggestion.d.ts.map