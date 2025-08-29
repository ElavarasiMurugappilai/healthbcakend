import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import API from "@/api";
import { toast } from "sonner";

interface FitnessLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSuccess: () => void;
}

const FitnessLogger: React.FC<FitnessLoggerProps> = ({ isOpen, onClose, onLogSuccess }) => {
  const [formData, setFormData] = useState({
    steps: "",
    calories: "",
    workoutMinutes: "",
    waterIntake: "",
    workoutType: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const logData = {
        steps: parseInt(formData.steps) || 0,
        calories: parseInt(formData.calories) || 0,
        workoutMinutes: parseInt(formData.workoutMinutes) || 0,
        waterIntake: parseInt(formData.waterIntake) || 0,
        workoutType: formData.workoutType || undefined,
        notes: formData.notes || undefined
      };

      await API.post("/fitness/log", logData);
      
      toast.success("Activity logged successfully! 🎉");
      setFormData({
        steps: "",
        calories: "",
        workoutMinutes: "",
        waterIntake: "",
        workoutType: "",
        notes: ""
      });
      onLogSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error logging activity:", error);
      toast.error(error.response?.data?.message || "Failed to log activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Log Your Activity 📊
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steps">Steps 👣</Label>
              <Input
                id="steps"
                type="number"
                placeholder="e.g., 5000"
                value={formData.steps}
                onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calories">Calories 🔥</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g., 300"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workoutMinutes">Workout (min) ⏱️</Label>
              <Input
                id="workoutMinutes"
                type="number"
                placeholder="e.g., 30"
                value={formData.workoutMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, workoutMinutes: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waterIntake">Water (ml) 💧</Label>
              <Input
                id="waterIntake"
                type="number"
                placeholder="e.g., 500"
                value={formData.waterIntake}
                onChange={(e) => setFormData(prev => ({ ...prev, waterIntake: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workoutType">Workout Type (optional)</Label>
            <Input
              id="workoutType"
              type="text"
              placeholder="e.g., Running, Gym, Yoga"
              value={formData.workoutType}
              onChange={(e) => setFormData(prev => ({ ...prev, workoutType: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              type="text"
              placeholder="How did you feel?"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? "Logging..." : "Log Activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FitnessLogger;
