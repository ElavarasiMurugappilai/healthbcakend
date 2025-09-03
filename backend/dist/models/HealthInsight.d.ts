import mongoose, { Schema, Document } from 'mongoose';
export interface IHealthInsight extends Document {
    userId: Schema.Types.ObjectId;
    type: 'trend' | 'alert' | 'recommendation' | 'achievement';
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'critical' | 'success';
    isRead: boolean;
    generatedAt: Date;
    expiresAt?: Date;
    relatedMetricType?: string;
    actionUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IHealthInsight, {}, {}, {}, mongoose.Document<unknown, {}, IHealthInsight> & IHealthInsight & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=HealthInsight.d.ts.map