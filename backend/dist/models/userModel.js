"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Non-binary", "Prefer not to say", "Other"] },
    conditions: [{ type: String }],
    goals: [{ type: String }],
    primaryGoal: { type: String },
    notes: { type: String },
    consent: { type: Boolean, default: false },
    profilePhoto: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=userModel.js.map