"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AppointmentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 30,
        min: 15,
        max: 120
    },
    type: {
        type: String,
        enum: ['consultation', 'follow-up', 'check-up', 'emergency', 'other'],
        default: 'consultation'
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled', 'no-show'],
        default: 'upcoming',
        index: true
    },
    location: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
AppointmentSchema.index({ userId: 1, date: 1 });
AppointmentSchema.index({ userId: 1, status: 1 });
AppointmentSchema.index({ date: 1, status: 1 });
AppointmentSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0];
});
AppointmentSchema.virtual('fullDateTime').get(function () {
    return `${this.date.toISOString().split('T')[0]} ${this.time}`;
});
exports.default = mongoose_1.default.model('Appointment', AppointmentSchema);
//# sourceMappingURL=Appointment.js.map