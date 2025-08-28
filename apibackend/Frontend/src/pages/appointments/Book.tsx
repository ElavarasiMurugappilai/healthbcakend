import React from "react";
import { Button } from "@/components/ui/button";

interface BookProps {
  setShowForm: (show: boolean) => void;
  setApptRescheduleId: (id: number | null) => void;
}

const Book: React.FC<BookProps> = ({ setShowForm, setApptRescheduleId }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <h1 className="text-2xl font-bold">Appointments</h1>
    <Button onClick={() => { setShowForm(true); setApptRescheduleId(null); }}>
      Book New Appointment
    </Button>
  </div>
);

export default Book; 