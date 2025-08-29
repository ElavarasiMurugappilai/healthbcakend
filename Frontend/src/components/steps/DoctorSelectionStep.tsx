import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Stethoscope, Plus, Trash2 } from "lucide-react";

interface DoctorSelectionStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

interface Doctor {
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  clinic?: string;
  notes?: string;
}

export default function DoctorSelectionStep({ formData, updateFormData }: DoctorSelectionStepProps) {
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    clinic: "",
    notes: ""
  });

  const doctors = formData.careTeam || [];

  const specialties = [
    "Primary Care Physician",
    "Cardiologist",
    "Endocrinologist", 
    "Neurologist",
    "Dermatologist",
    "Orthopedist",
    "Psychiatrist",
    "Gynecologist",
    "Urologist",
    "Ophthalmologist",
    "ENT Specialist",
    "Gastroenterologist",
    "Pulmonologist",
    "Rheumatologist",
    "Oncologist",
    "Pediatrician",
    "Geriatrician",
    "Physical Therapist",
    "Nutritionist",
    "Other"
  ];

  const addDoctor = () => {
    if (newDoctor.name && newDoctor.specialty) {
      const updatedDoctors = [...doctors, { ...newDoctor }];
      updateFormData("careTeam", updatedDoctors);
      setNewDoctor({
        name: "",
        specialty: "",
        phone: "",
        email: "",
        clinic: "",
        notes: ""
      });
    }
  };

  const removeDoctor = (index: number) => {
    const updatedDoctors = doctors.filter((_: any, i: number) => i !== index);
    updateFormData("careTeam", updatedDoctors);
  };

  const updateDoctor = (index: number, field: keyof Doctor, value: string) => {
    const updatedDoctors = doctors.map((doc: Doctor, i: number) => 
      i === index ? { ...doc, [field]: value } : doc
    );
    updateFormData("careTeam", updatedDoctors);
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Stethoscope size={20} />
            Your Care Team
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add your doctors and healthcare providers to keep track of your care team
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Doctors */}
          {doctors.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Your Healthcare Providers</h3>
              {doctors.map((doctor: Doctor, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Dr. {doctor.name}
                      </h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        {doctor.specialty}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDoctor(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Phone</Label>
                      <Input
                        value={doctor.phone || ""}
                        onChange={(e) => updateDoctor(index, "phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Email</Label>
                      <Input
                        value={doctor.email || ""}
                        onChange={(e) => updateDoctor(index, "email", e.target.value)}
                        placeholder="doctor@clinic.com"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Clinic/Hospital</Label>
                      <Input
                        value={doctor.clinic || ""}
                        onChange={(e) => updateDoctor(index, "clinic", e.target.value)}
                        placeholder="e.g., City Medical Center"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Notes</Label>
                      <Textarea
                        value={doctor.notes || ""}
                        onChange={(e) => updateDoctor(index, "notes", e.target.value)}
                        placeholder="Any additional notes about this provider"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Doctor */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <UserPlus size={18} />
              Add Healthcare Provider
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doc-name">Doctor's Name *</Label>
                <Input
                  id="doc-name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  placeholder="e.g., Smith"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="doc-specialty">Specialty *</Label>
                <Select
                  value={newDoctor.specialty}
                  onValueChange={(value) => setNewDoctor({...newDoctor, specialty: value})}
                >
                  <SelectTrigger className="focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="doc-phone">Phone</Label>
                <Input
                  id="doc-phone"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="doc-email">Email</Label>
                <Input
                  id="doc-email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                  placeholder="doctor@clinic.com"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="doc-clinic">Clinic/Hospital</Label>
                <Input
                  id="doc-clinic"
                  value={newDoctor.clinic}
                  onChange={(e) => setNewDoctor({...newDoctor, clinic: e.target.value})}
                  placeholder="e.g., City Medical Center"
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="doc-notes">Notes</Label>
              <Textarea
                id="doc-notes"
                value={newDoctor.notes}
                onChange={(e) => setNewDoctor({...newDoctor, notes: e.target.value})}
                placeholder="Any additional notes about this provider"
                className="focus:border-orange-500 focus:ring-orange-500"
                rows={2}
              />
            </div>
            <Button
              onClick={addDoctor}
              disabled={!newDoctor.name || !newDoctor.specialty}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              Add Provider
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}