"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.upsertTargets = exports.getGoals = void 0;
const FitnessGoal_1 = __importDefault(require("../models/FitnessGoal"));
require("../types/express");
const getGoals = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const doc = await FitnessGoal_1.default.findOne({ userId: req.user.id });
    if (!doc) {
        const created = await FitnessGoal_1.default.create({ userId: req.user.id });
        return res.json(created);
    }
    res.json(doc);
};
exports.getGoals = getGoals;
const upsertTargets = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const { stepsTarget, caloriesTarget, workoutTarget, waterTarget } = req.body;
    const updated = await FitnessGoal_1.default.findOneAndUpdate({ userId: req.user.id }, { $set: { stepsTarget, caloriesTarget, workoutTarget, waterTarget } }, { new: true, upsert: true });
    res.json(updated);
};
exports.upsertTargets = upsertTargets;
const updateProgress = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const { steps, calories, workout, water } = req.body;
    const sets = {};
    if (typeof steps === "number")
        sets["progress.steps"] = steps;
    if (typeof calories === "number")
        sets["progress.calories"] = calories;
    if (typeof workout === "number")
        sets["progress.workout"] = workout;
    if (typeof water === "number")
        sets["progress.water"] = water;
    const updated = await FitnessGoal_1.default.findOneAndUpdate({ userId: req.user.id }, { $set: sets }, { new: true, upsert: true });
    res.json(updated);
};
exports.updateProgress = updateProgress;
//# sourceMappingURL=fitnessGoalController.js.map