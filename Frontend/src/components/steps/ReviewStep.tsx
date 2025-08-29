import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Target, Activity, Pill, Stethoscope, CheckCircle } from "lucide-react";

interface ReviewStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const getActivityLevelLabel = (level: string) => {
    const levels = {
      sedentary: "Sedentary (little/no exercise)",
      lightly_active: "Lightly Active (light exercise 1-3 days/week)",
      moderately_active: "Moderately Active (moderate exercise 3-5 days/week)",
      very_active: "Very Active (hard exercise 6-7 days/week)",
      extremely_active: "Extremely Active (very hard exercise, physical job)"
    };
    return levels[level as keyof typeof levels] || level;
  };

  const renderPersonalInfo = () => (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <User size={20} />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Age:</span>
            <p className="font-medium">{formData.age || "Not specified"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Gender:</span>
            <p className="font-medium capitalize">{formData.gender || "Not specified"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Height:</span>
            <p className="font-medium">{formData.height ? `${formData.height} cm` : "Not specified"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Weight:</span>
            <p className="font-medium">{formData.weight ? `${formData.weight} kg` : "Not specified"}</p>
          </div>
        </div>
        {formData.activityLevel && (
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Activity Level:</span>
            <p className="font-medium">{getActivityLevelLabel(formData.activityLevel)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderFitnessGoals = () => (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Target size={20} />
          Fitness Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formData.fitnessGoals && formData.fitnessGoals.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.fitnessGoals.map((goal: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {goal.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No fitness goals selected</p>
        )}
      </CardContent>
    </Card>
  );

  const renderHealthTracking = () => (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Activity size={20} />
          Health Tracking & Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Conditions */}
        <div>
          <h4 className="font-medium mb-2">Health Conditions:</h4>
          {formData.healthConditions && formData.healthConditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.healthConditions.map((condition: string, index: number) => (
                <Badge key={index} variant="outline" className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-300">
                  {condition.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No health conditions specified</p>
          )}
        </div>

        {/* Tracking Preferences */}
        <div>
          <h4 className="font-medium mb-2">Tracking Preferences:</h4>
          {formData.trackingPreferences && formData.trackingPreferences.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.trackingPreferences.map((preference: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {preference.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No tracking preferences selected</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderMedications = () => (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Pill size={20} />
          Medications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formData.medications && formData.medications.length > 0 ? (
          <div className="space-y-3">
            {formData.medications.map((medication: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{medication.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {medication.dosage} - {medication.frequency}
                    </p>
                    {medication.prescribedBy && (
                      <p className="text-sm text-gray-500">Prescribed by: {medication.prescribedBy}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No medications added</p>
        )}
      </CardContent>
    </Card>
  );

  const renderCareTeam = () => (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Stethoscope size={20} />
          Care Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formData.careTeam && formData.careTeam.length > 0 ? (
          <div className="space-y-3">
            {formData.careTeam.map((doctor: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Dr. {doctor.name}</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">{doctor.specialty}</p>
                    {doctor.clinic && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.clinic}</p>
                    )}
                    {doctor.phone && (
                      <p className="text-sm text-gray-500">{doctor.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No healthcare providers added</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle size={20} />
            Health Profile Summary
          </CardTitle>
          <p className="text-sm text-green-700 dark:text-green-300">
            Review your information before submitting. You can go back to edit any section if needed.
          </p>
        </CardHeader>
      </Card>

      {/* Review Sections */}
      {renderPersonalInfo()}
      {renderFitnessGoals()}
      {renderHealthTracking()}
      {renderMedications()}
      {renderCareTeam()}

      {/* Completion Note */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              Ready to Submit
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your health profile is complete. Click "Submit" to save your information and start your health journey.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
