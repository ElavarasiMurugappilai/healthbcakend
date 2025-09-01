"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const fitnessController_1 = require("../controllers/fitnessController");
const router = express_1.default.Router();
router.post("/goals", auth_1.authenticateToken, fitnessController_1.createFitnessGoals);
router.get("/goals", auth_1.authenticateToken, fitnessController_1.getFitnessGoals);
router.post("/log", auth_1.authenticateToken, fitnessController_1.logFitnessActivity);
router.post("/logs", auth_1.authenticateToken, fitnessController_1.logFitnessActivity);
router.get("/logs", auth_1.authenticateToken, async (req, res) => {
    try {
        const currentDate = new Date();
        const logs = [];
        const logsCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < logsCount; i++) {
            logs.push({
                id: i + 1,
                type: "workout",
                date: new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000).toISOString(),
                duration: 30 + (i * 15)
            });
        }
        res.json({
            success: true,
            logs: logs,
            targetWorkouts: 5
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.patch("/goals/progress", auth_1.authenticateToken, fitnessController_1.updateFitnessProgress);
exports.default = router;
//# sourceMappingURL=fitness.js.map