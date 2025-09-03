import React, { useEffect, useState } from "react";
import API from "../../api"; // <-- Your authenticated Axios instance
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";

interface Medication {
  _id: string;
  name: string;
  qty: string;
  dosage: string;
  status: string;
  time: string;
}

interface MedicationScheduleProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({
  statusFilter,
  onStatusChange,
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch medications from backend
  const fetchMedications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/medications/schedule");
      if (res.data.success) {
        setMedications(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch medications");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching medications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  // Filter medications by status
  const filteredMedications = statusFilter === "any"
    ? medications
    : medications.filter(med => med.status === statusFilter);

  // Handle marking medication as Taken
  const handleTakeMedication = async (index: number) => {
    const medication = filteredMedications[index];
    setLoadingIndex(index);

    try {
      const res = await API.patch(`/medications/${medication._id}/status`, { status: "Taken" });
      if (res.data.success) {
        setSuccessMessage(`${medication.name} successfully taken!`);
        toast.success(res.data.message || "Medication marked as taken");
        await fetchMedications(); // Refetch to update UI
      } else {
        toast.error(res.data.message || "Failed to update medication");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating medication");
    } finally {
      setLoadingIndex(null);
      setTimeout(() => setSuccessMessage(null), 1500);
    }
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
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredMedications.length === 0 ? (
              <div className="text-center py-8">No medications found.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Dosage</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map((med, idx) => (
                    <tr key={med._id}>
                      <td>{med.name}</td>
                      <td>{med.qty}</td>
                      <td>{med.dosage}</td>
                      <td>{med.status}</td>
                      <td>{med.time}</td>
                      <td>
                        {med.status === "Upcoming" && (
                          <button
                            className="btn btn-primary"
                            disabled={loadingIndex === idx}
                            onClick={() => handleTakeMedication(idx)}
                          >
                            {loadingIndex === idx ? "Taking..." : "Take"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>

        {/* Success Toast */}
        {successMessage && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow">
            {successMessage}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicationSchedule;
