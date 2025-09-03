"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const medicationController_1 = require("../controllers/medicationController");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/user', medicationController_1.getUserMedications);
router.post('/schedule', medicationController_1.addMedicationSchedule);
router.patch('/schedule/:id', medicationController_1.updateMedicationSchedule);
router.get('/history', medicationController_1.getMedicationHistory);
router.get('/today', medicationController_1.getTodaySchedule);
router.patch('/:id/taken', medicationController_1.markMedicationTaken);
router.patch('/:id/missed', medicationController_1.markMedicationMissed);
router.get('/pending', medicationController_1.getPendingMedications);
exports.default = router;
//# sourceMappingURL=medications.js.map