import mongoose, { Schema, Document } from "mongoose";
export interface IMedication extends Document {
    userId: Schema.Types.ObjectId;
    doctorId?: Schema.Types.ObjectId;
    name: string;
    dosage: string;
    frequency: string;
    instructions?: string;
    status: "pending" | "accepted" | "declined" | "scheduled";
    suggestedAt?: Date;
    acceptedAt?: Date;
    scheduledTimes?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedication, {}, {}, {}, mongoose.Document<unknown, {}, IMedication> & IMedication & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Medication.d.ts.map