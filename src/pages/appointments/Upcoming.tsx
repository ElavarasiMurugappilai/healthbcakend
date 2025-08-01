
import React from "react";

interface Appointment {
  id: number;
  doctor: string;
  date: string;
  time: string;
  telehealth: boolean;
  status: string;
}

interface UpcomingProps {
  upcoming: Appointment[];
  handleJoin: (id: number) => void;
  handleReschedule: (id: number) => void;
  handleCancel: (id: number) => void;
}

const Upcoming: React.FC<UpcomingProps> = ({ upcoming, handleJoin, handleReschedule, handleCancel }) => (
  <div className="bg-card rounded-lg shadow p-4 
  ">
    <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
    {upcoming.length === 0 ? (
      <div className="text-muted-foreground">No upcoming appointments.</div>
    ) : (
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed min-w-[600px]">
          <colgroup>
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
            <col className="min-w-[120px] w-1/5" />
          </colgroup>
          <thead>
            <tr>
              <th className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap sticky left-0 bg-card z-10">Doctor</th>
              <th className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">Date</th>
              <th className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">Time</th>
              <th className="text-left px-4 py-2 w-1/5 text-sm whitespace-nowrap">Telehealth</th>
              <th className="text-left px-8 py-2 w-1/5 text-sm whitespace-nowrap text- whitespace-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(appt => (
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
                <td className="text-left px-4 py-2 w-1/5 text-xs whitespace-nowrap">
                  <div className="flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-2">
                    {appt.telehealth && (
                      <button
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 active:scale-95 transition-transform"
                        onClick={() => handleJoin(appt.id)}
                      >
                        Join
                      </button>
                    )}
                    <button
                      className="bg-yellow-400 text-black text-xs px-2 py-1 rounded hover:bg-yellow-500 active:scale-95 transition-transform"
                      onClick={() => handleReschedule(appt.id)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 active:scale-95 transition-transform"
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default Upcoming; 