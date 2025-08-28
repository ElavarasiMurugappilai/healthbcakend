import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface MedicationsStepProps {
  formData: any;
  updateFormData: (key: string, value: any) => void;
}

export default function MedicationsStep({ formData, updateFormData }: MedicationsStepProps) {
  return (
    <div className="space-y-6">
      {/* Take Medications */}
      <div className="flex items-center justify-between">
        <Label>Take Medications</Label>
        <Switch
          checked={formData.takeMeds}
          onCheckedChange={(val) => updateFormData("takeMeds", val)}
        />
      </div>

      {/* Conditional rendering if meds = true */}
      {formData.takeMeds && (
        <div className="space-y-4">
          {/* Prescription Upload */}
          <div>
            <Label>Prescription Upload</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                updateFormData("prescriptionFile", e.target.files?.[0] || null)
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: PDF, JPG, JPEG, PNG
            </p>
          </div>

          {/* Medication Reminders */}
          <div className="flex items-center justify-between">
            <Label>Medication Reminders</Label>
            <Switch
              checked={formData.medicationReminders}
              onCheckedChange={(val) =>
                updateFormData("medicationReminders", val)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
