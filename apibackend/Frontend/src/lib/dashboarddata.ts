// portfolio/src/lib/dashboardData.ts
export function getDashboardDataByDate(date: string) {
    // Example: return different data for different dates
    if (date === "2024-07-01") {
      return {
        fitness: { percent: 60, completed: 3, total: 5 },
        glucose: [
          { time: 8, today: 80, yesterday: 70 },
          { time: 10, today: 100, yesterday: 90 },
          { time: 12, today: 120, yesterday: 110 },
          { time: 14, today: 90, yesterday: 100 },
          { time: 16, today: 110, yesterday: 100 },
          { time: 18, today: 100, yesterday: 90 },
          { time: 20, today: 80, yesterday: 80 },
        ],
        medications: [
          { name: "Metformin", qty: "1 pill", dosage: "500 mg", status: "Missed", time: "12:30" },
          { name: "Omega 3", qty: "3 pills", dosage: "800 mg", status: "Taken", time: "08:00" },
        ],
        careTeam: [
          { name: "Zain Curtis", role: "Endocrinologist", img: "https://randomuser.me/api/portraits/men/32.jpg" },
          { name: "Ava Patel", role: "General Physician", img: "https://randomuser.me/api/portraits/women/68.jpg" },
        ],
      };
    }
    // Default/today's data
    return {
      fitness: { percent: 80, completed: 4, total: 5 },
      glucose: [
        { time: 8, today: 60, yesterday: 40 },
        { time: 10, today: 120, yesterday: 100 },
        { time: 12, today: 70, yesterday: 80 },
        { time: 14, today: 60, yesterday: 80 },
        { time: 16, today: 110, yesterday: 100 },
        { time: 18, today: 80, yesterday: 70 },
        { time: 20, today: 60, yesterday: 60 },
      ],
      medications: [
        { name: "Metformin", qty: "1 pill", dosage: "500 mg", status: "Missed", time: "12:30" },
        { name: "Omega 3", qty: "3 pills", dosage: "800 mg", status: "Taken", time: "08:00" },
        { name: "Levothyroxine", qty: "2 pills", dosage: "50 mg", status: "Upcoming", time: "18:00" },
      ],
      careTeam: [
        { name: "Zain Curtis", role: "Endocrinologist", img: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Ava Patel", role: "General Physician", img: "https://randomuser.me/api/portraits/women/68.jpg" },
      ],
    };
  }


