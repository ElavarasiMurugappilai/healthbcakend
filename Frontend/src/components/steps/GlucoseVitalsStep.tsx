import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, Heart, Droplets } from "lucide-react";

interface GlucoseVitalsStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function GlucoseVitalsStep({ formData, updateFormData }: GlucoseVitalsStepProps) {
  const handleVitalToggle = (vital: string, checked: boolean) => {
    const currentVitals = formData.trackingVitals || [];
    if (checked) {
      updateFormData('trackingVitals', [...currentVitals, vital]);
    } else {
      updateFormData('trackingVitals', currentVitals.filter((v: string) => v !== vital));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Droplets size={20} />
            Glucose & Vitals Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Diabetes Status */}
          <div className="space-y-2">
            <Label>Do you have diabetes?</Label>
            <RadioGroup
              value={formData.hasDiabetes || ""}
              onValueChange={(value) => updateFormData('hasDiabetes', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="diabetes-yes" />
                <Label htmlFor="diabetes-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="diabetes-no" />
                <Label htmlFor="diabetes-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Diabetes Type (conditional) */}
          {formData.hasDiabetes === 'yes' && (
            <div className="space-y-2">
              <Label>Which type of diabetes?</Label>
              <Select 
                value={formData.diabetesType || ""} 
                onValueChange={(value) => updateFormData('diabetesType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diabetes type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">Type 1</SelectItem>
                  <SelectItem value="type2">Type 2</SelectItem>
                  <SelectItem value="gestational">Gestational</SelectItem>
                  <SelectItem value="prediabetes">Prediabetes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Glucose Monitoring Frequency */}
          {formData.hasDiabetes === 'yes' && (
            <div className="space-y-2">
              <Label>How often do you monitor your glucose?</Label>
              <Select 
                value={formData.glucoseMonitoringFrequency || ""} 
                onValueChange={(value) => updateFormData('glucoseMonitoringFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select monitoring frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_daily">Multiple times daily</SelectItem>
                  <SelectItem value="daily">Once daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Other Vitals Tracking */}
          <div className="space-y-3">
            <Label>Do you want to track other vitals?</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bp"
                  checked={(formData.trackingVitals || []).includes('blood_pressure')}
                  onCheckedChange={(checked) => handleVitalToggle('blood_pressure', checked as boolean)}
                />
                <Label htmlFor="bp" className="flex items-center gap-2">
                  <Heart size={16} />
                  Blood Pressure
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cholesterol"
                  checked={(formData.trackingVitals || []).includes('cholesterol')}
                  onCheckedChange={(checked) => handleVitalToggle('cholesterol', checked as boolean)}
                />
                <Label htmlFor="cholesterol" className="flex items-center gap-2">
                  <Activity size={16} />
                  Cholesterol
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="heart_rate"
                  checked={(formData.trackingVitals || []).includes('heart_rate')}
                  onCheckedChange={(checked) => handleVitalToggle('heart_rate', checked as boolean)}
                />
                <Label htmlFor="heart_rate" className="flex items-center gap-2">
                  <Heart size={16} />
                  Heart Rate
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oxygen"
                  checked={(formData.trackingVitals || []).includes('oxygen_saturation')}
                  onCheckedChange={(checked) => handleVitalToggle('oxygen_saturation', checked as boolean)}
                />
                <Label htmlFor="oxygen" className="flex items-center gap-2">
                  <Activity size={16} />
                  Oxygen Saturation
                </Label>
              </div>
            </div>
          </div>

          {/* Monitoring Goals */}
          <div className="space-y-2">
            <Label>Primary monitoring goal</Label>
            <Select 
              value={formData.monitoringGoal || ""} 
              onValueChange={(value) => updateFormData('monitoringGoal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your main goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diabetes_management">Diabetes Management</SelectItem>
                <SelectItem value="heart_health">Heart Health</SelectItem>
                <SelectItem value="general_wellness">General Wellness</SelectItem>
                <SelectItem value="weight_management">Weight Management</SelectItem>
                <SelectItem value="fitness_tracking">Fitness Tracking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
