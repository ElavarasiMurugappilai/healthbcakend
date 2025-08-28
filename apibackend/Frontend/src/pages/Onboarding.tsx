// src/pages/OnboardingPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Dumbbell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Track your health easily",
    description: "Monitor fitness, sleep, and daily habits with one dashboard.",
    icon: <Heart className="w-12 h-12 text-red-500" />,
  },
  {
    title: "Personalized insights",
    description: "Get AI-driven recommendations tailored to your health journey.",
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
  },
  {
    title: "Join challenges & stay motivated",
    description: "Compete with friends, earn rewards, and celebrate progress.",
    icon: <Dumbbell className="w-12 h-12 text-blue-500" />,
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) setCurrent((c) => c + 1);
    else navigate("/login");
  };

  const skip = () => navigate("/login");

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100 dark:bg-[#252545]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>

      {/* Floating Icons (decorative) */}
      <Heart className="absolute top-1/4 left-1/4 w-16 h-16 text-red-400/30 dark:text-red-400/20 animate-float-slow" />
      <Dumbbell className="absolute bottom-1/3 right-1/4 w-20 h-20 text-blue-500/25 dark:text-blue-400/25 animate-float-medium" />
      <Zap className="absolute top-2/3 left-1/3 w-16 h-16 text-yellow-400/25 dark:text-yellow-300/20 animate-float-fast" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-md"
          >
            <div className="flex justify-center mb-6">{slides[current].icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              {slides[current].title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {slides[current].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex space-x-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === current
                  ? "bg-orange-500"
                  : "bg-gray-400/40 dark:bg-gray-600/40"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          {current < slides.length - 1 && (
            <Button
              variant="ghost"
              onClick={skip}
              className="text-gray-600 dark:text-gray-300"
            >
              Skip
            </Button>
          )}
          <Button
            onClick={next}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
          >
            {current === slides.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
