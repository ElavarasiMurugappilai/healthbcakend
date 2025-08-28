// src/types/fitness.ts
export interface FitnessGoal {
  stepsTarget: number;
  caloriesTarget: number;
  workoutTarget: number;
  waterTarget: number;
  progress: {
    steps: number;
    calories: number;
    workout: number;
    water: number;
  };
}
