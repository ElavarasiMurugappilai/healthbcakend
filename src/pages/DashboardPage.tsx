  import React, { useState } from "react";
import { useDateStore } from "@/store/useDateStore";
import Welcome from "./dashboard/Welcome";
import Fitness from "./dashboard/Fitness";
import BloodGlucose from "./dashboard/BloodGlucose";
import MyCareTeam from "./dashboard/MyCareTeam";
import MedicationSchedule from "./dashboard/MedicationSchedule";
import { Cloud } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="font-semibold text-gray-800 mb-1">Time: {label}:00</div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-700">Today: <span className="font-bold">{payload[0].value}</span></span>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-200" />
            <span className="text-gray-700">Yesterday: <span className="font-bold">{payload[1].value}</span></span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom bar shape with cloud icon for selected bars
const CustomBar = (props: any) => {
  const { x, y, width, height, payload, fill } = props;
  const barRadius = width / 2; // fully rounded
  // Responsive cloud size: smaller on small screens
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
  const isMediumScreen = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
  const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 1024;
  
  // More granular responsive sizing
  const cloudRadius = isSmallScreen ? 8 : isMediumScreen ? 12 : 16;
  const cloudIconSize = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;
  const cloudYOffset = isSmallScreen ? 6 : isMediumScreen ? 10 : 14;
  const cloudY = y - 32;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={barRadius} fill={fill} />
      {[10, 14, 18].includes(payload.time) && (
        <g>
          <circle cx={x + width / 2} cy={cloudY + cloudYOffset} r={cloudRadius} fill="#e5e7eb" />
          <foreignObject x={x + width / 2 - cloudIconSize / 2} y={cloudY + cloudYOffset - cloudIconSize / 2} width={cloudIconSize} height={cloudIconSize}>
            <Cloud size={cloudIconSize} color="#b0c4de" />
          </foreignObject>
        </g>
      )}
    </g>
  );
};

type SectionKey = "careTeam" | "fitnessGoals" | "glucoseTrends" | "medicationSchedule";

interface DashboardPageProps {
  user: { name: string; email: string; avatar: string };
  medications: any[];
  careTeam: any[];
  searchValue: string;
  visibleSections: any;
  selectedDate: string;
  setShowFitnessModal: (show: boolean) => void;
  setShowScheduleModal: (show: boolean) => void;
  setShowCareTeamModal: (show: boolean) => void;
  setSelectedMember: (member: any) => void;
  handleTake: (index: number) => void;
  handleSectionToggle: (section: SectionKey) => void;
  width: number;
  showScheduleModal: boolean;
}
const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  // Remove any local user state
  // const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const { user, medications: initialMedications, careTeam: initialCareTeam, searchValue: initialSearchValue, visibleSections, setShowFitnessModal, setShowScheduleModal, setShowCareTeamModal, setSelectedMember, width, showScheduleModal } = props;
  const [medications, setMedications] = useState([
    { name: "Metformin", qty: "1 ", dosage: "500 mg", status: "Missed", time: "12:30" },
    { name: "Omega 3", qty: "3 ", dosage: "800 mg", status: "Taken", time: "08:00" },
    { name: "Levothyroxine", qty: "2 ", dosage: "50 mg", status: "Upcoming", time: "18:00" },
    { name: "Aspirin", qty: "1 ", dosage: "100 mg", status: "Taken", time: "09:00" },
    { name: "Atorvastatin", qty: "1 ", dosage: "20 mg", status: "Upcoming", time: "21:00" },
    
  ]);
  const [careTeam, setCareTeam] = useState([
    {
      name: "Zain Curtis",
      role: "Endocrinologist",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      badge: 2,
      unread: true,
      messages: [
        "Your next appointment is on Friday at 10am.",
        "Please remember to update your glucose log."
      ]
    },
    {
      name: "Dr. John Doe",
      role: "General Practitioner",
      img: "https://randomuser.me/api/portraits/men/35.jpg",
      badge: 1,
      unread: true,
      messages: [
        "Your next appointment is on Thurs at 10am.",
        
      ]
    },
    { name: "Phillip Workman", role: "Neurologist", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Cheyenne Herwitz", role: "Cardiologist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Ava Patel", role: "General Physician", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Sophia Lee", role: "Nutritionist", img: "https://randomuser.me/api/portraits/women/50.jpg" },
    
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState('any');
  
 
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', reason: '' });
  const [toast, setToast] = useState("");
  // const width = window.innerWidth; // This line is removed as width is now a prop

  const glucoseData = [
    { time: 8, today: 60, yesterday: 40 },
    { time: 10, today: 120, yesterday: 100 },
    { time: 12, today: 70, yesterday: 80 },
    { time: 14, today: 60, yesterday: 80 },
    { time: 16, today: 110, yesterday: 100 },
    { time: 18, today: 80, yesterday: 70 },
    { time: 20, today: 60, yesterday: 60 },
  ];

  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;

  const filteredMedications = medications.filter(
    med =>
      (statusFilter === 'any' || med.status === statusFilter) &&
      (med.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchValue.toLowerCase()) ||
      med.status.toLowerCase().includes(searchValue.toLowerCase()) ||
      med.time.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const filteredCareTeam = careTeam.filter(
    member =>
      member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    setToast('Visit scheduled successfully!');
    setTimeout(() => setToast(''), 2000);
    setScheduleForm({ date: '', time: '', reason: '' }); // Reset form
  };

  const handleTake = (index: number) => {
    setMedications(prevMeds => prevMeds.map((med, i) =>
      i === index ? { ...med, status: 'Taken' } : med
    ));
  };

  // Global selectedDate from Zustand store
  const selectedDate = useDateStore(state => state.selectedDate);
  // You can now use selectedDate anywhere in this component or pass it to children as needed.

  return (
    <>
      <Welcome user={user} setShowScheduleModal={setShowScheduleModal} />
      {/* Fitness Goals and Blood Glucose Trends */}
      <section className="flex flex-col w-10 lg:flex-row gap-2 mb-2 w-full">
        {visibleSections.fitnessGoals && (
          <Fitness setShowFitnessModal={setShowFitnessModal} />
        )}
        {visibleSections.glucoseTrends && (
          <BloodGlucose glucoseData={glucoseData} barSize={barSize} CustomTooltip={CustomTooltip} CustomBar={CustomBar} />
        )}
      </section>
      {/* My Care Team and Medication Schedule */}
      <section className="flex flex-col lg:flex-row gap-2 w-full mb-6">
        {visibleSections.careTeam && (
          <MyCareTeam filteredCareTeam={filteredCareTeam} setSelectedMember={setSelectedMember} setShowCareTeamModal={setShowCareTeamModal} />
        )}
        {visibleSections.medicationSchedule && (
          <MedicationSchedule
            filteredMedications={filteredMedications}
            handleTake={handleTake}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        )}
      </section>
      {/* Bottom spacing to ensure page is fully visible */}
      <div className="h-4"></div>
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card text-card-foreground rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs border"
            >
              <div className="font-bold text-lg mb-2">Schedule a Visit</div>
              <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3">
                <label className="flex flex-col text-sm">
                  Date
                  <input
                    type="date"
                    className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Time
                  <input
                    type="time"
                    className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Reason
                  <input
                    type="text"
                    className="mt-1 border rounded px-2 py-1 bg-background text-foreground"
                    placeholder="Reason for visit"
                    value={scheduleForm.reason}
                    onChange={e => setScheduleForm(f => ({ ...f, reason: e.target.value }))}
                    required
                  />
                </label>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 hover:-translate-y-1 transition-all duration-200"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast message */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </>
  );
};

export default DashboardPage; 