import React from "react";

interface BookProps {
  setShowForm: (show: boolean) => void;
  setApptRescheduleId: (id: number | null) => void;
}

const Book: React.FC<BookProps> = ({ setShowForm, setApptRescheduleId }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <h1 className="text-2xl font-bold">Appointments</h1>
    <button className="bg-primary text-primary-foreground px-4 py-2 rounded shadow hover:bg-primary/90" onClick={() => { setShowForm(true); setApptRescheduleId(null); }}>Book New Appointment</button>
  </div>
);

export default Book; 