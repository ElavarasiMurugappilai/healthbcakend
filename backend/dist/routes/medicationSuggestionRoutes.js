"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicationSuggestionController_1 = require("../controllers/medicationSuggestionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protectLite, medicationSuggestionController_1.createSuggestion);
router.get('/user', authMiddleware_1.protectLite, medicationSuggestionController_1.getUserSuggestions);
router.post('/status', authMiddleware_1.protectLite, medicationSuggestionController_1.updateSuggestionStatus);
exports.default = router;
//# sourceMappingURL=medicationSuggestionRoutes.js.map