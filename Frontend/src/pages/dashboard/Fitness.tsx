import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FitnessProps {
  setShowFitnessModal: (show: boolean) => void;
  isFullWidth?: boolean;
}

const Fitness: React.FC<FitnessProps> = ({ setShowFitnessModal, isFullWidth = false }) => {
  // Animation state
  const [progress, setProgress] = useState(0);
  const totalLength = 251; // Circumference for r=40

  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(4);

  // Calculate progress percentage based on completed workouts
  const targetWorkouts = 5;
  const progressPercentage = Math.round((completed / targetWorkouts) * 100);

  // Animation effect for progress circle
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <>
      <Card 
        className={`${isFullWidth ? 'col-span-2' : ''} h-fit cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-0 overflow-hidden relative`}
        onClick={() => setShowModal(true)}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-xl"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Fitness Goals
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowFitnessModal(true);
              }}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-white/10"
            >
              See all
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-6 relative z-10">
          <div className="flex flex-col items-center space-y-6">
            {/* Progress Circle */}
            <div className="relative">
              <div className="relative w-32 h-32">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-30 blur-md"></div>
                
                <svg className="w-32 h-32 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: totalLength, strokeDashoffset: totalLength }}
                    animate={{ 
                      strokeDasharray: totalLength, 
                      strokeDashoffset: totalLength - (totalLength * progress) / 100 
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                      filter: "drop-shadow(0 0 8px #00d4ff)"
                    }}
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="50%" stopColor="#0099cc" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div 
                      className="text-3xl font-bold text-white"
                      style={{
                        textShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff"
                      }}
                    >
                      {Math.round(progress)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Text */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
                <span className="text-white/90 text-sm font-medium">
                  Complete {targetWorkouts} Workouts {completed}/{targetWorkouts}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Modal */}
      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  🏃‍♂️ Fitness Dashboard
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">6,500</div>
                    <div className="text-sm text-gray-600">Steps Today</div>
                    <div className="text-xs text-gray-500">Goal: 8,000</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">1,800</div>
                    <div className="text-sm text-gray-600">Calories Burned</div>
                    <div className="text-xs text-gray-500">Goal: 2,000</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{completed}</div>
                    <div className="text-sm text-gray-600">Workouts This Week</div>
                    <div className="text-xs text-gray-500">Goal: {targetWorkouts}</div>
                  </div>
                </div>

                {/* Workout Controls */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setCompleted(prev => Math.min(prev + 1, targetWorkouts))}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      + Add Workout
                    </Button>
                    <Button 
                      onClick={() => setCompleted(prev => Math.max(prev - 1, 0))}
                      variant="outline"
                    >
                      - Remove Workout
                    </Button>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800">💡 Insights</h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Great progress this week! You're {Math.round(progress)}% to your goal.</li>
                    <li>• Try to increase your daily steps by 500 to reach your target.</li>
                    <li>• Consider adding a morning workout to boost your energy.</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default Fitness;
