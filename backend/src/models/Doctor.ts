import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  photo?: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
