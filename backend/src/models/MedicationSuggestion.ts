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

const MedicationSuggestionSchema = new Schema<IMedicationSuggestion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    respondedAt: { type: Date }
  },
  { timestamps: true }
);

// Index for efficient queries
MedicationSuggestionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IMedicationSuggestion>("MedicationSuggestion", MedicationSuggestionSchema);
