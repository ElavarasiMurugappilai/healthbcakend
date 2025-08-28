"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const healthQuestionnaireController_1 = require("../controllers/healthQuestionnaireController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protectLite, healthQuestionnaireController_1.submitQuestionnaire);
router.get('/', authMiddleware_1.protectLite, healthQuestionnaireController_1.getQuestionnaire);
exports.default = router;
//# sourceMappingURL=healthQuestionnaireRoutes.js.map