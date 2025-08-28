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
const HealthQuestionnaireSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    ageGroup: {
        type: String,
        enum: ["Below 18", "18-40", "41-60", "60+"],
        required: true
    },
    chronicConditions: {
        type: [String],
        enum: ["Diabetes", "Hypertension", "Asthma", "Thyroid disorder", "High Cholesterol", "None"],
        default: []
    },
    currentSymptoms: {
        type: [String],
        enum: [
            "Fever, body pain, sore throat",
            "Chest pain, breathlessness, cough",
            "Frequent urination, excessive thirst, fatigue",
            "Headache, dizziness, high BP readings",
            "Stomach pain, acidity, bloating",
            "Joint pain, stiffness, swelling",
            "Anxiety, stress, difficulty sleeping",
            "None"
        ],
        default: []
    },
    allergies: {
        type: [String],
        enum: ["Penicillin/antibiotics", "Painkillers (NSAIDs)", "Food allergy", "Dust/pollen", "None"],
        default: []
    },
    lifestyle: {
        type: String,
        enum: ["Sedentary", "Moderate activity", "Very active", "Irregular sleep/diet", "Smoker / Alcohol consumption"],
        required: true
    },
    familyHistory: {
        type: [String],
        enum: ["Heart disease", "Diabetes", "Asthma/Respiratory problems", "Thyroid", "None"],
        default: []
    },
    stressLevel: {
        type: String,
        enum: ["Low", "Moderate", "High"],
        required: true
    },
    sleepQuality: {
        type: String,
        enum: ["Good", "Disturbed / Irregular", "Insomnia"],
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("HealthQuestionnaire", HealthQuestionnaireSchema);
//# sourceMappingURL=HealthQuestionnaire.js.map