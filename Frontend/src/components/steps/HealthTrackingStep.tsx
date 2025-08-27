import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Droplet, HeartPulse, Activity, Moon, Scale } from "lucide-react";

interface Props {
  formData: any;
  updateFormData: (key: string, value: any) => void;
}

const HealthTrackingStep: React.FC<Props> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Metrics to Track</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Droplet className="text-red-500" size={18} />
              <span>Blood Glucose</span>
            </div>
            <Switch
              checked={formData.trackGlucose}
              onCheckedChange={(val) => updateFormData("trackGlucose", val)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <HeartPulse className="text-pink-500" size={18} />
              <span>Blood Pressure</span>
            </div>
            <Switch
              checked={formData.trackBP}
              onCheckedChange={(val) => updateFormData("trackBP", val)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Activity className="text-red-600" size={18} />
              <span>Heart Rate</span>
            </div>
            <Switch
              checked={formData.trackHR}
              onCheckedChange={(val) => updateFormData("trackHR", val)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Moon className="text-yellow-500" size={18} />
              <span>Sleep</span>
            </div>
            <Switch
              checked={formData.trackSleep}
              onCheckedChange={(val) => updateFormData("trackSleep", val)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Scale className="text-yellow-600" size={18} />
              <span>Weight</span>
            </div>
            <Switch
              checked={formData.trackWeight}
              onCheckedChange={(val) => updateFormData("trackWeight", val)}
            />
          </div>
        </div>
      </div>

      {/* Preferred Units */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Preferred Units</h3>
        <div className="space-y-4">
          {/* Weight */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="font-medium">Weight</Label>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.units.weight === "kg"}
                  onChange={() =>
                    updateFormData("units", { ...formData.units, weight: "kg" })
                  }
                />
                kg
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.units.weight === "lbs"}
                  onChange={() =>
                    updateFormData("units", { ...formData.units, weight: "lbs" })
                  }
                />
                lbs
              </label>
            </div>
          </div>

          {/* Glucose */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="font-medium">Glucose</Label>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.units.glucose === "mg/dL"}
                  onChange={() =>
                    updateFormData("units", {
                      ...formData.units,
                      glucose: "mg/dL",
                    })
                  }
                />
                mg/dL
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.units.glucose === "mmol/L"}
                  onChange={() =>
                    updateFormData("units", {
                      ...formData.units,
                      glucose: "mmol/L",
                    })
                  }
                />
                mmol/L
              </label>
            </div>
          </div>

          {/* Height */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="font-medium">Height</Label>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.units.height === "cm"}
                  onChange={() =>
                    updateFormData("units", { ...formData.units, height: "cm" })
                  }
                />
                cm
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.units.height === "ft"}
                  onChange={() =>
                    updateFormData("units", { ...formData.units, height: "ft" })
                  }
                />
                ft
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackingStep;
