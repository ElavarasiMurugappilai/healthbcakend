import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  formData: any;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const trophies = [
    {
      key: "profile",
      title: "Personal Info",
      emoji: "🎯",
      completed: !!formData.age && !!formData.gender,
      details: [
        `Age: ${formData.age || "Not specified"}`,
        `Gender: ${formData.gender || "Not specified"}`,
        `Weight: ${formData.weight || "Not specified"} ${formData.units.weight}`,
        `Height: ${formData.height || "Not specified"} ${formData.units.height}`,
      ],
    },
    {
      key: "fitness",
      title: "Fitness Goals",
      emoji: "💪",
      completed: !!formData.fitnessGoals,
      details: [
        `Exercise: ${formData.exercise || "Not specified"}`,
        `Duration: ${formData.exerciseDuration?.[0] || "Not specified"} min`,
        `Water: ${formData.waterIntake?.[0] || "Not specified"}L`,
        `Steps: ${formData.stepGoal?.[0] || "Not specified"} steps`,
      ],
    },
    {
      key: "tracking",
      title: "Health Tracking",
      emoji: "📊",
      completed:
        formData.trackGlucose ||
        formData.trackBP ||
        formData.trackHR ||
        formData.trackSleep ||
        formData.trackWeight,
      details: [
        `Glucose: ${formData.trackGlucose ? "Yes" : "No"}`,
        `BP: ${formData.trackBP ? "Yes" : "No"}`,
        `HR: ${formData.trackHR ? "Yes" : "No"}`,
        `Sleep: ${formData.trackSleep ? "Yes" : "No"}`,
        `Weight: ${formData.trackWeight ? "Yes" : "No"}`,
      ],
    },
    {
      key: "meds",
      title: "Medications",
      emoji: "💊",
      completed: formData.takeMeds,
      details: [
        `Taking: ${formData.takeMeds ? "Yes" : "No"}`,
        formData.takeMeds
          ? `Reminders: ${formData.medicationReminders ? "On" : "Off"}`
          : "Not specified",
      ],
    },
    {
      key: "prefs",
      title: "Preferences",
      emoji: "🔔",
      completed: formData.notificationsEnabled || formData.joinChallenges,
      details: [
        `Challenges: ${formData.joinChallenges ? "Yes" : "No"}`,
        `Difficulty: ${formData.challengeDifficulty || "Not specified"}`,
        `Reward: ${formData.rewardType || "Not specified"}`,
        `Notifications: ${formData.notificationsEnabled ? "On" : "Off"}`,
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🏆 Your Trophy Cabinet</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Each badge represents a milestone you’ve completed in your health journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trophies.map((trophy) => (
          <Card
            key={trophy.key}
            className={cn(
              "p-4 flex flex-col items-center text-center transition-all",
              trophy.completed
                ? "border-green-500 shadow-lg bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-700"
            )}
          >
            <div className="text-4xl mb-2">{trophy.emoji}</div>
            <h3 className="font-semibold">{trophy.title}</h3>
            {trophy.completed && (
              <div className="flex items-center text-green-600 mt-1 text-sm">
                <Check size={16} className="mr-1" /> Completed
              </div>
            )}
            <CardContent className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {trophy.details.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
