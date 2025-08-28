import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import API from "@/api";
import type { FitnessGoal } from "@/types/fitness";
import { toast } from "sonner";

interface FitnessProps {
  setShowFitnessModal: (show: boolean) => void;
  isFullWidth?: boolean;
}

const Fitness: React.FC<FitnessProps> = ({ setShowFitnessModal, isFullWidth = false }) => {
  // Animation state
  const [progress, setProgress] = useState(0);
  const totalLength = 251; // Circumference for r=40

  const [showModal, setShowModal] = useState(false);
  const [goal, setGoal] = useState<FitnessGoal | null>(null);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className={`${isFullWidth ? 'w-full' : 'flex-1 lg:flex-1'} min-w-0 mb-2 lg:mb-0`}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate progress percentage based on completed workouts
  const progressPercentage = useMemo(() => {
    if (!goal) return 0;
    return Math.round(((goal.progress?.workout ?? 0) / (goal.workoutTarget || 1)) * 100);
  }, [goal]);

  // Fetch goals on mount
  useEffect(() => {
    let isMounted = true;
    const fetchGoals = async () => {
      try {
        const res = await API.get<FitnessGoal>("/goals");
        if (!isMounted) return;
        setGoal(res.data);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load fitness goals");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchGoals();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // Animate progress to the calculated percentage
    let current = progress;
    const target = progressPercentage;
    let animationId: NodeJS.Timeout;
    
    const step = () => {
      if (current < target) {
        current += 1;
        setProgress(current);
        animationId = setTimeout(step, 12); // Animation speed
      }
    };
    
    // Only animate if target is different from current progress
    if (target !== progress) {
      step();
    }
    
    return () => {
      if (animationId) clearTimeout(animationId);
    };
  }, [progressPercentage, progress]);

  // Update progress helper
  const updateProgress = async (partial: Partial<FitnessGoal["progress"]>) => {
    try {
      const res = await API.patch("/goals/progress", partial);
      setGoal(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Unable to update progress");
    }
  };

  const handleWorkoutComplete = async () => {
    if (!goal) return;
    const newWorkoutCount = (goal.progress?.workout ?? 0) + 1;
    await updateProgress({ workout: newWorkoutCount });
    toast.success('Workout marked as complete! 🎉');
  };
  
  return (
    <div className={`${isFullWidth ? 'w-full' : 'flex-1 lg:flex-1'} min-w-0 mb-2 lg:mb-0`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >

      <Card
        className="w-full h-80 bg-gradient-to-r from-indigo-950 to-[#1a2a5a] text-white cursor-pointer shadow-2xl hover:-translate-y-1 transition-all duration-200 border border-gray-200 dark:border-zinc-800 hover:shadow-3xl"
        onClick={() => setShowFitnessModal(true)}
      >
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Fitness Goals</CardTitle>
          <Button
            variant="link"
            className="text-xs p-0 text-white"
            onClick={e => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className={`relative ${isFullWidth ? 'w-40 h-40' : 'w-32 h-32'}`}>
            {/* Background and animated progress ring */}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <defs>
                {/* Circular Glow Filter */}
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#1e293b"
                strokeWidth="8"
                fill="none"
              />
              
              {/* Glow layer - follows the progress exactly */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#00eaff"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(progress / 100) * totalLength} ${totalLength}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ 
                  transition: "stroke-dasharray 0.2s linear",
                  filter: "blur(3px)",
                  opacity: 0.6
                }}
              />
              
              {/* Main progress ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#00eaff"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(progress / 100) * totalLength} ${totalLength}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.2s linear" }}
              />
            </svg>

            {/* Animated percentage */}
            <div
              className={`absolute inset-0 flex items-center justify-center text-white font-bold ${
                isFullWidth ? 'text-2xl' : 'text-xl'
              }`}
              style={{
                textShadow: "0 0 8pxrgb(216, 252, 255), 0 0 16px #00eaff, 0 0 32px #00eaff"
              }}
            >
              {progress}%
            </div>
          </div>

          <Button
            className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            onClick={e => {
              e.stopPropagation();
              if (!goal || (goal.progress?.workout ?? 0) < (goal.workoutTarget || 5)) {
                handleWorkoutComplete();
                
                // If modal is open, close and reopen it to show updated state
                if (showModal) {
                  setShowModal(false);
                  setTimeout(() => setShowModal(true), 100);
                }
              }
            }}
          >
            Complete {goal?.workoutTarget ?? 5} Workouts ({goal?.progress?.workout ?? 0}/{goal?.workoutTarget ?? 5})
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent key={`fitness-modal-${goal?.progress?.workout ?? 0}`} className="sm:max-w-md bg-white dark:bg-gray-800 border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Fitness Progress
                </DialogTitle>
                <div className="text-center text-gray-600 dark:text-gray-400 mt-2">
                  {(goal?.progress?.workout ?? 0) >= (goal?.workoutTarget ?? 5) ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      🎉 Congratulations! You've completed all {goal?.workoutTarget ?? 5} workouts this week!
                    </span>
                  ) : (
                    <span>
                      You have completed <span className="font-bold text-indigo-600 dark:text-indigo-400">{goal?.progress?.workout ?? 0} out of {goal?.workoutTarget ?? 5} workouts</span> this week! Keep it up!
                    </span>
                  )}
                </div>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Calories Burned</span>
                    </div>
                    <span className="font-bold text-lg text-red-600 dark:text-red-400">{goal?.progress?.calories ?? 0} / {goal?.caloriesTarget ?? 500} kcal</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👣</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Steps</span>
                    </div>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{goal?.progress?.steps ?? 0} / {goal?.stepsTarget ?? 8000}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏱️</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Active Minutes</span>
                    </div>
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">{goal?.progress?.workout ?? 0} / {goal?.workoutTarget ?? 30} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💧</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Water Intake</span>
                    </div>
                    <span className="font-bold text-lg text-purple-600 dark:text-purple-400">{goal?.progress?.water ?? 0} / {goal?.waterTarget ?? 2000} ml</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏋️</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Workouts Completed</span>
                    </div>
                    <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{goal?.progress?.workout ?? 0}/{goal?.workoutTarget ?? 5}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Weekly Goal</span>
                    </div>
                    <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{goal?.workoutTarget ?? 5} Workouts</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowModal(false)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
);
};

export default Fitness;
