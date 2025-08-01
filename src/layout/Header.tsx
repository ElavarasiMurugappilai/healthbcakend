import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  CalendarDays,
  Sun,
  Moon,
  Clock,
  Activity,
  Pill,
  User,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Logo = () => (
  <div className="font-bold text-xl flex items-center gap-2">{/* increased gap from 2 to 4 */}
    <span className="bg-orange-500 rounded-full w-6 h-6 inline-block" /> ARMED
  </div>
);

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setShowCustomizeModal: (show: boolean) => void;
  setShowDateModal: (show: boolean) => void;
  showCustomizeModal: boolean;
  visibleSections: {
    fitnessGoals: boolean;
    glucoseTrends: boolean;
    careTeam: boolean;
    medicationSchedule: boolean;
  };
  handleSectionToggle: (section: "fitnessGoals" | "glucoseTrends" | "careTeam" | "medicationSchedule") => void;
  setToast: (message: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  searchValue,
  setSearchValue,
  selectedDate,
  setSelectedDate,
  setShowCustomizeModal,
  setShowDateModal,
  showCustomizeModal,
  visibleSections,
  handleSectionToggle,
  setToast,
}) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [dashboardView, setDashboardView] = useState<"today" | "week" | "custom">("today");
  const [showTodaySummary, setShowTodaySummary] = useState(false);

  // Sample data for today's summary
  const glucoseData = [
    { time: "6AM", value: 85 },
    { time: "9AM", value: 120 },
    { time: "12PM", value: 95 },
    { time: "3PM", value: 110 },
    { time: "6PM", value: 88 },
    { time: "9PM", value: 92 },
  ];

  const todayMedications = [
    { name: "Metformin", time: "8:00 AM", status: "Taken", dosage: "500mg" },
    { name: "Omega 3", time: "9:00 AM", status: "Taken", dosage: "800mg" },
    { name: "Levothyroxine", time: "6:00 PM", status: "Upcoming", dosage: "50mg" },
    { name: "Atorvastatin", time: "9:00 PM", status: "Upcoming", dosage: "20mg" },
  ];

  const todayAppointments = [
    { doctor: "Dr. Sarah Johnson", time: "2:00 PM", type: "Follow-up", specialty: "Endocrinologist" },
    { doctor: "Dr. Michael Chen", time: "4:30 PM", type: "Consultation", specialty: "Cardiologist" },
  ];

  const fitnessData = {
    steps: 8420,
    target: 10000,
    calories: 320,
    workouts: 2,
    targetWorkouts: 3,
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (selectedDate !== today) {
      setSelectedDate(today);
      setToast('Dashboard refreshed to show today\'s data 📅');
    } else {
      setToast('Already viewing today\'s data ✅');
    }
    setShowTodaySummary(true);
  };

  return (
    <header className="flex items-center justify-between px-4 pb-2 md:px-8 py-4 bg-gray-200 dark:bg-[#18181b] sticky top-0 z-20">
      <div className="flex items-center gap-4 md:gap-8">
        <button
          className="md:hidden mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open sidebar"
        >
          <span className="text-2xl">☰</span>
        </button>
        <Logo />
        {/* Search bar with icon inside and clear button - only on md+ */}
        <div className="hidden md:block relative ml-8 md:ml-16 w-60 md:w-80">
          <Input
            type="text"
            placeholder=" Search "
            className="w-full pl-10 pr-8 h-10 text-base rounded-lg border border-gray-500 focus:ring-2 focus:ring-orange-200"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                alert(`Searching for: ${searchValue}`);
               
                
                // Here you could trigger a real search or navigation
              }

            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          {searchValue && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
              type="button"
            >
              &#10005;
            </button>
          )}
          
        </div>
      </div>
      {/* Header actions only on md+ */}
      <div className="hidden md:flex items-center gap-6">
        {location.pathname === '/dashboard' && (
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setShowCustomizeModal(true)}
          >
            <LayoutDashboard size={18} />
            Customize Dashboard
          </Button>
        )}
        <button
          className={`text-sm flex items-center gap-1 px-2 py-1 rounded transition ${
            selectedDate === new Date().toISOString().slice(0, 10) 
              ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400' 
              : 'text-muted-foreground hover:bg-accent'
          }`}
          onClick={handleTodayClick}
        >
          <CalendarDays size={16} />
          {selectedDate === new Date().toISOString().slice(0, 10) ? 'Today' : selectedDate}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center justify-center"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark'  : 'light'}  mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
      </div>

      {/* Today's Summary Modal */}
      <Dialog open={showTodaySummary} onOpenChange={setShowTodaySummary}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="text-orange-500" size={24} />
              Today's Summary
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Glucose Trend Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="text-blue-500" size={20} />
                <h3 className="font-semibold text-lg">Glucose Trend</h3>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={glucoseData}>
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Medications Due Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <Pill className="text-green-500" size={20} />
                <h3 className="font-semibold text-lg">Medications Due</h3>
              </div>
              <div className="space-y-2">
                {todayMedications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-500" />
                      <div>
                        <div className="font-medium text-sm">{med.name}</div>
                        <div className="text-xs text-gray-500">{med.dosage}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{med.time}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        med.status === 'Taken' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {med.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Appointments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <User className="text-purple-500" size={20} />
                <h3 className="font-semibold text-lg">Appointments</h3>
              </div>
              <div className="space-y-2">
                {todayAppointments.map((apt, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <div className="font-medium text-sm">{apt.doctor}</div>
                      <div className="text-xs text-gray-500">{apt.specialty} • {apt.type}</div>
                    </div>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{apt.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fitness Status Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="text-orange-500" size={20} />
                <h3 className="font-semibold text-lg">Fitness Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                        strokeDasharray={`${(fitnessData.steps / fitnessData.target) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{Math.round((fitnessData.steps / fitnessData.target) * 100)}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Steps</div>
                  <div className="text-xs text-gray-500">{fitnessData.steps.toLocaleString()} / {fitnessData.target.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray={`${(fitnessData.workouts / fitnessData.targetWorkouts) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{Math.round((fitnessData.workouts / fitnessData.targetWorkouts) * 100)}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Workouts</div>
                  <div className="text-xs text-gray-500">{fitnessData.workouts} / {fitnessData.targetWorkouts}</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Calories burned: <span className="font-medium text-orange-600">{fitnessData.calories}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-[320px] w-full max-w-xs border">
            <div className="font-bold text-lg mb-2">Customize Dashboard</div>
            <div className="flex flex-col gap-3">
              <label>
                <input type="checkbox" checked={visibleSections.fitnessGoals} onChange={() => handleSectionToggle("fitnessGoals")} />
                Fitness Goals
              </label>
              <label>
                <input type="checkbox" checked={visibleSections.glucoseTrends} onChange={() => handleSectionToggle("glucoseTrends")} />
                Blood Glucose Trends
              </label>
              <label>
                <input type="checkbox" checked={visibleSections.careTeam} onChange={() => handleSectionToggle("careTeam")} />
                My Care Team
              </label>
              <label>
                <input type="checkbox" checked={visibleSections.medicationSchedule} onChange={() => handleSectionToggle("medicationSchedule")} />
                Medication Schedule
              </label>
              <button onClick={() => setShowCustomizeModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      
    </header>
  );
};

export default Header; 