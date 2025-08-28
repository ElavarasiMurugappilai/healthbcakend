// src/types/fitness.ts
export type FitnessGoal = {
    _id: string;
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
  };
  