import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";

interface Medication {
  name: string;
  qty: string;
  dosage: string;
  status: string;
  time: string;
}

interface MedicationScheduleProps {
  filteredMedications: Medication[];
  handleTake: (index: number) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({
  filteredMedications,
  handleTake,
  statusFilter,
  onStatusChange,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleTakeMedication = (index: number) => {
    setLoadingIndex(index);
    
    // Call the parent's handleTake function to update the medication status
    handleTake(index);
    
    // Show success message
    const medication = filteredMedications[index];
    setSuccessMessage(`${medication.name} successfully taken!`);
    
    // Clear loading state after a short delay
    setTimeout(() => {
      setLoadingIndex(null);
      setSuccessMessage(null);
    }, 1500);
  };

  return (
    <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-[420px]">
      <Card className="w-full h-full flex flex-col shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between pb-2 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl break-words">Medication Schedule</CardTitle>
            <div className="relative">
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                  <SelectItem value="Taken">Taken</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-3 pb-3">
          <div className="w-full h-full space-y-0.5">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground pb-1 border-b">
              <div className="col-span-2 sm:col-span-1">Medication</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-1 hidden sm:block">Dosage</div>
              <div className="col-span-1 hidden sm:block">Status</div>
              <div className="col-span-1 text-center">Time</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Medication Rows - Compact spacing */}
            {filteredMedications.map((med, idx) => {
              const isLoading = loadingIndex === idx;
              return (
                <div key={med.name + idx} className="grid grid-cols-6 gap-2 items-center py-1 hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="col-span-2 sm:col-span-1 font-medium text-xs break-words">
                    <div>{med.name}</div>
                    <div className="text-xs text-muted-foreground sm:hidden">{med.dosage}</div>
                  </div>
                  <div className="col-span-1 text-center text-xs">{med.qty}</div>
                  <div className="col-span-1 hidden sm:block text-xs">{med.dosage}</div>
                  <div className="col-span-1 hidden sm:block">
                    <Badge
                      variant={
                        med.status === "Missed"
                          ? "destructive"
                          : med.status === "Taken"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {med.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-center">
                    {med.status === "Upcoming" ? (
                      <Icons.clock size={16} className="text-yellow-700 mx-auto" />
                    ) : (
                      <span className="text-xs">{med.time}</span>
                    )}
                  </div>
                  <div className="col-span-1 text-center">
                    {med.status === "Taken" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full text-xs px-2 py-0.5 w-full sm:w-auto"
                        disabled
                      >
                        Taken
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="rounded-full bg-black text-white hover:bg-gray-700 text-xs px-5 py-1 w-full sm:w-auto"
                        onClick={() => handleTakeMedication(idx)}
                        disabled={isLoading}
                        style={{ borderRadius: "9999px" }}
                      >
                        {isLoading ? "Taking..." : "Take"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        {/* Success Toast */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
            {successMessage}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicationSchedule;
