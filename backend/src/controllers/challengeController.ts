import { Request, Response } from 'express';
import { Challenge, UserChallenge } from '../models/Challenge';

type AuthRequest = Request;

// Get all challenges
export const getChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const { type, difficulty, isActive = true, limit = 50, page = 1 } = req.query;

    const query: any = {};
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const challenges = await Challenge.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Challenge.countDocuments(query);

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
  } catch (error: any) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message
    });
  }
};

// Join a challenge
export const joinChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user already joined this challenge
    const existingUserChallenge = await UserChallenge.findOne({
      userId,
      challengeId: id
    });

    if (existingUserChallenge) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this challenge'
      });
    }

    // Check if challenge exists and is active
    const challenge = await Challenge.findById(id);
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or inactive'
      });
    }

    // Create user challenge record
    const userChallenge = new UserChallenge({
      userId,
      challengeId: id,
      current: 0,
      status: 'active',
      joinedAt: new Date()
    });

    await userChallenge.save();

    // Update challenge participants count
    await Challenge.findByIdAndUpdate(id, {
      $inc: { participants: 1 }
    });

    // Populate challenge data
    await userChallenge.populate('challengeId');

    res.status(201).json({
      success: true,
      message: 'Successfully joined challenge',
      data: userChallenge
    });
  } catch (error: any) {
    console.error('Error joining challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join challenge',
      error: error.message
    });
  }
};

// Update challenge progress
export const updateChallengeProgress = async (req: AuthRequest, res: Response) => {
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

    const userChallenge = await UserChallenge.findOne({
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

    // Update progress
    userChallenge.current = Math.min(progress, (userChallenge.challengeId as any).target);
    userChallenge.lastUpdated = new Date();

    // Check if challenge is completed
    if (userChallenge.current >= (userChallenge.challengeId as any).target) {
      userChallenge.status = 'completed';
      userChallenge.completedAt = new Date();
    }

    await userChallenge.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: userChallenge
    });
  } catch (error: any) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

// Get user's joined challenges
export const getUserChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { status, limit = 50, page = 1 } = req.query;

    const query: any = { userId };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const userChallenges = await UserChallenge.find(query)
      .populate('challengeId')
      .sort({ joinedAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await UserChallenge.countDocuments(query);

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
  } catch (error: any) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user challenges',
      error: error.message
    });
  }
};

// Leave a challenge
export const leaveChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userChallenge = await UserChallenge.findOneAndDelete({
      userId,
      challengeId: id
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'You have not joined this challenge'
      });
    }

    // Update challenge participants count
    await Challenge.findByIdAndUpdate(id, {
      $inc: { participants: -1 }
    });

    res.json({
      success: true,
      message: 'Successfully left challenge'
    });
  } catch (error: any) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave challenge',
      error: error.message
    });
  }
};

// Get challenge statistics
export const getChallengeStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const stats = await UserChallenge.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalPoints = await UserChallenge.aggregate([
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
  } catch (error: any) {
    console.error('Error fetching challenge stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge statistics',
      error: error.message
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const leaderboard = await UserChallenge.aggregate([
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

    // Add rank manually since $addFields approach is complex
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
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
};