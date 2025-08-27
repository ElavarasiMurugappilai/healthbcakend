import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, Pill, Stethoscope, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ProfileStep from "@/components/steps/profile";
import FitnessStep from "@/components/steps/FitnessStep";
import HealthTrackingStep from "@/components/steps/HealthTrackingStep";
import MedicationsStep from "@/components/steps/MedicationsStep";
import PreferencesStep from "@/components/steps/PreferencesStep";
import ReviewStep from "@/components/steps/ReviewStep";

import HealthWheel from "@/components/steps/HealthWheel";
import API from "../api";

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Check authentication on component mount (do not auto-redirect)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      console.warn("No authentication found");
    } else {
      console.log("✅ User authenticated, proceeding with quiz");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    conditions: [] as string[],
    allergies: "",
    smoker: false,
    alcohol: "none",
    sleepHours: [8],

    exercise: "none",
    exerciseTypes: [] as string[],
    exerciseDuration: [30],
    fitnessGoals: "general_fitness",
    waterIntake: [2],
    stepGoal: [8000],

    trackGlucose: false,
    trackBP: false,
    trackHR: false,
    trackSleep: false,
    trackWeight: false,
    units: { weight: "kg", glucose: "mg/dL", height: "cm" },

    takeMeds: false,
    prescriptionFile: null,
    medicationReminders: true,

    joinChallenges: false,
    notificationsEnabled: true,
  });

  function updateFormData(key: string, value: unknown): void;
  function updateFormData<K extends typeof formData extends infer T ? keyof T : never>(
    key: K,
    value: (typeof formData)[K]
  ): void;
  function updateFormData(key: string, value: unknown): void {
    setFormData((prev) => ({ ...prev, [key]: value } as typeof formData));
  }

  // ✅ Fix for ProfileStep checkboxes
  const handleConditionToggle = (condition: string) => {
    setFormData((prev) => {
      const exists = prev.conditions.includes(condition);
      return {
        ...prev,
        conditions: exists
          ? prev.conditions.filter((c) => c !== condition)
          : [...prev.conditions, condition],
      };
    });
  };

  // ✅ Fix for FitnessStep checkboxes
  const handleExerciseTypeToggle = (type: string) => {
    setFormData((prev) => {
      const exists = prev.exerciseTypes.includes(type);
      return {
        ...prev,
        exerciseTypes: exists
          ? prev.exerciseTypes.filter((t) => t !== type)
          : [...prev.exerciseTypes, type],
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ✅ Debug: Check token and user data
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      console.log("🔍 Quiz Submission Debug Info:");
      console.log("- Token exists:", !!token);
      console.log("- User data exists:", !!userStr);
      console.log("- Form data:", formData);
  
      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }
  
      // ✅ Make API call with token in headers
      const res = await API.post("/profile/quiz", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Quiz submission successful:", { status: res.status, data: res.data });
  
      // Show success message
      toast.success("Profile setup completed successfully!", {
        duration: 2000,
      });
  
      // Save profile data
      if (res.data.profile) {
        localStorage.setItem("profile", JSON.stringify(res.data.profile));
      }
  
      // Update user data if returned
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
  
      // Notify app that user data changed
      window.dispatchEvent(new Event("user-updated"));
  
      // ✅ Navigate to dashboard immediately on success
      if (res.status >= 200 && res.status < 300) {
        navigate("/dashboard", { replace: true });
        return;
      }
  
    } catch (error: unknown) {
      type ApiError = { response?: { status?: number; data?: { message?: string } }; message?: string };
      const err = error as ApiError;
      console.error("❌ Quiz submission error:", err);
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
  
      if (status === 401) {
        console.warn("Authentication failed during quiz submission");
        toast.error("Authentication issue. Please login again, then retry.");
        return; // do not redirect away from quiz automatically
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const steps = [
    { title: "Personal Info", component: ProfileStep },
    { title: "Health Tracking", component: HealthTrackingStep },
    { title: "Fitness & Goals", component: FitnessStep },
    { title: "Preferences", component: PreferencesStep },
    { title: "Medications", component: MedicationsStep },
    { title: "Review", component: ReviewStep },
  ];

  const CurrentStep = steps[currentStep].component;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>

      {/* Floating Icons */}
      <Pill className="absolute top-1/4 left-1/4 w-16 h-16 text-orange-500/30 dark:text-blue-400/25 animate-float-slow" />
      <Stethoscope className="absolute top-1/3 right-1/4 w-20 h-20 text-pink-400/30 dark:text-purple-400/25 animate-float-fast" />
      <Heart className="absolute bottom-1/4 left-1/3 w-24 h-24 text-red-500/20 dark:text-red-400/20 animate-float-slow" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col md:flex-row">
        {/* Left */}
        <div className="flex flex-col justify-center items-center flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[currentStep].title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {steps[currentStep].title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fill in the details below
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Health Wheel */}
          <HealthWheel
            currentStep={currentStep}
            completedSteps={[]}
            onSliceClick={(i) => setCurrentStep(i)}
          />
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
          <Card className="w-full max-w-xl h-[550px] shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex flex-col">
            <CardContent className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <CurrentStep
                    formData={formData}
                    updateFormData={updateFormData}
                    handleConditionToggle={handleConditionToggle}
                    handleExerciseTypeToggle={handleExerciseTypeToggle}
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between w-full max-w-xl mt-6">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => p - 1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep((p) => p + 1)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Next
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? "Saving..." : "Complete Setup"}
                <Check size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;