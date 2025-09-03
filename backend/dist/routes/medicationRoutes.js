"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicationController_1 = require("../controllers/medicationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/suggest", auth_1.authenticateToken, medicationController_1.suggestMedication);
router.get("/user", auth_1.authenticateToken, medicationController_1.getUserMedications);
router.get("/pending", auth_1.authenticateToken, medicationController_1.getPendingMedications);
router.get("/history", auth_1.authenticateToken, medicationController_1.getMedicationHistory);
router.get("/today", auth_1.authenticateToken, medicationController_1.getTodaySchedule);
router.post("/update-status", auth_1.authenticateToken, medicationController_1.updateMedicationStatus);
router.post("/:id/taken", auth_1.authenticateToken, medicationController_1.markMedicationTaken);
router.post("/:id/missed", auth_1.authenticateToken, medicationController_1.markMedicationMissed);
exports.default = router;
//# sourceMappingURL=medicationRoutes.js.map