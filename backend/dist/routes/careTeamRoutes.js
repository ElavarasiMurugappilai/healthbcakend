"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const careTeamController_1 = require("../controllers/careTeamController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/suggested-doctors", auth_1.authenticateToken, careTeamController_1.getSuggestedDoctors);
router.post("/add-doctor", auth_1.authenticateToken, careTeamController_1.addDoctorToCareTeam);
router.get("/", auth_1.authenticateToken, careTeamController_1.getMyCareTeam);
exports.default = router;
//# sourceMappingURL=careTeamRoutes.js.map