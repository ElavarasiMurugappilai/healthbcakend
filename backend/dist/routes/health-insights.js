"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const healthInsightsController_1 = require("../controllers/healthInsightsController");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/trends', healthInsightsController_1.getTrends);
router.get('/latest', healthInsightsController_1.getLatestValues);
router.get('/vitals', healthInsightsController_1.getVitalsSummary);
router.get('/wellness', healthInsightsController_1.getWellnessMetrics);
router.get('/insights', healthInsightsController_1.getHealthInsights);
exports.default = router;
//# sourceMappingURL=health-insights.js.map