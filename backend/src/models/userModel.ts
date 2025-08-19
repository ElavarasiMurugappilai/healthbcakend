import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    conditions: [
      {
        type: String,
      },
    ], // example: ["Diabetes", "Hypertension"]
    goals: [
      {
        type: String,
      },
    ], // example: ["Lose Weight", "Track Glucose"]
  },
  { timestamps: true }
);

// Export User model
const User = mongoose.model("User", userSchema);

export default User;
