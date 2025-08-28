"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fitnessGoalController_1 = require("../controllers/fitnessGoalController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, fitnessGoalController_1.getGoals);
router.post("/", authMiddleware_1.default, fitnessGoalController_1.upsertTargets);
router.patch("/progress", authMiddleware_1.default, fitnessGoalController_1.updateProgress);
exports.default = router;
//# sourceMappingURL=fitnessGoalRoutes.js.map