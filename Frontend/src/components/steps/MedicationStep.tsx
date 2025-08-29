import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pill, Clock, AlertTriangle, Plus, X } from "lucide-react";
import { useState } from "react";

interface MedicationStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  prescribedBy: string;
  purpose: string;
}

export default function MedicationStep({ formData, updateFormData }: MedicationStepProps) {
  const [medications, setMedications] = useState<Medication[]>(formData.medications || []);
  const [currentMed, setCurrentMed] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: '',
    timeOfDay: [],
    prescribedBy: '',
    purpose: ''
  });

  const handleTimeToggle = (time: string, checked: boolean) => {
    const newTimes = checked 
      ? [...currentMed.timeOfDay, time]
      : currentMed.timeOfDay.filter(t => t !== time);
    setCurrentMed({ ...currentMed, timeOfDay: newTimes });
  };

  const addMedication = () => {
    if (currentMed.name && currentMed.dosage && currentMed.frequency) {
      const newMedications = [...medications, currentMed];
      setMedications(newMedications);
      updateFormData('medications', newMedications);
      setCurrentMed({
        name: '',
        dosage: '',
        frequency: '',
        timeOfDay: [],
        prescribedBy: '',
        purpose: ''
      });
    }
  };

  const removeMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
    updateFormData('medications', newMedications);
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Pill size={20} />
            Medication Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Taking Medications */}
          <div className="space-y-2">
            <Label>Are you currently taking any medications?</Label>
            <RadioGroup
              value={formData.takingMedications || ""}
              onValueChange={(value) => updateFormData('takingMedications', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="meds-yes" />
                <Label htmlFor="meds-yes">Yes, I take medications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="meds-no" />
                <Label htmlFor="meds-no">No medications currently</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Medication List */}
          {formData.takingMedications === 'yes' && (
            <>
              {/* Current Medications Display */}
              {medications.length > 0 && (
                <div className="space-y-3">
                  <Label>Your Current Medications:</Label>
                  {medications.map((med, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{med.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {med.dosage} - {med.frequency}
                          </p>
                          {med.timeOfDay.length > 0 && (
                            <p className="text-sm text-gray-500">
                              Times: {med.timeOfDay.join(', ')}
                            </p>
                          )}
                          {med.prescribedBy && (
                            <p className="text-sm text-gray-500">
                              Prescribed by: {med.prescribedBy}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Medication Form */}
              <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Label className="text-base font-medium">Add Medication:</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="med-name">Medication Name</Label>
                    <Input
                      id="med-name"
                      placeholder="e.g., Metformin"
                      value={currentMed.name}
                      onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="med-dosage">Dosage</Label>
                    <Input
                      id="med-dosage"
                      placeholder="e.g., 500mg"
                      value={currentMed.dosage}
                      onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select 
                      value={currentMed.frequency} 
                      onValueChange={(value) => setCurrentMed({ ...currentMed, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How often?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once_daily">Once daily</SelectItem>
                        <SelectItem value="twice_daily">Twice daily</SelectItem>
                        <SelectItem value="three_times_daily">Three times daily</SelectItem>
                        <SelectItem value="four_times_daily">Four times daily</SelectItem>
                        <SelectItem value="as_needed">As needed</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prescribed-by">Prescribed By</Label>
                    <Input
                      id="prescribed-by"
                      placeholder="Doctor's name (optional)"
                      value={currentMed.prescribedBy}
                      onChange={(e) => setCurrentMed({ ...currentMed, prescribedBy: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time of Day (select all that apply):</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Morning', 'Afternoon', 'Evening', 'Bedtime'].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox
                          id={`time-${time}`}
                          checked={currentMed.timeOfDay.includes(time)}
                          onCheckedChange={(checked) => handleTimeToggle(time, checked as boolean)}
                        />
                        <Label htmlFor={`time-${time}`}>{time}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="med-purpose">Purpose/Condition (optional)</Label>
                  <Input
                    id="med-purpose"
                    placeholder="e.g., Diabetes, High blood pressure"
                    value={currentMed.purpose}
                    onChange={(e) => setCurrentMed({ ...currentMed, purpose: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={addMedication}
                  className="w-full"
                  disabled={!currentMed.name || !currentMed.dosage || !currentMed.frequency}
                >
                  <Plus size={16} className="mr-2" />
                  Add Medication
                </Button>
              </div>
            </>
          )}

          {/* Medication Reminders */}
          <div className="space-y-2">
            <Label>Do you want reminders for your medications?</Label>
            <RadioGroup
              value={formData.medicationReminders || ""}
              onValueChange={(value) => updateFormData('medicationReminders', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="reminders-yes" />
                <Label htmlFor="reminders-yes" className="flex items-center gap-2">
                  <Clock size={16} />
                  Yes, remind me to take medications
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="reminders-no" />
                <Label htmlFor="reminders-no">No reminders needed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reminder Settings */}
          {formData.medicationReminders === 'yes' && (
            <div className="space-y-2">
              <Label>How far in advance should we remind you?</Label>
              <Select 
                value={formData.reminderAdvance || ""} 
                onValueChange={(value) => updateFormData('reminderAdvance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5min">5 minutes before</SelectItem>
                  <SelectItem value="15min">15 minutes before</SelectItem>
                  <SelectItem value="30min">30 minutes before</SelectItem>
                  <SelectItem value="1hour">1 hour before</SelectItem>
                  <SelectItem value="exact_time">At exact time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Side Effects Tracking */}
          <div className="space-y-2">
            <Label>Do you want to log side effects or reactions?</Label>
            <RadioGroup
              value={formData.trackSideEffects || ""}
              onValueChange={(value) => updateFormData('trackSideEffects', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="side-effects-yes" />
                <Label htmlFor="side-effects-yes" className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Yes, I want to track side effects
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="side-effects-no" />
                <Label htmlFor="side-effects-no">No side effect tracking needed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Doctor Medication Suggestions */}
          <div className="space-y-2">
            <Label>Should your doctor be allowed to suggest new medications here?</Label>
            <RadioGroup
              value={formData.doctorMedicationSuggestions || ""}
              onValueChange={(value) => updateFormData('doctorMedicationSuggestions', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="doctor-suggestions-yes" />
                <Label htmlFor="doctor-suggestions-yes">Yes, allow medication suggestions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="doctor-suggestions-no" />
                <Label htmlFor="doctor-suggestions-no">No, I'll discuss medications in person</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Pharmacy Integration */}
          <div className="space-y-2">
            <Label>Would you like to connect with your pharmacy for refill reminders?</Label>
            <RadioGroup
              value={formData.pharmacyIntegration || ""}
              onValueChange={(value) => updateFormData('pharmacyIntegration', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pharmacy-yes" />
                <Label htmlFor="pharmacy-yes">Yes, connect with my pharmacy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pharmacy-no" />
                <Label htmlFor="pharmacy-no">No pharmacy integration</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Medication Adherence Goals */}
          <div className="space-y-2">
            <Label>What's your main goal for medication management?</Label>
            <Select 
              value={formData.medicationGoal || ""} 
              onValueChange={(value) => updateFormData('medicationGoal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your main goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="better_adherence">Better adherence to current medications</SelectItem>
                <SelectItem value="reduce_medications">Reduce number of medications</SelectItem>
                <SelectItem value="manage_side_effects">Better manage side effects</SelectItem>
                <SelectItem value="cost_optimization">Optimize medication costs</SelectItem>
                <SelectItem value="simplify_routine">Simplify medication routine</SelectItem>
                <SelectItem value="track_effectiveness">Track medication effectiveness</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
