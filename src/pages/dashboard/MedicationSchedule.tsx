import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

  const handleTakeMedication = (index: number) => {
    handleTake(index);
    const medication = filteredMedications[index];
    setSuccessMessage(`${medication.name} successfully taken!`);
    setTimeout(() => setSuccessMessage(null), 1000);
  };

  return (
    <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-[420px]">
      <Card className="w-full h-full min-h-[420px] flex flex-col shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
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

        <CardContent className="flex-1 px-3 pb-3 overflow-y-auto scrollbar-hide">
          <div className="w-full h-full">
            <table className="w-full text-xs sm:text-sm table-fixed">
              <colgroup>
                <col className="w-[25%] sm:w-[28%] md:w-[30%]" />
                <col className="w-[10%] sm:w-[10%] md:w-[8%]" />
                <col className="w-[20%] sm:w-[18%] md:w-[16%]" />
                <col className="hidden sm:table-column sm:w-[12%] md:w-[14%]" />
                <col className="w-[20%] sm:w-[20%] md:w-[18%]" />
                <col className="w-[25%] sm:w-[14%] md:w-[16%]" />
              </colgroup>

              <thead className="sticky top-0 bg-white dark:bg-zinc-800 z-10 dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
                <tr className="text-muted-foreground border-b">
                  <th className="text-left py-2 px-1 text-xs">Medication</th>
                  <th className="text-center py-2 px-1 text-xs">Qty</th>
                  <th className="text-left py-2 px-1 text-xs">Dosage</th>
                  <th className="hidden sm:table-cell text-left py-2 px-1 text-xs">Status</th>
                  <th className="text-center py-2 px-1 text-xs">Time</th>
                  <th className="text-center py-2 px-1 text-xs">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedications.map((med, idx) => {
                  return (
                    <motion.tr
                      key={med.name + idx}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-t align-middle hover:bg-accent transition-colors"
                    >
                      <td className="py-3 px-2 text-left font-medium text-xs">{med.name}</td>
                      <td className="py-3 px-1 text-center text-xs">{med.qty}</td>
                      <td className="py-3 px-1 text-left text-xs">{med.dosage}</td>
                      <td className="py-3 px-1 text-left hidden sm:table-cell">
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
                      </td>
                      <td className="py-3 px-1 text-center">
                        {med.status === "Upcoming" ? (
                          <Icons.clock size={16} className="text-yellow-700 mx-auto" />
                        ) : (
                          med.time
                        )}
                      </td>
                      <td className="py-3 px-1 text-right">
                        {med.status === "Taken" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full text-xs px-3 py-1 w-full sm:w-auto"
                            disabled
                          >
                            Taken
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="rounded-full bg-black text-white hover:bg-gray-700 text-xs px-3 py-1 w-full sm:w-auto"
                            onClick={() => handleTakeMedication(idx)}
                          >
                            Take
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
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
