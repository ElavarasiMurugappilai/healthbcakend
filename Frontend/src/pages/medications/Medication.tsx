import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
};

interface MedicationHeaderProps {
  onAddMedication: (med: Medication) => void;
}

const Medication: React.FC<MedicationHeaderProps> = ({ onAddMedication }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState("");
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'startDate' | 'isActive'>>({
    name: "",
    dosage: "",
    frequency: "Once daily",
    time: "",
    instructions: "",
  });

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const medication: Medication = {
      ...newMedication,
      id: Date.now().toString(),
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true,
    };
    onAddMedication(medication);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "Once daily",
      time: "",
      instructions: "",
    });
    setShowAddModal(false);
    setToast("Medication added successfully!");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-card text-card-foreground rounded-xl p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Track daily medicines and dosage</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" className="w-full mt-4 sm:w-auto sm:mt-0">
                      <Icons.plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Add Medication Modal - Using shadcn Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicationName">Medication Name *</Label>
              <Input
                id="medicationName"
                type="text"
                placeholder="e.g., Metformin"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                type="text"
                placeholder="e.g., 500mg"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time(s) *</Label>
              <Input
                id="time"
                type="text"
                placeholder="e.g., 08:00, 20:00"
                value={newMedication.time}
                onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <textarea
                id="instructions"
                className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                placeholder="e.g., Take with food"
                value={newMedication.instructions}
                onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Medication</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </>
  );
};

export default Medication; 