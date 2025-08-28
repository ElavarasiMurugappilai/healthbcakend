import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ New fields
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Non-binary", "Prefer not to say", "Other"] },
  conditions: [{ type: String }],
  goals: [{ type: String }],
  primaryGoal: { type: String },
  notes: { type: String },
  consent: { type: Boolean, default: false },
  profilePhoto: { type: String }, // avatar file path

}, { timestamps: true });

export default mongoose.model("User", userSchema);
