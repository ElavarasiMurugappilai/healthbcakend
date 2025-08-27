import React from "react";
import {
  User,
  HeartPulse,
  Activity,
  Settings,
  Pill,
  CheckCircle,
} from "lucide-react";

export interface HealthWheelProps {
  steps: number;
  currentStep: number;
  completedSteps: boolean[];
  onSliceClick: (i: number) => void;
}

const stepConfig = [
  { icon: User, color: "#3b82f6", label: "Personal" },       // Step 1
  { icon: HeartPulse, color: "#ef4444", label: "Health" },   // Step 2
  { icon: Activity, color: "#22c55e", label: "Fitness" },    // Step 3
  { icon: Settings, color: "#facc15", label: "Preferences" },// Step 4
  { icon: Pill, color: "#ec4899", label: "Medications" },    // Step 5
  { icon: CheckCircle, color: "#8b5cf6", label: "Review" },  // Step 6
];

export default function HealthWheel({
  currentStep,
  completedSteps,
  onSliceClick,
}: HealthWheelProps) {
  const radius = 120; // circle radius
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const slice = circumference / stepConfig.length;

  return (
    <div className="relative flex justify-center items-center">
      <svg width="350" height="350" viewBox="0 0 350 350" className="rotate-[-90deg]">
        <circle
          cx="175"
          cy="175"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {stepConfig.map((step, i) => {
          const offset = i * slice;
          const isActive = currentStep === i;
          const isCompleted = completedSteps[i];

          return (
            <circle
              key={i}
              cx="175"
              cy="175"
              r={radius}
              fill="none"
              stroke={step.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${slice} ${circumference - slice}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className={`cursor-pointer transition-all duration-300 ${
                isActive ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => onSliceClick(i)}
            />
          );
        })}
      </svg>

      {/* Center Icon */}
      <div className="absolute flex flex-col items-center">
        {React.createElement(stepConfig[currentStep].icon, {
          size: 40,
          className: "text-blue-500",
        })}
        <span className="text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">
          {stepConfig[currentStep].label}
        </span>
      </div>
    </div>
  );
}
