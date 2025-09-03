"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const challengeController_1 = require("../controllers/challengeController");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/', challengeController_1.getChallenges);
router.post('/join/:id', challengeController_1.joinChallenge);
router.patch('/progress/:id', challengeController_1.updateChallengeProgress);
router.get('/my', challengeController_1.getUserChallenges);
router.delete('/leave/:id', challengeController_1.leaveChallenge);
router.get('/stats', challengeController_1.getChallengeStats);
router.get('/leaderboard', challengeController_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=challenges.js.map