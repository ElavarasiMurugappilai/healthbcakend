import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DoctorSelectionStepProps {
  formData: any;
  updateFormData: (key: string, value: any) => void;
}

type Doctor = {
  name: string;
  role: string;
  img: string;
};

export default function DoctorSelectionStep({ formData, updateFormData }: DoctorSelectionStepProps) {
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(formData.selectedDoctors || []);

  const doctors: Doctor[] = [
    { name: "Dr. Smith", role: "General Physician", img: "https://ui-avatars.com/api/?name=Dr+Smith" },
    { name: "Dr. Lee", role: "Cardiologist", img: "https://ui-avatars.com/api/?name=Dr+Lee" },
    { name: "Dr. Patel", role: "Endocrinologist", img: "https://ui-avatars.com/api/?name=Dr+Patel" },
    { name: "Dr. Gomez", role: "Neurologist", img: "https://ui-avatars.com/api/?name=Dr+Gomez" },
    { name: "Dr. Brown", role: "Dermatologist", img: "https://ui-avatars.com/api/?name=Dr+Brown" },
    { name: "Dr. Green", role: "Orthopedist", img: "https://ui-avatars.com/api/?name=Dr+Green" },
    { name: "Dr. White", role: "Psychiatrist", img: "https://ui-avatars.com/api/?name=Dr+White" },
    { name: "Dr. Nancy", role: "Pediatrician", img: "https://ui-avatars.com/api/?name=Dr+Nancy" },
    { name: "Dr. Mike", role: "Oncologist", img: "https://ui-avatars.com/api/?name=Dr+Mike" },
    { name: "Dr. Suba", role: "Gastroenterologist", img: "https://ui-avatars.com/api/?name=Dr+Suba" },
    { name: "Dr. Raayan", role: "Urologist", img: "https://ui-avatars.com/api/?name=Dr+Raayan" },
    { name: "Dr. Kavya", role: "Gynecologist", img: "https://ui-avatars.com/api/?name=Dr+Kavya" },
    { name: "Dr. Nisanth", role: "Ophthalmologist", img: "https://ui-avatars.com/api/?name=Dr+Nisanth" },
    { name: "Dr. Ramana", role: "Pulmonologist", img: "https://ui-avatars.com/api/?name=Dr+Ramana" },
  ];

  const handleDoctorToggle = (doctorName: string) => {
    const newSelectedDoctors = selectedDoctors.includes(doctorName)
      ? selectedDoctors.filter((name) => name !== doctorName)
      : [...selectedDoctors, doctorName];
    
    setSelectedDoctors(newSelectedDoctors);
    
    // Update the formData with selected doctors
    updateFormData("selectedDoctors", newSelectedDoctors);
    
    // Create careTeam array from selected doctors
    const careTeam = doctors
      .filter((doctor) => newSelectedDoctors.includes(doctor.name))
      .map((doctor) => ({
        name: doctor.name,
        role: doctor.role,
        img: doctor.img,
        badge: 0,
        unread: false,
        messages: [],
      }));
    
    updateFormData("careTeam", careTeam);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Select Your Care Team</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose the specialists you want to include in your care team
        </p>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {doctors.map((doctor) => (
          <div
            key={doctor.name}
            className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Checkbox
              id={`doctor-${doctor.name}`}
              checked={selectedDoctors.includes(doctor.name)}
              onCheckedChange={() => handleDoctorToggle(doctor.name)}
            />
            <div className="flex items-center space-x-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={doctor.img} alt={doctor.name} />
                <AvatarFallback>{doctor.name.split(" ")[0][0]}{doctor.name.split(" ")[1][0]}</AvatarFallback>
              </Avatar>
              <Label
                htmlFor={`doctor-${doctor.name}`}
                className="flex flex-col cursor-pointer"
              >
                <span className="font-medium">{doctor.name}</span>
                <span className="text-xs text-gray-500">{doctor.role}</span>
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}