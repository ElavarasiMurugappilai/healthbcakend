"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(uri) {
    try {
        await mongoose_1.default.connect(uri, {});
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map