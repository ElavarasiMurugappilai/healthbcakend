import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface ProfileStepProps {
  formData: any;
  updateFormData: (key: string, value: any) => void;
  handleConditionToggle: (condition: string) => void;
}

export default function ProfileStep({ formData, updateFormData, handleConditionToggle }: ProfileStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          type="number"
          id="age"
          value={formData.age}
          onChange={(e) => updateFormData("age", e.target.value)}
        />
      </div>

      <div>
        <Label>Gender</Label>
        <Select value={formData.gender} onValueChange={(val) => updateFormData("gender", val)}>
          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Weight (kg)</Label>
        <Input
          type="number"
          value={formData.weight}
          onChange={(e) => updateFormData("weight", e.target.value)}
        />
      </div>

      <div>
        <Label>Height (cm)</Label>
        <Input
          type="number"
          value={formData.height}
          onChange={(e) => updateFormData("height", e.target.value)}
        />
      </div>

      <Separator className="col-span-2 my-2" />

      <div className="col-span-2">
        <Label>Health Conditions</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["Diabetes", "Hypertension", "Asthma"].map((c) => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox checked={formData.conditions.includes(c)} onCheckedChange={() => handleConditionToggle(c)} />
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Input
          type="text"
          id="allergies"
          value={formData.allergies}
          onChange={(e) => updateFormData("allergies", e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Smoker</Label>
        <Switch checked={formData.smoker} onCheckedChange={(val) => updateFormData("smoker", val)} />
      </div>

      <div className="col-span-2">
        <Label>Alcohol Consumption</Label>
        <RadioGroup value={formData.alcohol} onValueChange={(val) => updateFormData("alcohol", val)} className="flex space-x-4 mt-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="alc-none" />
            <Label htmlFor="alc-none">None</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="occasional" id="alc-occasional" />
            <Label htmlFor="alc-occasional">Occasional</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="regular" id="alc-regular" />
            <Label htmlFor="alc-regular">Regular</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="col-span-2">
        <Label>Sleep Hours</Label>
        <Slider value={formData.sleepHours} max={12} min={0} step={1} onValueChange={(val) => updateFormData("sleepHours", val)} />
        <p className="text-sm text-gray-500 mt-1">{formData.sleepHours[0]} hrs</p>
      </div>
    </div>
  );
}
