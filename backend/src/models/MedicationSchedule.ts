import mongoose, { Schema, Document } from "mongoose";

export interface IMedicationSchedule extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  qty: string;
  status: "Upcoming" | "Taken" | "Missed";
  time: string;
}

const MedicationScheduleSchema = new Schema<IMedicationSchedule>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    qty: { type: String, required: true },
    status: { type: String, enum: ["Upcoming", "Taken", "Missed"], default: "Upcoming" },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMedicationSchedule>("MedicationSchedule", MedicationScheduleSchema);
