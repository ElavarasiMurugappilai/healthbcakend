"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/:doctorId/messages", auth_1.authenticateToken, chatController_1.getChatMessages);
router.post("/:doctorId/send", auth_1.authenticateToken, chatController_1.sendMessage);
router.post("/:doctorId/suggest-medication", auth_1.authenticateToken, chatController_1.suggestMedication);
router.post("/medication-suggestions/:suggestionId/respond", auth_1.authenticateToken, chatController_1.respondToMedicationSuggestion);
router.get("/medication-suggestions/pending", auth_1.authenticateToken, chatController_1.getPendingMedicationSuggestions);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map