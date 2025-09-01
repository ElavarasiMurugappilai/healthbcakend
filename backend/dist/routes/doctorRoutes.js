"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctorController_1 = require("../controllers/doctorController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/system", auth_1.authenticateToken, doctorController_1.getSystemDoctors);
router.post("/careteam/add", auth_1.authenticateToken, doctorController_1.addToCareTeam);
router.get("/careteam", auth_1.authenticateToken, doctorController_1.getCareTeam);
router.get("/suggestions", auth_1.authenticateToken, doctorController_1.getSuggestedDoctors);
router.post("/suggestions/respond", auth_1.authenticateToken, doctorController_1.respondToSuggestion);
router.post("/suggestions/create", auth_1.authenticateToken, doctorController_1.createDoctorSuggestions);
exports.default = router;
//# sourceMappingURL=doctorRoutes.js.map