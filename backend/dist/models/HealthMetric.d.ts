import mongoose, { Schema, Document } from 'mongoose';
export interface IHealthMetric extends Document {
    userId: Schema.Types.ObjectId;
    type: 'weight' | 'blood_pressure' | 'glucose' | 'heart_rate' | 'temperature' | 'oxygen_saturation';
    value: number;
    secondaryValue?: number;
    unit: string;
    recordedAt: Date;
    notes?: string;
    source: 'manual' | 'device' | 'app';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IHealthMetric, {}, {}, {}, mongoose.Document<unknown, {}, IHealthMetric> & IHealthMetric & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=HealthMetric.d.ts.map