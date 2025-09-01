import mongoose, { Schema, Document } from "mongoose";
export interface IChatMessage extends Document {
    userId: Schema.Types.ObjectId;
    doctorId: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;
    senderType: 'user' | 'doctor';
    message: string;
    messageType: 'text' | 'medication_suggestion';
    medicationSuggestionId?: Schema.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IChatMessage, {}, {}, {}, mongoose.Document<unknown, {}, IChatMessage> & IChatMessage & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=ChatMessage.d.ts.map