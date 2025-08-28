"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const profileController_1 = require("../controllers/profileController");
const router = (0, express_1.Router)();
router.post("/quiz", authMiddleware_1.protectLite, profileController_1.upsertQuiz);
router.get("/me", authMiddleware_1.protectLite, profileController_1.getMyProfile);
exports.default = router;
//# sourceMappingURL=profile.js.map