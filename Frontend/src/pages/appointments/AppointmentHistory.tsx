import React from "react";

interface Appointment {
  id: number;
  doctor: string;
  date: string;
  time: string;
  telehealth: boolean;
  status: string;
}

interface AppointmentHistoryProps {
  history: Appointment[];
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ history }) => (
  <div className="bg-card rounded-lg shadow p-4 hover:-translate-y-1 transition-all duration-200 ">
    <h2 className="text-lg font-semibold mb-2">Appointment History</h2>
    {history.length === 0 ? <div className="text-muted-foreground">No past appointments.</div> : (
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed min-w-[600px] text-sm">
          <colgroup>
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
          </colgroup>
          <thead>
            <tr>
              <th className="text-left px-4 py-2 w-1/5 text-xs whitespace-nowrap sticky left-0 bg-card z-10">Doctor</th>
              <th className="text-left px-4 py-2 w-1/5 text-xs whitespace-nowrap">Date</th>
              <th className="text-left px-4 py-2 w-1/5 text-xs whitespace-nowrap">Time</th>
              <th className="text-left px-4 py-2 w-1/5 text-xs whitespace-nowrap">Telehealth</th>
              <th className="text-left px-4 py-2 w-1/5 text-xs whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(appt => (
              <tr key={appt.id}>
                <td className="text-left px-4 py-2 w-1/5 sticky left-0 bg-card z-10 text-sm">{appt.doctor}</td>
                <td className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">{appt.date}</td>
                <td className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">{appt.time}</td>
                <td className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">
                  {appt.telehealth ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </td>
                <td className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default AppointmentHistory; 