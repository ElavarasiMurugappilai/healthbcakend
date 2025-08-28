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
declare const _default: mongoose.Model<IUserProfile, {}, {}, {}, mongoose.Document<unknown, {}, IUserProfile> & IUserProfile & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=UserProfile.d.ts.map