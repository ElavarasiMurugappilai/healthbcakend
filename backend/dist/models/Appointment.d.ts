import mongoose, { Document } from 'mongoose';
export interface IAppointment extends Document {
    userId: mongoose.Types.ObjectId;
    doctorId?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    time: string;
    duration?: number;
    type: 'consultation' | 'follow-up' | 'check-up' | 'emergency' | 'other';
    status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
    location?: string;
    notes?: string;
    reminderSent?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment> & IAppointment & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Appointment.d.ts.map