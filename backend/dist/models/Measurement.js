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
const MeasurementSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    type: {
        type: String,
        required: [true, 'Measurement type is required'],
        enum: ['glucose', 'blood_pressure', 'heart_rate', 'weight', 'sleep', 'steps', 'water', 'exercise'],
        index: true
    },
    value: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Measurement value is required']
    },
    unit: {
        type: String,
        trim: true
    },
    timestamp: {
        type: Date,
        required: [true, 'Timestamp is required'],
        index: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    source: {
        type: String,
        enum: ['manual', 'device', 'app'],
        default: 'manual'
    },
    metadata: {
        systolic: Number,
        diastolic: Number,
        duration: Number,
        quality: String,
        type: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
MeasurementSchema.index({ userId: 1, type: 1, timestamp: -1 });
MeasurementSchema.index({ userId: 1, timestamp: -1 });
MeasurementSchema.index({ type: 1, timestamp: -1 });
MeasurementSchema.pre('save', function (next) {
    const measurement = this;
    if (measurement.type === 'blood_pressure') {
        if (!measurement.metadata?.systolic || !measurement.metadata?.diastolic) {
            return next(new Error('Blood pressure measurements require systolic and diastolic values'));
        }
        if (measurement.metadata.systolic < 50 || measurement.metadata.systolic > 300) {
            return next(new Error('Invalid systolic pressure value'));
        }
        if (measurement.metadata.diastolic < 30 || measurement.metadata.diastolic > 200) {
            return next(new Error('Invalid diastolic pressure value'));
        }
    }
    if (measurement.type === 'glucose') {
        const value = Number(measurement.value);
        if (isNaN(value) || value < 20 || value > 600) {
            return next(new Error('Invalid glucose value'));
        }
    }
    if (measurement.type === 'weight') {
        const value = Number(measurement.value);
        if (isNaN(value) || value < 20 || value > 1000) {
            return next(new Error('Invalid weight value'));
        }
    }
    if (measurement.type === 'heart_rate') {
        const value = Number(measurement.value);
        if (isNaN(value) || value < 30 || value > 300) {
            return next(new Error('Invalid heart rate value'));
        }
    }
    next();
});
MeasurementSchema.statics.getByDateRange = function (userId, type, startDate, endDate, limit = 100) {
    const query = {
        userId,
        timestamp: { $gte: startDate, $lte: endDate }
    };
    if (type) {
        query.type = type;
    }
    return this.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
};
MeasurementSchema.statics.getLatestByType = function (userId, types) {
    return this.aggregate([
        { $match: { userId, type: { $in: types } } },
        { $sort: { timestamp: -1 } },
        {
            $group: {
                _id: '$type',
                latest: { $first: '$$ROOT' }
            }
        },
        { $replaceRoot: { newRoot: '$latest' } }
    ]);
};
exports.default = mongoose_1.default.model('Measurement', MeasurementSchema);
//# sourceMappingURL=Measurement.js.map