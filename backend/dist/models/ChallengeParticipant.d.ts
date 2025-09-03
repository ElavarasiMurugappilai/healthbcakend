import mongoose, { Schema, Document } from 'mongoose';
export interface IChallengeParticipant extends Document {
    userId: Schema.Types.ObjectId;
    challengeId: Schema.Types.ObjectId;
    joinedAt: Date;
    progress: number;
    completed: boolean;
    lastUpdated: Date;
    streak: number;
    personalBest?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IChallengeParticipant, {}, {}, {}, mongoose.Document<unknown, {}, IChallengeParticipant> & IChallengeParticipant & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=ChallengeParticipant.d.ts.map