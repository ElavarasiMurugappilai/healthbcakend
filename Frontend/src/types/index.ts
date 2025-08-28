// Frontend/src/types/index.ts - Comprehensive TypeScript definitions

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  conditions?: string[];
  goals?: string[];
  avatar?: string;
  createdAt?: string;
}

// Profile types
export interface UserProfile {
  userId: string;
  age?: number | string;
  gender?: string;
  weight?: number | string;
  height?: number | string;
  conditions: string[];
  allergies?: string;
  smoker?: boolean;
  alcohol?: string;
  sleepHours: number[];
  exercise?: string;
  exerciseTypes: string[];
  exerciseDuration: number[];
  fitnessGoals?: string;
  waterIntake: number[];
  stepGoal: number[];
  trackGlucose?: boolean;
  trackBP?: boolean;
  trackHR?: boolean;
  trackSleep?: boolean;
  trackWeight?: boolean;
  units: {
    weight?: string;
    glucose?: string;
    height?: string;
  };
  takeMeds?: boolean;
  prescriptionFile?: string | null;
  medicationReminders?: boolean;
  joinChallenges?: boolean;
  notificationsEnabled?: boolean;
  medications?: Array<{
    name: string;
    qty: string;
    dosage: string;
    status: "Missed" | "Taken" | "Upcoming";
    time: string;
  }>;
  careTeam?: Array<{
    name: string;
    role: string;
    img?: string;
    badge?: number;
    unread?: boolean;
    messages?: string[];
  }>;
}

// Quiz form data types
export interface QuizFormData {
  age: string;
  gender: string;
  weight: string;
  height: string;
  conditions: string[];
  allergies: string;
  smoker: boolean;
  alcohol: string;
  sleepHours: number[];
  exercise: string;
  exerciseTypes: string[];
  exerciseDuration: number[];
  fitnessGoals: string;
  waterIntake: number[];
  stepGoal: number[];
  trackGlucose: boolean;
  trackBP: boolean;
  trackHR: boolean;
  trackSleep: boolean;
  trackWeight: boolean;
  units: { weight: string; glucose: string; height: string };
  takeMeds: boolean;
  prescriptionFile: File | null;
  medicationReminders: boolean;
  joinChallenges: boolean;
  notificationsEnabled: boolean;
}

// API Error types
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  profile?: UserProfile;
  user?: User;
}

// Auth verification response
export interface AuthVerificationResponse {
  valid: boolean;
  needsRefresh?: boolean;
  user?: User;
}

// Form update function type - matches what step components expect
export type FormUpdateFunction = (key: string, value: unknown) => void;

// Condition and exercise type toggle functions
export type ConditionToggleFunction = (condition: string) => void;
export type ExerciseTypeToggleFunction = (type: string) => void;

// Quiz step component props
export interface QuizStepProps {
  formData: QuizFormData;
  updateFormData: FormUpdateFunction;
  handleConditionToggle: ConditionToggleFunction;
  handleExerciseTypeToggle: ExerciseTypeToggleFunction;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

// Quiz storage keys
export interface QuizStorageKeys {
  data: string;
  completedAt: string;
  pending: string;
}
