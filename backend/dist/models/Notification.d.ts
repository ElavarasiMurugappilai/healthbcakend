import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'medication' | 'appointment' | 'challenge' | 'measurement' | 'system' | 'fitness' | 'general';
    title: string;
    message: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification> & INotification & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Notification.d.ts.map