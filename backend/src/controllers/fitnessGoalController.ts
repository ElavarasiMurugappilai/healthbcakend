import { Request, Response } from "express";
import FitnessGoal from "../models/FitnessGoal";
import "../types/express"; // Extends Request with userId

export const getGoals = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  
  const doc = await FitnessGoal.findOne({ userId: req.user.id });
  if (!doc) {
    // return defaults (not an error) so UI can render and user can "Edit"
    const created = await FitnessGoal.create({ userId: req.user.id });
    return res.json(created);
  }
  res.json(doc);
};

export const upsertTargets = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  
  const { stepsTarget, caloriesTarget, workoutTarget, waterTarget } = req.body;
  const updated = await FitnessGoal.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { stepsTarget, caloriesTarget, workoutTarget, waterTarget } },
    { new: true, upsert: true }
  );
  res.json(updated);
};

export const updateProgress = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  
  // pass any subset of progress fields; only those will update
  const { steps, calories, workout, water } = req.body;
  const sets: Record<string, number> = {};
  if (typeof steps === "number") sets["progress.steps"] = steps;
  if (typeof calories === "number") sets["progress.calories"] = calories;
  if (typeof workout === "number") sets["progress.workout"] = workout;
  if (typeof water === "number") sets["progress.water"] = water;

  const updated = await FitnessGoal.findOneAndUpdate(
    { userId: req.user.id },
    { $set: sets },
    { new: true, upsert: true }
  );
  res.json(updated);
};
