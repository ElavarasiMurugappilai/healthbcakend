import mongoose, { Schema, Document } from "mongoose";
export interface IHealthQuestionnaire extends Document {
    userId: Schema.Types.ObjectId;
    ageGroup: string;
    chronicConditions: string[];
    currentSymptoms: string[];
    allergies: string[];
    lifestyle: string;
    familyHistory: string[];
    stressLevel: string;
    sleepQuality: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IHealthQuestionnaire, {}, {}, {}, mongoose.Document<unknown, {}, IHealthQuestionnaire> & IHealthQuestionnaire & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=HealthQuestionnaire.d.ts.map