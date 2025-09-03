"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const healthMetricController_1 = require("../controllers/healthMetricController");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/metrics', healthMetricController_1.getHealthMetrics);
router.post('/metrics', healthMetricController_1.addHealthMetric);
router.get('/metrics/latest', healthMetricController_1.getLatestMetrics);
router.put('/metrics/:id', healthMetricController_1.updateHealthMetric);
router.delete('/metrics/:id', healthMetricController_1.deleteHealthMetric);
router.get('/trends', healthMetricController_1.getHealthTrends);
router.get('/insights', healthMetricController_1.getHealthInsights);
router.patch('/insights/:id/read', healthMetricController_1.markInsightAsRead);
exports.default = router;
//# sourceMappingURL=healthMetrics.js.map