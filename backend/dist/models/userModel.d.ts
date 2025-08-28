import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    conditions: string[];
    goals: string[];
    consent: boolean;
    age?: number | undefined;
    gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other" | undefined;
    primaryGoal?: string | undefined;
    notes?: string | undefined;
    profilePhoto?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    conditions: string[];
    goals: string[];
    consent: boolean;
    age?: number | undefined;
    gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other" | undefined;
    primaryGoal?: string | undefined;
    notes?: string | undefined;
    profilePhoto?: string | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    conditions: string[];
    goals: string[];
    consent: boolean;
    age?: number | undefined;
    gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other" | undefined;
    primaryGoal?: string | undefined;
    notes?: string | undefined;
    profilePhoto?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    conditions: string[];
    goals: string[];
    consent: boolean;
    age?: number | undefined;
    gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other" | undefined;
    primaryGoal?: string | undefined;
    notes?: string | undefined;
    profilePhoto?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    conditions: string[];
    goals: string[];
    consent: boolean;
    age?: number | undefined;
    gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other" | undefined;
    primaryGoal?: string | undefined;
    notes?: string | undefined;
    profilePhoto?: string | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    conditions: string[];
    goals: string[];
    consent: boolean;
    age?: number | undefined;
    gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Other" | undefined;
    primaryGoal?: string | undefined;
    notes?: string | undefined;
    profilePhoto?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default _default;
//# sourceMappingURL=userModel.d.ts.map