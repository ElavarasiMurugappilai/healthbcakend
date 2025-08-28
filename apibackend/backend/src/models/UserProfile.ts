import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId;

  age?: number | string;
  gender?: string;
  weight?: number | string;
  height?: number | string;
  conditions: string[];
  allergies?: string;
  smoker?: boolean;
  alcohol?: string;
  sleepHours: number[];

  exercise?: string;
  exerciseTypes: string[];
  exerciseDuration: number[];
  fitnessGoals?: string;
  waterIntake: number[];
  stepGoal: number[];

  trackGlucose?: boolean;
  trackBP?: boolean;
  trackHR?: boolean;
  trackSleep?: boolean;
  trackWeight?: boolean;
  units: {
    weight?: string;
    glucose?: string;
    height?: string;
  };

  takeMeds?: boolean;
  prescriptionFile?: string | null;
  medicationReminders?: boolean;

  joinChallenges?: boolean;
  notificationsEnabled?: boolean;

  // Optional: data used by dashboard sections
  medications?: Array<{
    name: string;
    qty: string;
    dosage: string;
    status: "Missed" | "Taken" | "Upcoming";
    time: string;
  }>;
  careTeam?: Array<{
    name: string;
    role: string;
    img?: string;
    badge?: number;
    unread?: boolean;
    messages?: string[];
  }>;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    age: { type: Schema.Types.Mixed },
    gender: String,
    weight: { type: Schema.Types.Mixed },
    height: { type: Schema.Types.Mixed },
    conditions: { type: [String], default: [] },
    allergies: String,
    smoker: Boolean,
    alcohol: String,
    sleepHours: { type: [Number], default: [] },

    exercise: String,
    exerciseTypes: { type: [String], default: [] },
    exerciseDuration: { type: [Number], default: [] },
    fitnessGoals: String,
    waterIntake: { type: [Number], default: [] },
    stepGoal: { type: [Number], default: [] },

    trackGlucose: Boolean,
    trackBP: Boolean,
    trackHR: Boolean,
    trackSleep: Boolean,
    trackWeight: Boolean,
    units: {
      weight: String,
      glucose: String,
      height: String,
    },

    takeMeds: Boolean,
    prescriptionFile: { type: String, default: null },
    medicationReminders: Boolean,

    joinChallenges: Boolean,
    notificationsEnabled: Boolean,

    medications: {
      type: [
        {
          name: String,
          qty: String,
          dosage: String,
          status: { type: String, enum: ["Missed", "Taken", "Upcoming"] },
          time: String,
        },
      ],
      default: [],
    },
    careTeam: {
      type: [
        {
          name: String,
          role: String,
          img: String,
          badge: Number,
          unread: Boolean,
          messages: [String],
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
