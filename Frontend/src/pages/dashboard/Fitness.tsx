import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import API from "@/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface FitnessProps {
  setShowFitnessModal: (show: boolean) => void;
  isFullWidth?: boolean;
}

const Fitness: React.FC<FitnessProps> = ({ setShowFitnessModal, isFullWidth = false }) => {
  const [progress, setProgress] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [targetWorkouts, setTargetWorkouts] = useState(5);
  const [loading, setLoading] = useState(true);
  const totalLength = 251; // Circumference for r=40

  // Fetch workout logs from backend
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      try {
        const response = await API.get("/fitness/logs");
        console.log("API Response:", response.data);
        const logs = response.data.logs || [];
        const target = response.data.targetWorkouts || 5;
        
        console.log("Logs count:", logs.length, "Target:", target);
        setCompletedWorkouts(logs.length);
        setTargetWorkouts(target);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch workout logs:", error);
        // Set some default values so card still shows
        setCompletedWorkouts(0);
        setTargetWorkouts(5);
        setLoading(false);
      }
    };
    
    fetchWorkoutLogs();
  }, []);

  // Calculate and animate progress
  useEffect(() => {
    const targetProgress = Math.round((completedWorkouts / targetWorkouts) * 100);
    
    let current = progress;
    const animateProgress = () => {
      if (current < targetProgress) {
        current += 1;
        setProgress(current);
        setTimeout(animateProgress, 12);
      }
    };
    
    if (targetProgress !== progress) {
      animateProgress();
    }
  }, [completedWorkouts, targetWorkouts, progress]);

  // Log new workout
  const handleLogWorkout = async () => {
    try {
      const response = await API.post("/fitness/logs", {
        type: "workout",
        date: new Date().toISOString(),
        duration: 30 // default duration
      });
      
      console.log("Workout logged:", response.data);
      
      // Immediately update local state
      setCompletedWorkouts(prev => prev + 1);
      
      // Also refetch data to ensure sync
      const refreshResponse = await API.get("/fitness/logs");
      const logs = refreshResponse.data.logs || [];
      setCompletedWorkouts(logs.length);
      
      toast.success("Workout logged! 🎉");
    } catch (error) {
      console.error("Failed to log workout:", error);
      toast.error("Failed to log workout");
    }
  };

  if (loading) {
    return (
      <div className={`${isFullWidth ? 'w-full' : 'flex-1 lg:flex-1'} min-w-0 mb-2 lg:mb-0`}>
        <Card className="w-full h-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
          <CardContent className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className={`${isFullWidth ? 'w-full' : 'flex-1 lg:flex-1'} min-w-0 mb-2 lg:mb-0`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          className="w-full h-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
          onClick={() => setShowFitnessModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Fitness Goals</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs p-2 text-white hover:bg-white/20"
                onClick={e => {
                  e.stopPropagation();
                  handleLogWorkout();
                }}
              >
                <Plus size={16} />
              </Button>
              <Button
                variant="link"
                className="text-xs p-0 text-white/80 hover:text-white"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                See all
              </Button>
            </div>
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
              handleLogWorkout();
            }}
          >
            Complete {targetWorkouts} Workouts {completedWorkouts}/{targetWorkouts}
          </Button>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
};

export default Fitness;
