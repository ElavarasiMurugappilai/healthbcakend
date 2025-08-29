import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Droplets, Target, Bell } from "lucide-react";

interface WaterIntakeStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function WaterIntakeStep({ formData, updateFormData }: WaterIntakeStepProps) {
  const waterGlasses = formData.dailyWaterGlasses || [8];
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Droplets size={20} />
            Water Intake Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Water Intake */}
          <div className="space-y-3">
            <Label>How many glasses of water do you usually drink daily?</Label>
            <div className="px-3">
              <Slider
                value={waterGlasses}
                onValueChange={(value) => updateFormData('dailyWaterGlasses', value)}
                max={15}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 glass</span>
                <span className="font-medium text-blue-600">
                  {waterGlasses[0]} glasses ({waterGlasses[0] * 250}ml)
                </span>
                <span>15 glasses</span>
              </div>
            </div>
          </div>

          {/* Water Reminders */}
          <div className="space-y-2">
            <Label>Do you want daily water intake reminders?</Label>
            <RadioGroup
              value={formData.waterReminders || ""}
              onValueChange={(value) => updateFormData('waterReminders', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="reminders-yes" />
                <Label htmlFor="reminders-yes" className="flex items-center gap-2">
                  <Bell size={16} />
                  Yes, remind me to drink water
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="reminders-no" />
                <Label htmlFor="reminders-no">No reminders needed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reminder Frequency (conditional) */}
          {formData.waterReminders === 'yes' && (
            <div className="space-y-2">
              <Label>How often should we remind you?</Label>
              <Select 
                value={formData.reminderFrequency || ""} 
                onValueChange={(value) => updateFormData('reminderFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">Every 30 minutes</SelectItem>
                  <SelectItem value="1hour">Every hour</SelectItem>
                  <SelectItem value="2hours">Every 2 hours</SelectItem>
                  <SelectItem value="3hours">Every 3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Personalized Goal Calculation */}
          <div className="space-y-2">
            <Label>Would you like us to calculate your ideal water goal?</Label>
            <RadioGroup
              value={formData.personalizedWaterGoal || ""}
              onValueChange={(value) => updateFormData('personalizedWaterGoal', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="personalized-yes" />
                <Label htmlFor="personalized-yes" className="flex items-center gap-2">
                  <Target size={16} />
                  Yes, calculate based on my weight & activity
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="personalized-no" />
                <Label htmlFor="personalized-no">No, I'll set my own goal</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Activity Level for Calculation */}
          {formData.personalizedWaterGoal === 'yes' && (
            <div className="space-y-2">
              <Label>How active are you daily?</Label>
              <Select 
                value={formData.activityLevelForWater || ""} 
                onValueChange={(value) => updateFormData('activityLevelForWater', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (desk job, minimal exercise)</SelectItem>
                  <SelectItem value="moderate">Moderate (some walking, light exercise)</SelectItem>
                  <SelectItem value="high">High (regular workouts, active job)</SelectItem>
                  <SelectItem value="very_high">Very High (intense training, physical labor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Water Tracking Preferences */}
          <div className="space-y-2">
            <Label>How would you like to track your water intake?</Label>
            <Select 
              value={formData.waterTrackingMethod || ""} 
              onValueChange={(value) => updateFormData('waterTrackingMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tracking method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="glasses">Count glasses (250ml each)</SelectItem>
                <SelectItem value="bottles">Count bottles (500ml each)</SelectItem>
                <SelectItem value="liters">Track in liters</SelectItem>
                <SelectItem value="ounces">Track in fluid ounces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Climate Consideration */}
          <div className="space-y-2">
            <Label>Do you live in a hot/humid climate?</Label>
            <RadioGroup
              value={formData.hotClimate || ""}
              onValueChange={(value) => updateFormData('hotClimate', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hot-yes" />
                <Label htmlFor="hot-yes">Yes, I need extra hydration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hot-no" />
                <Label htmlFor="hot-no">No, moderate climate</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
