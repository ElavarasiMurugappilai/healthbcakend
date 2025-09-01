"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fitnessGoalController_1 = require("../controllers/fitnessGoalController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticateToken, fitnessGoalController_1.getGoals);
router.post("/", auth_1.authenticateToken, fitnessGoalController_1.upsertTargets);
router.patch("/progress", auth_1.authenticateToken, fitnessGoalController_1.updateProgress);
exports.default = router;
//# sourceMappingURL=fitnessGoalRoutes.js.map