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
const HealthMetricSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['weight', 'blood_pressure', 'glucose', 'heart_rate', 'temperature', 'oxygen_saturation'],
        required: true,
        index: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    secondaryValue: {
        type: Number,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    recordedAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    source: {
        type: String,
        enum: ['manual', 'device', 'app'],
        default: 'manual'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
HealthMetricSchema.index({ userId: 1, type: 1, recordedAt: -1 });
HealthMetricSchema.index({ userId: 1, recordedAt: -1 });
HealthMetricSchema.virtual('formattedValue').get(function () {
    if (this.secondaryValue) {
        return `${this.value}/${this.secondaryValue} ${this.unit}`;
    }
    return `${this.value} ${this.unit}`;
});
exports.default = mongoose_1.default.model('HealthMetric', HealthMetricSchema);
//# sourceMappingURL=HealthMetric.js.map