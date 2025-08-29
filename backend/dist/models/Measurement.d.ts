import mongoose, { Document } from 'mongoose';
export interface IMeasurement extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'glucose' | 'blood_pressure' | 'heart_rate' | 'weight' | 'sleep' | 'steps' | 'water' | 'exercise';
    value: number | string | object;
    unit?: string;
    timestamp: Date;
    notes?: string;
    source?: 'manual' | 'device' | 'app';
    metadata?: {
        systolic?: number;
        diastolic?: number;
        duration?: number;
        quality?: string;
        [key: string]: any;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMeasurement, {}, {}, {}, mongoose.Document<unknown, {}, IMeasurement> & IMeasurement & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Measurement.d.ts.map