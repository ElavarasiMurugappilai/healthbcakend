import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FitnessDetailsModalProps {
  onClose: () => void;
  open: boolean;
}

const FitnessDetailsModal = ({ onClose, open }: FitnessDetailsModalProps) => {
  const [completed, setCompleted] = useState(4);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fitness Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>More details about your fitness goals will go here.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              className="flex-1"
              onClick={e => {
                e.stopPropagation();
                if (completed < 5) {
                  setCompleted(completed + 1);
                  alert("Workout marked as complete!"); // Replace with toast if you have one
                }
              }}
            >
              Complete 5 Workouts <span className="ml-2">{completed}/5</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FitnessDetailsModal;
