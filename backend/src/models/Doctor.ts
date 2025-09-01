import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  email?: string;
  specialization: string;
  photo?: string;
  rating?: number;
  experience?: number;
  isSystemApproved: boolean; // true for system-approved, false for personal
  addedBy?: Schema.Types.ObjectId; // user who added personal doctor
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String },
    specialization: { type: String, required: true },
    photo: { type: String, default: null },
    rating: { type: Number, min: 1, max: 5, default: 4.5 },
    experience: { type: Number, default: 5 },
    isSystemApproved: { type: Boolean, default: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
