import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Activity, Target, Footprints, Dumbbell } from "lucide-react";

interface FitnessActivityStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function FitnessActivityStep({ formData, updateFormData }: FitnessActivityStepProps) {
  const exerciseDays = formData.exerciseDaysPerWeek || [3];
  const stepGoal = formData.dailyStepGoal || [8000];

  const handleActivityToggle = (activity: string, checked: boolean) => {
    const currentActivities = formData.preferredActivities || [];
    if (checked) {
      updateFormData('preferredActivities', [...currentActivities, activity]);
    } else {
      updateFormData('preferredActivities', currentActivities.filter((a: string) => a !== activity));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Activity size={20} />
            Fitness & Activity Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Fitness Goal */}
          <div className="space-y-2">
            <Label>What is your primary fitness goal?</Label>
            <Select 
              value={formData.primaryFitnessGoal || ""} 
              onValueChange={(value) => updateFormData('primaryFitnessGoal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your main fitness goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose_weight">Lose weight</SelectItem>
                <SelectItem value="build_strength">Build strength & muscle</SelectItem>
                <SelectItem value="maintain_health">Maintain current health</SelectItem>
                <SelectItem value="improve_endurance">Improve endurance</SelectItem>
                <SelectItem value="flexibility">Improve flexibility</SelectItem>
                <SelectItem value="rehabilitation">Rehabilitation/Recovery</SelectItem>
                <SelectItem value="general_fitness">General fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Frequency */}
          <div className="space-y-3">
            <Label>How many days per week do you usually exercise?</Label>
            <div className="px-3">
              <Slider
                value={exerciseDays}
                onValueChange={(value) => updateFormData('exerciseDaysPerWeek', value)}
                max={7}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0 days</span>
                <span className="font-medium text-orange-600">
                  {exerciseDays[0]} days per week
                </span>
                <span>7 days</span>
              </div>
            </div>
          </div>

          {/* Preferred Activities */}
          <div className="space-y-3">
            <Label>What type of activities do you prefer? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="walking"
                  checked={(formData.preferredActivities || []).includes('walking')}
                  onCheckedChange={(checked) => handleActivityToggle('walking', checked as boolean)}
                />
                <Label htmlFor="walking" className="flex items-center gap-2">
                  <Footprints size={16} />
                  Walking
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gym"
                  checked={(formData.preferredActivities || []).includes('gym')}
                  onCheckedChange={(checked) => handleActivityToggle('gym', checked as boolean)}
                />
                <Label htmlFor="gym" className="flex items-center gap-2">
                  <Dumbbell size={16} />
                  Gym/Weight Training
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="yoga"
                  checked={(formData.preferredActivities || []).includes('yoga')}
                  onCheckedChange={(checked) => handleActivityToggle('yoga', checked as boolean)}
                />
                <Label htmlFor="yoga">Yoga</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="running"
                  checked={(formData.preferredActivities || []).includes('running')}
                  onCheckedChange={(checked) => handleActivityToggle('running', checked as boolean)}
                />
                <Label htmlFor="running">Running/Jogging</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cycling"
                  checked={(formData.preferredActivities || []).includes('cycling')}
                  onCheckedChange={(checked) => handleActivityToggle('cycling', checked as boolean)}
                />
                <Label htmlFor="cycling">Cycling</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="swimming"
                  checked={(formData.preferredActivities || []).includes('swimming')}
                  onCheckedChange={(checked) => handleActivityToggle('swimming', checked as boolean)}
                />
                <Label htmlFor="swimming">Swimming</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dancing"
                  checked={(formData.preferredActivities || []).includes('dancing')}
                  onCheckedChange={(checked) => handleActivityToggle('dancing', checked as boolean)}
                />
                <Label htmlFor="dancing">Dancing</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sports"
                  checked={(formData.preferredActivities || []).includes('sports')}
                  onCheckedChange={(checked) => handleActivityToggle('sports', checked as boolean)}
                />
                <Label htmlFor="sports">Sports</Label>
              </div>
            </div>
          </div>

          {/* Step Tracking */}
          <div className="space-y-2">
            <Label>Do you want daily step tracking?</Label>
            <RadioGroup
              value={formData.stepTracking || ""}
              onValueChange={(value) => updateFormData('stepTracking', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="steps-yes" />
                <Label htmlFor="steps-yes" className="flex items-center gap-2">
                  <Footprints size={16} />
                  Yes, track my daily steps
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="steps-no" />
                <Label htmlFor="steps-no">No step tracking needed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Step Goal */}
          {formData.stepTracking === 'yes' && (
            <div className="space-y-3">
              <Label>What's your daily step goal?</Label>
              <div className="px-3">
                <Slider
                  value={stepGoal}
                  onValueChange={(value) => updateFormData('dailyStepGoal', value)}
                  max={20000}
                  min={2000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>2,000</span>
                  <span className="font-medium text-orange-600">
                    {stepGoal[0].toLocaleString()} steps
                  </span>
                  <span>20,000</span>
                </div>
              </div>
            </div>
          )}

          {/* Workout Suggestions */}
          <div className="space-y-2">
            <Label>Do you want us to suggest workouts?</Label>
            <RadioGroup
              value={formData.workoutSuggestions || ""}
              onValueChange={(value) => updateFormData('workoutSuggestions', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="suggestions-yes" />
                <Label htmlFor="suggestions-yes" className="flex items-center gap-2">
                  <Target size={16} />
                  Yes, suggest personalized workouts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="suggestions-no" />
                <Label htmlFor="suggestions-no">No, I plan my own workouts</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Workout Difficulty */}
          {formData.workoutSuggestions === 'yes' && (
            <div className="space-y-2">
              <Label>What difficulty level do you prefer?</Label>
              <Select 
                value={formData.workoutDifficulty || ""} 
                onValueChange={(value) => updateFormData('workoutDifficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (just starting out)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (some experience)</SelectItem>
                  <SelectItem value="advanced">Advanced (experienced)</SelectItem>
                  <SelectItem value="adaptive">Adaptive (adjust based on progress)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Exercise Duration */}
          <div className="space-y-2">
            <Label>How long do you prefer to exercise per session?</Label>
            <Select 
              value={formData.exerciseDuration || ""} 
              onValueChange={(value) => updateFormData('exerciseDuration', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exercise duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="45min">45 minutes</SelectItem>
                <SelectItem value="60min">1 hour</SelectItem>
                <SelectItem value="90min">1.5 hours</SelectItem>
                <SelectItem value="flexible">Flexible duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fitness Tracking Integration */}
          <div className="space-y-2">
            <Label>Do you use any fitness tracking devices?</Label>
            <Select 
              value={formData.fitnessDevice || ""} 
              onValueChange={(value) => updateFormData('fitnessDevice', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your device (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No device</SelectItem>
                <SelectItem value="apple_watch">Apple Watch</SelectItem>
                <SelectItem value="fitbit">Fitbit</SelectItem>
                <SelectItem value="garmin">Garmin</SelectItem>
                <SelectItem value="samsung_health">Samsung Health</SelectItem>
                <SelectItem value="google_fit">Google Fit</SelectItem>
                <SelectItem value="other">Other device</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
