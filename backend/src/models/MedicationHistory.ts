import mongoose, { Schema, Document } from "mongoose";

export interface IMedicationHistory extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  medicationName: string;
  action: "accepted" | "taken" | "missed";
  timestamp: Date;
}

const MedicationHistorySchema = new Schema<IMedicationHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    medicationName: { type: String, required: true },
    action: { type: String, enum: ["accepted", "taken", "missed"], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model<IMedicationHistory>("MedicationHistory", MedicationHistorySchema);