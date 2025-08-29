import { Request, Response } from "express";
import FitnessGoal from "../models/FitnessGoal";
import FitnessLog from "../models/FitnessLog";

interface AuthRequest extends Request {
  user?: any;
}

// Create or update fitness goals from quiz data
export const createFitnessGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      primaryFitnessGoal,
      exerciseDaysPerWeek,
      preferredActivities,
      dailyStepGoal,
      exerciseDuration,
      workoutDifficulty,
      stepTracking
    } = req.body;

    // Calculate targets based on quiz responses
    const stepsTarget = stepTracking === 'yes' ? (dailyStepGoal?.[0] || 8000) : 8000;
    const workoutTarget = exerciseDaysPerWeek?.[0] || 3;
    
    // Calculate calories target based on fitness goal
    let caloriesTarget = 300;
    if (primaryFitnessGoal === 'lose_weight') caloriesTarget = 500;
    else if (primaryFitnessGoal === 'build_strength') caloriesTarget = 400;
    else if (primaryFitnessGoal === 'improve_endurance') caloriesTarget = 600;

    const goalData = {
      userId,
      stepsTarget,
      caloriesTarget,
      workoutTarget,
      waterTarget: 2000,
      primaryFitnessGoal: primaryFitnessGoal || 'general_fitness',
      exerciseDaysPerWeek: exerciseDaysPerWeek?.[0] || 3,
      preferredActivities: preferredActivities || [],
      exerciseDuration: exerciseDuration || '30min',
      workoutDifficulty: workoutDifficulty || 'beginner',
      weeklyStats: {
        totalSteps: 0,
        totalCalories: 0,
        totalWorkouts: 0,
        totalWater: 0,
        weekStartDate: new Date()
      }
    };

    const fitnessGoal = await FitnessGoal.findOneAndUpdate(
      { userId },
      goalData,
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: fitnessGoal,
      message: "Fitness goals created successfully"
    });
  } catch (error) {
    console.error("Error creating fitness goals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create fitness goals"
    });
  }
};

// Get user's fitness goals and progress
export const getFitnessGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    let fitnessGoal = await FitnessGoal.findOne({ userId });
    
    // Create default goals if none exist
    if (!fitnessGoal) {
      fitnessGoal = await FitnessGoal.create({
        userId,
        stepsTarget: 8000,
        caloriesTarget: 300,
        workoutTarget: 5,
        waterTarget: 2000,
        primaryFitnessGoal: 'general_fitness',
        exerciseDaysPerWeek: 3,
        preferredActivities: [],
        exerciseDuration: '30min',
        workoutDifficulty: 'beginner',
        weeklyStats: {
          totalSteps: 0,
          totalCalories: 0,
          totalWorkouts: 0,
          totalWater: 0,
          weekStartDate: new Date()
        }
      });
    }

    // Calculate weekly progress and insights
    const weekStart = getWeekStart(new Date());
    const weeklyLogs = await FitnessLog.find({
      userId,
      date: { $gte: weekStart }
    });

    // Update weekly stats
    const weeklyStats = weeklyLogs.reduce((acc, log) => ({
      totalSteps: acc.totalSteps + log.steps,
      totalCalories: acc.totalCalories + log.calories,
      totalWorkouts: acc.totalWorkouts + (log.workoutMinutes > 0 ? 1 : 0),
      totalWater: acc.totalWater + log.waterIntake
    }), { totalSteps: 0, totalCalories: 0, totalWorkouts: 0, totalWater: 0 });

    // Update progress with today's data
    const today = new Date().toISOString().split('T')[0];
    const todayLog = await FitnessLog.findOne({
      userId,
      date: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59') }
    });

    if (todayLog) {
      fitnessGoal.progress = {
        steps: todayLog.steps,
        calories: todayLog.calories,
        workout: weeklyStats.totalWorkouts,
        water: todayLog.waterIntake
      };
    }

    fitnessGoal.weeklyStats = {
      ...weeklyStats,
      weekStartDate: weekStart
    };

    await fitnessGoal.save();

    // Generate personalized insights
    const insights = generateInsights(fitnessGoal, weeklyStats);

    res.status(200).json({
      success: true,
      data: {
        ...fitnessGoal.toObject(),
        insights
      }
    });
  } catch (error) {
    console.error("Error fetching fitness goals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fitness goals"
    });
  }
};

// Log fitness activity
export const logFitnessActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { steps, calories, workoutMinutes, waterIntake, workoutType, notes } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fitnessLog = await FitnessLog.findOneAndUpdate(
      { userId, date: today },
      {
        $inc: {
          steps: steps || 0,
          calories: calories || 0,
          workoutMinutes: workoutMinutes || 0,
          waterIntake: waterIntake || 0
        },
        ...(workoutType && { workoutType }),
        ...(notes && { notes })
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: fitnessLog,
      message: "Activity logged successfully"
    });
  } catch (error) {
    console.error("Error logging fitness activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log activity"
    });
  }
};

// Update fitness progress
export const updateFitnessProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const progressUpdate = req.body;

    const fitnessGoal = await FitnessGoal.findOneAndUpdate(
      { userId },
      { $set: { progress: progressUpdate } },
      { new: true }
    );

    if (!fitnessGoal) {
      return res.status(404).json({
        success: false,
        message: "Fitness goals not found"
      });
    }

    res.status(200).json({
      success: true,
      data: fitnessGoal
    });
  } catch (error) {
    console.error("Error updating fitness progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress"
    });
  }
};

// Helper functions
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function generateInsights(goal: any, weeklyStats: any) {
  const insights = [];
  
  // Weekly workout progress
  const workoutProgress = Math.round((weeklyStats.totalWorkouts / goal.workoutTarget) * 100);
  if (workoutProgress >= 100) {
    insights.push("🎉 Amazing! You've completed all your weekly workouts!");
  } else if (workoutProgress >= 75) {
    insights.push(`🔥 You reached ${workoutProgress}% of your weekly activity goal!`);
  } else if (workoutProgress >= 50) {
    insights.push(`💪 You're halfway there! ${workoutProgress}% of weekly goal completed.`);
  } else {
    insights.push(`🚀 Let's get moving! You're at ${workoutProgress}% of your weekly goal.`);
  }

  // Daily steps insight
  const stepProgress = Math.round((goal.progress.steps / goal.stepsTarget) * 100);
  if (stepProgress >= 100) {
    insights.push("👣 Step goal crushed today! Keep it up!");
  } else if (stepProgress >= 80) {
    insights.push(`👟 Almost there! ${goal.stepsTarget - goal.progress.steps} more steps to go.`);
  }

  // Water intake
  const waterProgress = Math.round((goal.progress.water / goal.waterTarget) * 100);
  if (waterProgress < 50) {
    insights.push("💧 Remember to stay hydrated! Drink more water today.");
  }

  // Personalized motivation based on fitness goal
  if (goal.primaryFitnessGoal === 'lose_weight' && weeklyStats.totalCalories > 0) {
    insights.push(`🔥 You've burned ${weeklyStats.totalCalories} calories this week!`);
  } else if (goal.primaryFitnessGoal === 'build_strength' && weeklyStats.totalWorkouts > 0) {
    insights.push(`💪 ${weeklyStats.totalWorkouts} strength sessions completed this week!`);
  }

  return insights;
}
