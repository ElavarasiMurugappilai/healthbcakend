import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getChallenges,
  joinChallenge,
  updateChallengeProgress,
  getUserChallenges,
  leaveChallenge,
  getChallengeStats,
  getLeaderboard
} from '../controllers/challengeController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all challenges
router.get('/', getChallenges);

// Join a challenge
router.post('/join/:id', joinChallenge);

// Update challenge progress
router.patch('/progress/:id', updateChallengeProgress);

// Get user's joined challenges
router.get('/my', getUserChallenges);

// Leave a challenge
router.delete('/leave/:id', leaveChallenge);

// Get challenge statistics
router.get('/stats', getChallengeStats);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;