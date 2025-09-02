import mongoose, { Document } from 'mongoose';
interface IHealthCondition {
    name: string;
    diagnosedDate?: Date;
    severity?: 'mild' | 'moderate' | 'severe';
}
interface ICareTeamMember {
    name: string;
    role: string;
    img?: string;
    badge?: number;
    unread?: boolean;
    messages?: any[];
}
interface IProfile {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    weight?: number;
    height?: number;
    conditions?: IHealthCondition[];
    allergies?: string;
    smoker?: boolean;
    alcohol?: 'none' | 'occasional' | 'regular';
    sleepHours?: number[];
    exercise?: 'none' | 'occasional' | 'regular';
    exerciseTypes?: string[];
    exerciseDuration?: number[];
    fitnessGoals?: string;
    waterIntake?: number[];
    stepGoal?: number[];
    trackGlucose?: boolean;
    trackBP?: boolean;
    trackHR?: boolean;
    trackSleep?: boolean;
    trackWeight?: boolean;
    takeMeds?: boolean;
    prescriptionFile?: string;
    medicationReminders?: boolean;
    joinChallenges?: boolean;
    challengeDifficulty?: 'easy' | 'medium' | 'hard';
    rewardType?: 'points' | 'badges' | 'discounts';
    notificationsEnabled?: boolean;
    notificationTiming?: 'morning' | 'evening' | 'anytime';
    pushNotifications?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    units?: {
        weight?: 'kg' | 'lbs';
        height?: 'cm' | 'ft';
        glucose?: 'mg/dL' | 'mmol/L';
    };
    careTeam?: ICareTeamMember[];
    selectedDoctors?: string[];
    selectedCards?: string[];
    completedAt?: Date;
    lastUpdated?: Date;
}
export interface IUser extends Document {
    email: string;
    password: string;
    name?: string;
    profile?: IProfile;
    isVerified?: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    getPublicProfile(): any;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map