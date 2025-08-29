import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { ArrowRight, ArrowLeft, Check, Heart, Pill, Stethoscope, Droplets, Dumbbell, Activity, Zap, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Import essential step components only
import GreetingStep from "@/components/steps/GreetingStep";
import FitnessActivityStep from "@/components/steps/FitnessActivityStep";
import HealthTrackingStep from "@/components/steps/HealthTrackingStep";
import DashboardLayoutStep from "@/components/steps/DashboardLayoutStep";
import MedicationStep from "@/components/steps/MedicationStep";

import API from "../api";

interface DashboardQuizData {
  // Step 1: Personal Profile
  fullName: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto: File | null;
  dashboardPreference: string;

  // Step 2: Health Goals & Fitness
  primaryFitnessGoal: string;
  exerciseDaysPerWeek: number[];
  preferredActivities: string[];
  stepTracking: string;
  dailyStepGoal: number[];
  workoutSuggestions: string;
  workoutDifficulty: string;
  exerciseDuration: string;
  fitnessDevice: string;

  // Step 3: Health Tracking
  healthConditions: string[];
  trackGlucose: boolean;
  trackBloodPressure: boolean;
  dailyWaterGoal: number;
  waterReminders: string;
  vitalSignsFrequency: string;

  // Step 4: Dashboard Layout
  visibleWidgets: string[];
  careTeamEnabled: boolean;
  appointmentReminders: boolean;
  preferredLayout: string;
  notificationPreferences: string[];

  // Step 5: Medications
  takingMedications: string;
  medications: any[];
  medicationReminders: string;
  reminderAdvance: string;
  trackSideEffects: string;
  doctorMedicationSuggestions: string;
  pharmacyIntegration: string;
  medicationGoal: string;
}

const QUIZ_KEYS = {
  data: "healthapp.dashboard.quiz.data",
  completedAt: "healthapp.dashboard.quiz.completedAt",
  pending: "healthapp.dashboard.quiz.pending"
};

const EnhancedQuizPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState<DashboardQuizData>({
    // Step 1: Personal Profile
    fullName: "",
    dateOfBirth: "",
    gender: "",
    profilePhoto: null,
    dashboardPreference: "",

    // Step 2: Health Goals & Fitness
    primaryFitnessGoal: "",
    exerciseDaysPerWeek: [3],
    preferredActivities: [],
    stepTracking: "",
    dailyStepGoal: [8000],
    workoutSuggestions: "",
    workoutDifficulty: "",
    exerciseDuration: "",
    fitnessDevice: "",

    // Step 3: Health Tracking
    healthConditions: [],
    trackGlucose: false,
    trackBloodPressure: false,
    dailyWaterGoal: 8,
    waterReminders: "",
    vitalSignsFrequency: "",

    // Step 4: Dashboard Layout
    visibleWidgets: [],
    careTeamEnabled: false,
    appointmentReminders: false,
    preferredLayout: "",
    notificationPreferences: [],

    // Step 5: Medications
    takingMedications: "",
    medications: [],
    medicationReminders: "",
    reminderAdvance: "",
    trackSideEffects: "",
    doctorMedicationSuggestions: "",
    pharmacyIntegration: "",
    medicationGoal: ""
  });

  const steps = [
    {
      title: "Personal Profile",
      description: "Tell us about yourself",
      component: GreetingStep,
      color: "blue"
    },
    {
      title: "Health Goals",
      description: "Fitness & health tracking",
      component: FitnessActivityStep,
      color: "orange"
    },
    {
      title: "Health Tracking",
      description: "Conditions & monitoring",
      component: HealthTrackingStep,
      color: "red"
    },
    {
      title: "Dashboard Layout",
      description: "Customize your dashboard",
      component: DashboardLayoutStep,
      color: "purple"
    },
    {
      title: "Medications",
      description: "Medication management",
      component: MedicationStep,
      color: "green"
    }
  ];

  // Auth check on mount
  useEffect(() => {
    const performAuthCheck = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
          toast.error("Please log in to access the quiz");
          navigate("/login");
          return;
        }

        // Verify token
        const response = await API.get("/auth/verify");
        if (response.data.success) {
          setAuthChecked(true);
          // Load saved quiz data if exists
          const savedData = localStorage.getItem(QUIZ_KEYS.data);
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              setFormData({ ...formData, ...parsedData });
            } catch (error) {
              console.warn("Failed to parse saved quiz data");
            }
          }
        } else {
          throw new Error("Token verification failed");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Authentication failed. Please log in again.");
        navigate("/login");
      }
    };

    performAuthCheck();
  }, [navigate]);

  const updateFormData = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Save to localStorage for persistence
    localStorage.setItem(QUIZ_KEYS.data, JSON.stringify(newFormData));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save profile and dashboard preferences
      const profileResponse = await API.post("/profile/dashboard-quiz", formData);
      
      if (profileResponse.data.success) {
        // Create fitness goals based on quiz responses
        const fitnessResponse = await API.post("/fitness/goals", formData);
        
        if (fitnessResponse.data.success) {
          toast.success("Dashboard preferences and fitness goals saved successfully!");
          
          // Mark quiz as completed
          localStorage.setItem(QUIZ_KEYS.completedAt, new Date().toISOString());
          localStorage.removeItem(QUIZ_KEYS.pending);
          localStorage.removeItem(QUIZ_KEYS.data);
          
          // Navigate to dashboard
          navigate("/dashboard");
        } else {
          throw new Error("Failed to create fitness goals");
        }
      } else {
        throw new Error(profileResponse.data.message || "Failed to save quiz data");
      }
    } catch (error: any) {
      console.error("Quiz submission error:", error);
      toast.error(error.response?.data?.message || "Failed to save quiz data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <>
      <Toaster richColors />
      <div className="auth-page h-screen w-screen relative overflow-x-hidden overflow-y-auto scrollbar-hide bg-gray-100 dark:bg-[#252545]">

        {/* Full Screen Background - Consistent with login page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>
        
        {/* Floating Animated Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Icon 1 - Pill */}
          <div className="absolute top-1/4 left-1/4 text-orange-500/30 dark:text-orange-400/30 animate-float-slow">
            <Pill size={32} />
          </div>
          
          {/* Icon 2 - Stethoscope */}
          <div className="absolute top-1/3 right-1/4 text-blue-500/25 dark:text-blue-400/25 animate-float-medium">
            <Stethoscope size={28} />
          </div>
          
          {/* Icon 3 - Droplets */}
          <div className="absolute bottom-1/3 left-1/3 text-blue-600/35 dark:text-blue-500/35 animate-float-fast">
            <Droplets size={24} />
          </div>
          
          {/* Icon 4 - Dumbbell */}
          <div className="absolute top-1/2 left-1/6 text-green-500/30 dark:text-green-400/30 animate-float-slow">
            <Dumbbell size={26} />
          </div>
          
          {/* Icon 5 - Heart */}
          <div className="absolute bottom-1/4 right-1/6 text-red-500/35 dark:text-red-400/35 animate-float-medium">
            <Heart size={30} />
          </div>
          
          {/* Icon 6 - Activity */}
          <div className="absolute top-1/6 left-1/2 text-purple-500/30 dark:text-purple-400/30 animate-float-fast">
            <Activity size={22} />
          </div>
          
          {/* Icon 7 - Zap */}
          <div className="absolute bottom-1/6 left-1/5 text-yellow-500/40 dark:text-yellow-400/40 animate-float-slow">
            <Zap size={18} />
          </div>
          
          {/* Icon 8 - Star */}
          <div className="absolute top-1/6 right-1/3 text-blue-600/25 dark:text-blue-500/25 animate-float-medium">
            <Star size={20} />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 flex flex-col px-4 sm:px-6 lg:px-8 py-4">
          {/* Header */}
          <div className="text-center py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Customize Your{" "}
              <span className="text-orange-600 dark:text-orange-400">Health Dashboard</span> 🎯
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Help us personalize your experience with a few quick questions
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-4 max-w-4xl mx-auto w-full">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                    index === currentStep
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : index < currentStep
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check size={16} />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-current opacity-30" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step */}
          <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {steps[currentStep].title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {steps[currentStep].description}
                      </p>
                    </div>
                    
                    <CurrentStepComponent
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center max-w-4xl mx-auto w-full px-4 sm:px-0 py-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 h-10 sm:h-11"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {currentStep + 1} of {steps.length} steps
              </p>
            </div>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 h-10 sm:h-11"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span className="hidden sm:inline">Complete Setup</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 h-10 sm:h-11"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight size={16} />
              </Button>
            )}
          </div>

          {/* Save Progress Note */}
          <div className="text-center pb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your progress is automatically saved as you go
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedQuizPage;
