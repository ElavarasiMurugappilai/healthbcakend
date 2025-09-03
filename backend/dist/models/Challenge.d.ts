import mongoose, { Document } from 'mongoose';
export interface IChallenge extends Document {
    title: string;
    description: string;
    type: 'fitness' | 'wellness' | 'nutrition' | 'mental_health' | 'general';
    difficulty: 'easy' | 'medium' | 'hard';
    target: number;
    unit: string;
    duration: number;
    points: number;
    icon?: string;
    tip?: string;
    isActive: boolean;
    participants: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserChallenge extends Document {
    userId: mongoose.Types.ObjectId;
    challengeId: mongoose.Types.ObjectId;
    current: number;
    status: 'active' | 'completed' | 'paused' | 'abandoned';
    joinedAt: Date;
    completedAt?: Date;
    lastUpdated: Date;
}
export declare const Challenge: mongoose.Model<IChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IChallenge> & IChallenge & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const UserChallenge: mongoose.Model<IUserChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IUserChallenge> & IUserChallenge & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Challenge.d.ts.map