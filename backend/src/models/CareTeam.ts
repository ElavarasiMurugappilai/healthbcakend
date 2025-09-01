import mongoose, { Schema, Document } from "mongoose";

export interface ICareTeam extends Document {
  userId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  accepted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareTeamSchema = new Schema<ICareTeam>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    accepted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure unique user-doctor pairs
CareTeamSchema.index({ userId: 1, doctorId: 1 }, { unique: true });

export default mongoose.model<ICareTeam>("CareTeam", CareTeamSchema);
