// Frontend/src/pages/QuizPage.tsx - Final Bulletproof Version
import React, { useState, useEffect } from "react";
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
import type { QuizFormData, ApiError, ApiResponse, User, UserProfile } from "../types";

const QUIZ_KEYS = {
  data: "healthapp.quiz.data",
  completedAt: "healthapp.quiz.completedAt",
  pending: "healthapp.quiz.pending"
};

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authRetryCount, setAuthRetryCount] = useState(0);
  const [forceShow, setForceShow] = useState(false);

  const [formData, setFormData] = useState<QuizFormData>({
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

  // ✅ BULLETPROOF AUTH CHECK with cleanup
  useEffect(() => {
    let cancelled = false;

    const performAuthCheck = async () => {
      if (cancelled) return;

      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        console.log(`🔍 Quiz Auth Check (Attempt ${authRetryCount + 1}):`, {
          hasToken: !!token,
          hasUser: !!user,
          tokenLength: token?.length || 0,
          currentPath: window.location.pathname
        });

        if (!token || !user) {
          if (authRetryCount < 2) {
            console.log("⏳ No auth data, retrying...");
            setAuthRetryCount(prev => prev + 1);
            setTimeout(() => performAuthCheck(), 1000);
            return;
          } else {
            console.log("❌ No auth data after retries, redirecting");
            toast.error("Please log in to access the quiz");
            navigate("/login");
            return;
          }
        }

        let tokenValid = true;
        try {
          const verifyResponse = await API.get("/auth/verify");
          console.log("✅ Token verification successful:", verifyResponse.data);
          if (verifyResponse.data.needsRefresh) {
            console.log("⚠️ Token expiring soon, but allowing quiz to continue");
          }
        } catch (verifyError: unknown) {
          const error = verifyError as ApiError;
          console.log("⚠️ Token verification failed:", error.response?.status);
          if (error.response?.status === 401) {
            tokenValid = false;
          } else {
            console.log("🌐 Network/Server issue, allowing offline quiz");
            toast.info("Connection issues detected, continuing in quiz");
          }
        }

        if (!tokenValid) {
          if (authRetryCount < 1) {
            console.log("🔄 Token invalid, retry once...");
            setAuthRetryCount(prev => prev + 1);
            setTimeout(() => performAuthCheck(), 1500);
            return;
          } else {
            console.log("❌ Token invalid after retry");
            toast.error("Session expired. Please log in again.");
            navigate("/login");
            return;
          }
        }

        console.log("✅ Auth success, continue quiz");
        if (!cancelled) setAuthChecked(true);

      } catch (error) {
        console.error("❌ Auth check error:", error);
        if (authRetryCount >= 2 && !cancelled) {
          const continueAnyway = confirm(
            "Unable to verify your session. Would you like to:\n" +
            "- OK: Continue with quiz (data saved locally)\n" +
            "- Cancel: Go back to login"
          );
          if (continueAnyway) {
            setForceShow(true);
            setAuthChecked(true);
            toast.info("Continuing in offline mode");
          } else {
            navigate("/login");
          }
        } else {
          setAuthRetryCount(prev => prev + 1);
          setTimeout(() => performAuthCheck(), 2000);
        }
      }
    };

    performAuthCheck();
    return () => { cancelled = true; };
  }, [navigate, authRetryCount]);

  const updateFormData = (key: string, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

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

  // ✅ BULLETPROOF SUBMIT with offline save
  const handleSubmit = async () => {
    setLoading(true);

    try {
      console.log("🚀 Starting quiz submission...");
      try {
        const response = await API.post<ApiResponse<{ profile: UserProfile; user: User }>>("/profile/quiz", formData);
        console.log("✅ Quiz submitted:", response.data);

        if (response.data.profile) {
          localStorage.setItem("profile", JSON.stringify(response.data.profile));
          console.log("✅ Profile saved to localStorage:", response.data.profile);
        }
        if (response.data.user) {
          console.log("✅ User data received from backend:", response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("✅ User data saved to localStorage");
          window.dispatchEvent(new Event("user-updated"));
          console.log("✅ user-updated event dispatched");
        } else {
          console.log("⚠️ No user data in response");
        }

        toast.success("Profile setup completed! 🎉");
        setTimeout(() => navigate("/dashboard"), 1000);
        return;
      } catch (apiError: unknown) {
        const error = apiError as ApiError;
        console.log("⚠️ API submit failed:", error.response?.status);
        if (error.response?.status === 401) {
          const shouldReAuth = confirm(
            "Session expired. OK = log in again and save quiz\nCancel = save locally"
          );
          if (shouldReAuth) {
            localStorage.setItem(QUIZ_KEYS.pending, JSON.stringify(formData));
            localStorage.setItem("returnUrl", "/quiz");
            toast.info("Redirecting to login...");
            navigate("/login");
            return;
          }
        }
        // Save offline
        localStorage.setItem(QUIZ_KEYS.data, JSON.stringify(formData));
        localStorage.setItem(QUIZ_KEYS.completedAt, new Date().toISOString());
        toast.success("Quiz saved locally 🎉");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Submit failed:", error);
      localStorage.setItem(QUIZ_KEYS.data, JSON.stringify(formData));
      localStorage.setItem(QUIZ_KEYS.completedAt, new Date().toISOString());
      toast.error("Saved locally, unable to sync");
      if (confirm("Go to dashboard?")) navigate("/dashboard");
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

  if (!authChecked && !forceShow) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a]">
        <div className="text-center max-w-md p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Setting up your quiz...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {authRetryCount === 0 ? "Verifying your session..." :
             authRetryCount === 1 ? "Checking connection..." : "Almost ready..."}
          </p>
          {authRetryCount >= 2 && (
            <Button 
              onClick={() => { setForceShow(true); setAuthChecked(true); }}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Continue Anyway
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>

      {/* Floating Icons */}
      <Pill className="absolute top-1/4 left-1/4 w-16 h-16 text-orange-500/30 dark:text-blue-400/25 animate-float-slow" />
      <Stethoscope className="absolute top-1/3 right-1/4 w-20 h-20 text-pink-400/30 dark:text-purple-400/25 animate-float-fast" />
      <Heart className="absolute bottom-1/4 left-1/3 w-24 h-24 text-red-500/20 dark:text-red-400/20 animate-float-slow" />

      {forceShow && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg shadow-lg">
          ⚠️ Offline mode - Data will sync later
        </div>
      )}

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
              <p className="text-sm text-gray-600 dark:text-gray-400">Fill in the details below</p>
            </motion.div>
          </AnimatePresence>

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
              <ArrowLeft size={16} /> Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep((p) => p + 1)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>Complete Setup <Check size={16} /></>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
