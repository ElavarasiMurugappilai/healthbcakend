import mongoose, { Schema, Document } from "mongoose";
export interface IDoctor extends Document {
    name: string;
    specialization: string;
    photo?: string;
    rating?: number;
    experience?: number;
    isSystemDoctor: boolean;
    addedBy?: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IDoctor, {}, {}, {}, mongoose.Document<unknown, {}, IDoctor> & IDoctor & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Doctor.d.ts.map