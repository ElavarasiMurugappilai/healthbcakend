import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    time: '',
    instructions: ''
  });
  const [toast, setToast] = useState('');

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.dosage || !newMedication.time) {
      setToast('Please fill in all required fields');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      time: newMedication.time,
      instructions: newMedication.instructions,
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true
    };
    onAddMedication(medication);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      time: '',
      instructions: ''
    });
    setShowAddModal(false);
    setToast('Medication added successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-card text-card-foreground rounded-xl p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Track daily medicines and dosage</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" className="w-full mt-4 sm:w-auto sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[400px] w-full max-w-md border">
            <h2 className="text-xl font-bold mb-4">Add New Medication</h2>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Medication Name *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., Metformin"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dosage *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., 500mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select 
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time(s) *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., 08:00, 20:00"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instructions</label>
                <textarea
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  placeholder="e.g., Take with food"
                  rows={3}
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Medication
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </>
  );
};

export default Medication; 