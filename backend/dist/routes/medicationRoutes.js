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
router.post("/accept", auth_1.authenticateToken, medicationController_1.updateMedicationStatus);
router.get("/user", auth_1.authenticateToken, medicationController_1.getUserMedications);
router.get("/pending", auth_1.authenticateToken, medicationController_1.getPendingMedications);
exports.default = router;
//# sourceMappingURL=medicationRoutes.js.map