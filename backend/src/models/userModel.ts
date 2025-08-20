// src/models/User.ts
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  conditions?: string[];
  lifestyle?: {
    smoking: boolean;
    alcohol: boolean;
    diet: string;
    sleepHours: number;
    physicalActivity: string;
  };
  goals?: string[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    time: string;
    reminders: string;
    logs?: { status: string; date: string }[];
  }[];
  careTeam?: { name: string; specialty: string; contact?: string }[];
  preferences?: {
    theme: string;
    notifications: string;
    widgets: string[];
  };
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: String,
    conditions: [String],
    lifestyle: {
      smoking: Boolean,
      alcohol: Boolean,
      diet: String,
      sleepHours: Number,
      physicalActivity: String,
    },
    goals: [String],
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        time: String,
        reminders: String,
        logs: [{ status: String, date: String }],
      },
    ],
    careTeam: [
      {
        name: String,
        specialty: String,
        contact: String,
      },
    ],
    preferences: {
      theme: String,
      notifications: String,
      widgets: [String],
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
