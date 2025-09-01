import mongoose, { Schema, Document } from "mongoose";
export interface ICareTeam extends Document {
    userId: Schema.Types.ObjectId;
    doctorId: Schema.Types.ObjectId;
    addedAt: Date;
    isActive: boolean;
}
declare const _default: mongoose.Model<ICareTeam, {}, {}, {}, mongoose.Document<unknown, {}, ICareTeam> & ICareTeam & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=CareTeam.d.ts.map