import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dumbbell, Target, Heart, Zap, Scale, Trophy } from "lucide-react";

interface FitnessStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function FitnessStep({ formData, updateFormData }: FitnessStepProps) {
  const fitnessGoals = [
    { id: "weight_loss", label: "Weight Loss", icon: Scale, description: "Lose weight and maintain a healthy BMI" },
    { id: "weight_gain", label: "Weight Gain", icon: Dumbbell, description: "Build muscle mass and gain healthy weight" },
    { id: "muscle_building", label: "Muscle Building", icon: Dumbbell, description: "Increase muscle strength and definition" },
    { id: "cardiovascular_health", label: "Cardiovascular Health", icon: Heart, description: "Improve heart health and endurance" },
    { id: "flexibility", label: "Flexibility & Mobility", icon: Zap, description: "Enhance flexibility and joint mobility" },
    { id: "endurance", label: "Endurance", icon: Target, description: "Build stamina and athletic performance" },
    { id: "general_fitness", label: "General Fitness", icon: Trophy, description: "Overall health and wellness maintenance" },
    { id: "stress_management", label: "Stress Management", icon: Heart, description: "Use exercise to reduce stress and anxiety" }
  ];

  const handleGoalToggle = (goalId: string) => {
    const currentGoals = formData.fitnessGoals || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((g: string) => g !== goalId)
      : [...currentGoals, goalId];
    updateFormData("fitnessGoals", updatedGoals);
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Target size={20} />
            Fitness Goals
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select your primary fitness and health goals (you can choose multiple)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fitnessGoals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = (formData.fitnessGoals || []).includes(goal.id);
              
              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleGoalToggle(goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} className={isSelected ? "text-orange-600" : "text-gray-500"} />
                        <Label className={`font-medium cursor-pointer ${
                          isSelected ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {goal.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
