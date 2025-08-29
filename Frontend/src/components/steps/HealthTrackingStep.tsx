import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Activity, Heart, Droplets, Scale, Moon, Pill, Thermometer, Zap } from "lucide-react";

interface HealthTrackingStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function HealthTrackingStep({ formData, updateFormData }: HealthTrackingStepProps) {
  const trackingOptions = [
    { id: "glucose", label: "Blood Glucose", icon: Droplets, description: "Monitor blood sugar levels" },
    { id: "blood_pressure", label: "Blood Pressure", icon: Heart, description: "Track systolic and diastolic pressure" },
    { id: "weight", label: "Weight", icon: Scale, description: "Monitor body weight changes" },
    { id: "heart_rate", label: "Heart Rate", icon: Heart, description: "Track resting and active heart rate" },
    { id: "steps", label: "Daily Steps", icon: Activity, description: "Count daily physical activity" },
    { id: "sleep", label: "Sleep Quality", icon: Moon, description: "Monitor sleep duration and quality" },
    { id: "medication", label: "Medication Adherence", icon: Pill, description: "Track medication intake" },
    { id: "temperature", label: "Body Temperature", icon: Thermometer, description: "Monitor body temperature" },
    { id: "mood", label: "Mood & Energy", icon: Zap, description: "Track emotional wellbeing" }
  ];

  const healthConditions = [
    { id: "diabetes_type1", label: "Type 1 Diabetes" },
    { id: "diabetes_type2", label: "Type 2 Diabetes" },
    { id: "hypertension", label: "High Blood Pressure" },
    { id: "hypotension", label: "Low Blood Pressure" },
    { id: "heart_disease", label: "Heart Disease" },
    { id: "high_cholesterol", label: "High Cholesterol" },
    { id: "obesity", label: "Obesity" },
    { id: "sleep_apnea", label: "Sleep Apnea" },
    { id: "anxiety", label: "Anxiety" },
    { id: "depression", label: "Depression" },
    { id: "arthritis", label: "Arthritis" },
    { id: "asthma", label: "Asthma" },
    { id: "none", label: "None of the above" }
  ];

  const handleTrackingToggle = (trackingId: string) => {
    const currentTracking = formData.trackingPreferences || [];
    const updatedTracking = currentTracking.includes(trackingId)
      ? currentTracking.filter((t: string) => t !== trackingId)
      : [...currentTracking, trackingId];
    updateFormData("trackingPreferences", updatedTracking);
  };

  const handleConditionToggle = (conditionId: string) => {
    const currentConditions = formData.healthConditions || [];
    let updatedConditions;
    
    if (conditionId === "none") {
      updatedConditions = currentConditions.includes("none") ? [] : ["none"];
    } else {
      updatedConditions = currentConditions.includes(conditionId)
        ? currentConditions.filter((c: string) => c !== conditionId && c !== "none")
        : [...currentConditions.filter((c: string) => c !== "none"), conditionId];
    }
    
    updateFormData("healthConditions", updatedConditions);
  };

  return (
    <div className="space-y-6">
      {/* Health Conditions */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Heart size={20} />
            Health Conditions
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select any health conditions you currently have or are managing
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {healthConditions.map((condition) => {
              const isSelected = (formData.healthConditions || []).includes(condition.id);
              
              return (
                <div
                  key={condition.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                  }`}
                  onClick={() => handleConditionToggle(condition.id)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleConditionToggle(condition.id)}
                    />
                    <Label className={`cursor-pointer ${
                      isSelected ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {condition.label}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Preferences */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Activity size={20} />
            What Would You Like to Track?
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose the health metrics you want to monitor regularly
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackingOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = (formData.trackingPreferences || []).includes(option.id);
              
              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                  }`}
                  onClick={() => handleTrackingToggle(option.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleTrackingToggle(option.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} className={isSelected ? "text-orange-600" : "text-gray-500"} />
                        <Label className={`font-medium cursor-pointer ${
                          isSelected ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
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
