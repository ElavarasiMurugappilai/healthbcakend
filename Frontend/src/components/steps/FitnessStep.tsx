import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

interface FitnessStepProps {
  formData: any;
  updateFormData: (key: string, value: any) => void;
  handleExerciseTypeToggle: (type: string) => void;
}

export default function FitnessStep({
  formData,
  updateFormData,
  handleExerciseTypeToggle,
}: FitnessStepProps) {
  return (
    <div className="space-y-6">
      {/* Exercise Frequency */}
      <div>
        <Label>Exercise Frequency</Label>
        <RadioGroup
          value={formData.exercise}
          onValueChange={(val) => updateFormData("exercise", val)}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="ex-none" />
            <Label htmlFor="ex-none">None</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="occasional" id="ex-occasional" />
            <Label htmlFor="ex-occasional">Occasional</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="regular" id="ex-regular" />
            <Label htmlFor="ex-regular">Regular</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Exercise Types */}
      <div>
        <Label>Exercise Types</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["Walking", "Running", "Cycling", "Swimming", "Yoga", "Gym"].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                checked={formData.exerciseTypes.includes(type)}
                onCheckedChange={() => handleExerciseTypeToggle(type)}
              />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Duration */}
      <div>
        <Label>Exercise Duration (minutes)</Label>
        <Slider
          value={formData.exerciseDuration}
          onValueChange={(val) => updateFormData("exerciseDuration", val)}
          min={0}
          max={120}
          step={5}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">{formData.exerciseDuration[0]} min</p>
      </div>

      {/* Fitness Goals */}
      <div>
        <Label>Fitness Goals</Label>
        <Select
          value={formData.fitnessGoals}
          onValueChange={(val) => updateFormData("fitnessGoals", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general_fitness">General Fitness</SelectItem>
            <SelectItem value="weight_loss">Weight Loss</SelectItem>
            <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
            <SelectItem value="endurance">Endurance</SelectItem>
            <SelectItem value="flexibility">Flexibility</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Water Goal */}
      <div>
        <Label>Daily Water Goal</Label>
        <Slider
          value={formData.waterIntake}
          onValueChange={(val) => updateFormData("waterIntake", val)}
          min={0}
          max={6}
          step={0.5}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Daily water goal: {formData.waterIntake[0]}L
        </p>
      </div>

      {/* Step Goal */}
      <div>
        <Label>Daily Step Goal</Label>
        <Slider
          value={formData.stepGoal}
          onValueChange={(val) => updateFormData("stepGoal", val)}
          min={1000}
          max={20000}
          step={500}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">{formData.stepGoal[0]} steps</p>
      </div>
    </div>
  );
}
