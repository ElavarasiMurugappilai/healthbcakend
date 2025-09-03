"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getChallengeStats = exports.leaveChallenge = exports.getUserChallenges = exports.updateChallengeProgress = exports.joinChallenge = exports.getChallenges = void 0;
const Challenge_1 = require("../models/Challenge");
const getChallenges = async (req, res) => {
    try {
        const { type, difficulty, isActive = true, limit = 50, page = 1 } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (difficulty)
            query.difficulty = difficulty;
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const challenges = await Challenge_1.Challenge.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);
        const total = await Challenge_1.Challenge.countDocuments(query);
        res.json({
            success: true,
            data: challenges,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenges',
            error: error.message
        });
    }
};
exports.getChallenges = getChallenges;
const joinChallenge = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const existingUserChallenge = await Challenge_1.UserChallenge.findOne({
            userId,
            challengeId: id
        });
        if (existingUserChallenge) {
            return res.status(400).json({
                success: false,
                message: 'You have already joined this challenge'
            });
        }
        const challenge = await Challenge_1.Challenge.findById(id);
        if (!challenge || !challenge.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found or inactive'
            });
        }
        const userChallenge = new Challenge_1.UserChallenge({
            userId,
            challengeId: id,
            current: 0,
            status: 'active',
            joinedAt: new Date()
        });
        await userChallenge.save();
        await Challenge_1.Challenge.findByIdAndUpdate(id, {
            $inc: { participants: 1 }
        });
        await userChallenge.populate('challengeId');
        res.status(201).json({
            success: true,
            message: 'Successfully joined challenge',
            data: userChallenge
        });
    }
    catch (error) {
        console.error('Error joining challenge:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to join challenge',
            error: error.message
        });
    }
};
exports.joinChallenge = joinChallenge;
const updateChallengeProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { progress } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (typeof progress !== 'number' || progress < 0) {
            return res.status(400).json({
                success: false,
                message: 'Progress must be a non-negative number'
            });
        }
        const userChallenge = await Challenge_1.UserChallenge.findOne({
            userId,
            challengeId: id
        }).populate('challengeId');
        if (!userChallenge) {
            return res.status(404).json({
                success: false,
                message: 'You have not joined this challenge'
            });
        }
        if (userChallenge.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Challenge is not active'
            });
        }
        userChallenge.current = Math.min(progress, userChallenge.challengeId.target);
        userChallenge.lastUpdated = new Date();
        if (userChallenge.current >= userChallenge.challengeId.target) {
            userChallenge.status = 'completed';
            userChallenge.completedAt = new Date();
        }
        await userChallenge.save();
        res.json({
            success: true,
            message: 'Progress updated successfully',
            data: userChallenge
        });
    }
    catch (error) {
        console.error('Error updating challenge progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress',
            error: error.message
        });
    }
};
exports.updateChallengeProgress = updateChallengeProgress;
const getUserChallenges = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { status, limit = 50, page = 1 } = req.query;
        const query = { userId };
        if (status)
            query.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const userChallenges = await Challenge_1.UserChallenge.find(query)
            .populate('challengeId')
            .sort({ joinedAt: -1 })
            .limit(Number(limit))
            .skip(skip);
        const total = await Challenge_1.UserChallenge.countDocuments(query);
        res.json({
            success: true,
            data: userChallenges,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching user challenges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user challenges',
            error: error.message
        });
    }
};
exports.getUserChallenges = getUserChallenges;
const leaveChallenge = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userChallenge = await Challenge_1.UserChallenge.findOneAndDelete({
            userId,
            challengeId: id
        });
        if (!userChallenge) {
            return res.status(404).json({
                success: false,
                message: 'You have not joined this challenge'
            });
        }
        await Challenge_1.Challenge.findByIdAndUpdate(id, {
            $inc: { participants: -1 }
        });
        res.json({
            success: true,
            message: 'Successfully left challenge'
        });
    }
    catch (error) {
        console.error('Error leaving challenge:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to leave challenge',
            error: error.message
        });
    }
};
exports.leaveChallenge = leaveChallenge;
const getChallengeStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const stats = await Challenge_1.UserChallenge.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalPoints = await Challenge_1.UserChallenge.aggregate([
            {
                $match: {
                    userId: userId,
                    status: 'completed'
                }
            },
            {
                $lookup: {
                    from: 'challenges',
                    localField: 'challengeId',
                    foreignField: '_id',
                    as: 'challenge'
                }
            },
            {
                $unwind: '$challenge'
            },
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: '$challenge.points' }
                }
            }
        ]);
        res.json({
            success: true,
            data: {
                statusBreakdown: stats,
                totalPoints: totalPoints.length > 0 ? totalPoints[0].totalPoints : 0
            }
        });
    }
    catch (error) {
        console.error('Error fetching challenge stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenge statistics',
            error: error.message
        });
    }
};
exports.getChallengeStats = getChallengeStats;
const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const leaderboard = await Challenge_1.UserChallenge.aggregate([
            {
                $match: {
                    status: 'completed'
                }
            },
            {
                $lookup: {
                    from: 'challenges',
                    localField: 'challengeId',
                    foreignField: '_id',
                    as: 'challenge'
                }
            },
            {
                $unwind: '$challenge'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $group: {
                    _id: '$userId',
                    name: { $first: '$user.name' },
                    email: { $first: '$user.email' },
                    totalPoints: { $sum: '$challenge.points' },
                    challengesCompleted: { $sum: 1 },
                    lastActivity: { $max: '$completedAt' }
                }
            },
            {
                $sort: { totalPoints: -1, challengesCompleted: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            },
            {
                $addFields: {
                    rank: { $add: [skip, { $indexOfArray: [{ $range: [0, Number(limit)] }, { $subtract: [{ $indexOfArray: [[], null] }, skip] }] }] }
                }
            }
        ]);
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: skip + index + 1,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`
        }));
        res.json({
            success: true,
            data: rankedLeaderboard,
            pagination: {
                page: Number(page),
                limit: Number(limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
};
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=challengeController.js.map