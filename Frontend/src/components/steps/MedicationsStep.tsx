import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pill, Plus, Trash2 } from "lucide-react";

interface MedicationsStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy?: string;
  notes?: string;
}

export default function MedicationsStep({ formData, updateFormData }: MedicationsStepProps) {
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    prescribedBy: "",
    notes: ""
  });

  const medications = formData.medications || [];

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const updatedMedications = [...medications, { ...newMedication }];
      updateFormData("medications", updatedMedications);
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        prescribedBy: "",
        notes: ""
      });
    }
  };

  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_: any, i: number) => i !== index);
    updateFormData("medications", updatedMedications);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = medications.map((med: Medication, i: number) => 
      i === index ? { ...med, [field]: value } : med
    );
    updateFormData("medications", updatedMedications);
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Pill size={20} />
            Current Medications
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add any medications you're currently taking (prescription or over-the-counter)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Medications */}
          {medications.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Your Medications</h3>
              {medications.map((medication: Medication, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {medication.name}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Dosage</Label>
                      <Input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        placeholder="e.g., 500mg"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Frequency</Label>
                      <Input
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        placeholder="e.g., twice daily"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Prescribed By</Label>
                      <Input
                        value={medication.prescribedBy || ""}
                        onChange={(e) => updateMedication(index, "prescribedBy", e.target.value)}
                        placeholder="e.g., Dr. Smith"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Notes</Label>
                      <Input
                        value={medication.notes || ""}
                        onChange={(e) => updateMedication(index, "notes", e.target.value)}
                        placeholder="e.g., with food"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Medication */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Add New Medication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="med-name">Medication Name *</Label>
                <Input
                  id="med-name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="e.g., Metformin"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="med-dosage">Dosage *</Label>
                <Input
                  id="med-dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g., 500mg"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="med-frequency">Frequency *</Label>
                <Input
                  id="med-frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  placeholder="e.g., twice daily"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="med-doctor">Prescribed By</Label>
                <Input
                  id="med-doctor"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication({...newMedication, prescribedBy: e.target.value})}
                  placeholder="e.g., Dr. Smith"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="med-notes">Notes</Label>
              <Textarea
                id="med-notes"
                value={newMedication.notes}
                onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                placeholder="Any additional notes (e.g., take with food, side effects, etc.)"
                className="focus:border-orange-500 focus:ring-orange-500"
                rows={2}
              />
            </div>
            <Button
              onClick={addMedication}
              disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              Add Medication
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
