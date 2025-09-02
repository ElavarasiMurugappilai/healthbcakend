"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicationSuggestionController_1 = require("../controllers/medicationSuggestionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/suggest", auth_1.authenticateToken, medicationSuggestionController_1.suggestMedication);
router.get("/suggestions", auth_1.authenticateToken, medicationSuggestionController_1.getMedicationSuggestions);
router.post("/accept", auth_1.authenticateToken, medicationSuggestionController_1.acceptMedicationSuggestion);
router.get("/schedule", auth_1.authenticateToken, medicationSuggestionController_1.getMedicationSchedule);
exports.default = router;
//# sourceMappingURL=medicationSuggestionRoutes.js.map