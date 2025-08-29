import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Ruler, Weight, Activity } from "lucide-react";

interface ProfileStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function ProfileStep({ formData, updateFormData }: ProfileStepProps) {
  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <User size={20} />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar size={16} className="text-orange-500" />
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.personalInfo?.age || ""}
              onChange={(e) => updateFormData("personalInfo.age", parseInt(e.target.value) || "")}
              className="focus:border-orange-500 focus:ring-orange-500"
              min="1"
              max="120"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              Gender
            </Label>
            <Select
              value={formData.personalInfo?.gender || ""}
              onValueChange={(value) => updateFormData("personalInfo.gender", value)}
            >
              <SelectTrigger className="focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler size={16} className="text-orange-500" />
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height in cm"
              value={formData.personalInfo?.height || ""}
              onChange={(e) => updateFormData("personalInfo.height", parseInt(e.target.value) || "")}
              className="focus:border-orange-500 focus:ring-orange-500"
              min="50"
              max="300"
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Weight size={16} className="text-orange-500" />
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight in kg"
              value={formData.personalInfo?.weight || ""}
              onChange={(e) => updateFormData("personalInfo.weight", parseFloat(e.target.value) || "")}
              className="focus:border-orange-500 focus:ring-orange-500"
              min="20"
              max="500"
              step="0.1"
            />
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity size={16} className="text-orange-500" />
              Activity Level
            </Label>
            <Select
              value={formData.personalInfo?.activityLevel || ""}
              onValueChange={(value) => updateFormData("personalInfo.activityLevel", value)}
            >
              <SelectTrigger className="focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
