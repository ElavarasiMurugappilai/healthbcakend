import mongoose, { Schema, Document } from "mongoose";
export interface IDoctorSuggestion extends Document {
    userId: Schema.Types.ObjectId;
    doctorId: Schema.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    suggestedAt: Date;
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IDoctorSuggestion, {}, {}, {}, mongoose.Document<unknown, {}, IDoctorSuggestion> & IDoctorSuggestion & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=DoctorSuggestion.d.ts.map