
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dummy data
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const allAppointments = [
  { id: 1, date: `${yyyy}-${mm}-05`, doctor: "Dr. Smith", mode: "In-person", time: "10:00", status: "Completed" },
  { id: 2, date: `${yyyy}-${mm}-05`, doctor: "Dr. Lee", mode: "Telehealth", time: "14:00", status: "Upcoming" },
  { id: 3, date: `${yyyy}-${mm}-10`, doctor: "Dr. Patel", mode: "In-person", time: "09:00", status: "Upcoming" },
  { id: 15, date: `${yyyy}-${mm}-10`, doctor: "Dr. Lee", mode: "Telehealth", time: "14:00", status: "Upcoming" },
  { id: 16, date: `${yyyy}-${mm}-10`, doctor: "Dr. Patel", mode: "In-person", time: "09:00", status: "Upcoming" },
  { id: 4, date: `${yyyy}-${mm}-15`, doctor: "Dr. Gomez", mode: "Telehealth", time: "11:00", status: "No-Show" },
  { id: 5, date: `${yyyy}-${mm}-20`, doctor: "Dr. Brown", mode: "In-person", time: "13:00", status: "Completed" },
  { id: 6, date: `${yyyy}-${mm}-25`, doctor: "Dr. Green", mode: "Telehealth", time: "16:00", status: "Upcoming" },
  { id: 7, date: `${yyyy}-${mm}-28`, doctor: "Dr. White", mode: "In-person", time: "08:30", status: "Upcoming" },
  { id: 8, date: `${yyyy}-${mm}-16`, doctor: "Dr. Nancy", mode: "Telehealth", time: "08:30", status: "Upcoming" },
  { id: 9, date: `${yyyy}-${mm}-17`, doctor: "Dr. Mike", mode: "In-person", time: "08:30", status: "Upcoming" },
  { id: 10, date: `${yyyy}-${mm}-18`, doctor: "Dr. suba", mode: "In-person", time: "08:30", status: "Upcoming" },
  { id: 11, date: `${yyyy}-${mm}-08`, doctor: "Dr. Raayan", mode: "Telehealth", time: "08:30", status: "Upcoming" },
  { id: 12, date: `${yyyy}-${mm}-22`, doctor: "Dr. Kavya", mode: "In-person", time: "08:30", status: "Upcoming" },
  { id: 13, date: `${yyyy}-${mm}-24`, doctor: "Dr. Nisanth", mode: "Telehealth", time: "08:30", status: "Completed" },
  { id: 14, date: `${yyyy}-${mm}-22`, doctor: "Dr. Ramana", mode: "Telehealth", time: "08:30", status: "Upcoming" },
];

const appointmentTypes = ["All", "In-person", "Telehealth"];

type Appointment = {
  id: number | string;
  date: string;
  doctor: string;
  mode: string;
  time: string;
  status: string;
  isDefault?: boolean;
};

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < value) {
        start += Math.ceil(value / 30);
        setDisplay(Math.min(start, value));
        setTimeout(step, 20);
      }
    };
    step();
    // eslint-disable-next-line
  }, [value]);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="p-2 sm:p-3 text-center rounded-xl bg-white shadow dark:bg-gradient-to-r from-gray-800 to-zinc-800"
    >
      <div className="text-xs text-gray-500">{label}</div>
      <motion.div 
        className={`text-lg sm:text-xl font-bold ${color || ""}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ willChange: "transform" }}
      >
        {display}
      </motion.div>
    </motion.div>
  );
}

const Calendar = ({
  selectedDate,
  onDateSelect,
  month,
  year,
  appointments,
  filterType,
  onMonthChange,
}: {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  month: number;
  year: number;
  appointments: Appointment[];
  filterType: string;
  onMonthChange: (dir: "prev" | "next") => void;
}) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);

  const hasAppointments = (day: number) =>
    appointments.some(a => {
      const d = new Date(a.date);
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year &&
        (filterType === "All" || a.mode === filterType)
      );
    });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="dark:bg-gradient-to-r from-gray-800 to-zinc-800 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-2 sm:mb-3 dark:bg-gradient-to-r from-gray-800 to-zinc-800">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ willChange: "transform" }}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => onMonthChange("prev")}
        >
          ←
        </motion.button>
        <motion.div 
          key={`${month}-${year}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="text-xs sm:text-sm font-semibold"
        >
          {new Date(year, month).toLocaleString("default", { month: "short" })} {year}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ willChange: "transform" }}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => onMonthChange("next")}
        >
          →
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs font-semibold mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.2, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="py-1"
          >
            {d}
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1">
        {Array(firstDay.getDay()).fill(null).map((_, i) => <div key={"empty" + i} />)}
        {days.map((day, index) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          return (
            <motion.button
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.01, 
                duration: 0.2, 
                ease: "easeOut" 
              }}
              whileHover={{ 
                scale: 1.1, 
                y: -2,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1, ease: "easeOut" }
              }}
              style={{ willChange: "transform, opacity" }}
              onClick={() => onDateSelect(dateStr)}
              className={`aspect-square w-full max-w-8 sm:max-w-9 h-8 sm:h-9 flex items-center justify-center transition-all duration-200 text-xs sm:text-sm
                ${isSelected ? "bg-blue-500 text-white shadow-lg" : "hover:bg-blue-100 dark:hover:bg-blue-900/50"}
                ${hasAppointments(day) ? "font-bold border-2 border-blue-400" : ""}
              `}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// Enhanced button style helpers with smoother animations
const subtleButton =
  "transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02] hover:bg-muted/80 focus:bg-muted/80";
const subtleDanger =
  "transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02] hover:bg-red-600/90 focus:bg-red-600/90";
const subtlePrimary =
  "transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02] hover:bg-blue-600/90 focus:bg-blue-600/90";

function BookingModal({ open, onClose, onBook }: { open: boolean; onClose: () => void; onBook: (appt: Appointment) => void }) {
  const [form, setForm] = useState({ doctor: "", date: "", time: "", mode: "In-person" });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg md:max-w-xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-4 sm:px-6 py-4 sm:py-5 rounded-t-lg"
          >
            <DialogTitle className="text-lg sm:text-xl font-bold text-white m-0">
              Book New Appointment
            </DialogTitle>
          </motion.div>

          {/* Form Content */}
          <motion.div 
            className="p-4 sm:p-6 space-y-4 sm:space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Doctor Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Doctor Name *
              </label>
              <select 
                value={form.doctor} 
                onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="">Select a doctor</option>
                <option value="Dr. Smith">Dr. Smith - General Physician</option>
                <option value="Dr. Lee">Dr. Lee - Cardiologist</option>
                <option value="Dr. Patel">Dr. Patel - Endocrinologist</option>
                <option value="Dr. Gomez">Dr. Gomez - Neurologist</option>
                <option value="Dr. Brown">Dr. Brown - Dermatologist</option>
                <option value="Dr. Green">Dr. Green - Orthopedist</option>
                <option value="Dr. White">Dr. White - Psychiatrist</option>
                <option value="Dr. Nancy">Dr. Nancy - Pediatrician</option>
                <option value="Dr. Mike">Dr. Mike - Oncologist</option>
                <option value="Dr. Suba">Dr. Suba - Gastroenterologist</option>
                <option value="Dr. Raayan">Dr. Raayan - Urologist</option>
                <option value="Dr. Kavya">Dr. Kavya - Gynecologist</option>
                <option value="Dr. Nisanth">Dr. Nisanth - Ophthalmologist</option>
                <option value="Dr. Ramana">Dr. Ramana - Pulmonologist</option>
              </select>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Date *
              </label>
              <Input 
                type="date" 
                value={form.date} 
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Time *
              </label>
              <Input 
                type="time" 
                value={form.time} 
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type
              </label>
              <select 
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
                value={form.mode} 
                onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}
              >
                <option value="In-person">In-person</option>
                <option value="Telehealth">Telehealth</option>
            </select>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="flex-1 py-2.5 text-sm sm:text-base border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onBook({ ...form, id: Date.now(), status: "Upcoming" } as Appointment);
                  onClose();
                }}
                disabled={!form.doctor || !form.date || !form.time}
                className="flex-1 py-2.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Book Appointment
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function RescheduleModal({ 
  open, 
  onClose, 
  appointment, 
  onReschedule 
}: { 
  open: boolean; 
  onClose: () => void; 
  appointment: Appointment; 
  onReschedule: (appt: Appointment) => void; 
}) {
  const [form, setForm] = useState({ 
    doctor: appointment.doctor, 
    date: appointment.date, 
    time: appointment.time, 
    mode: appointment.mode 
  });

  // Update form when appointment changes
  useEffect(() => {
    setForm({
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      mode: appointment.mode
    });
  }, [appointment]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-xs sm:max-w-sm md:max-w-md p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 px-3 sm:px-4 py-2 sm:py-3 rounded-t-lg"
          >
            <DialogTitle className="text-base sm:text-lg font-bold text-white m-0">
              Reschedule Appointment
            </DialogTitle>
          </motion.div>

          {/* Current Appointment Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="bg-gray-50 dark:bg-gray-700 px-2 sm:px-3 py-2 border-b border-gray-200 dark:border-gray-600"
          >
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Current Appointment:
            </div>
            <div className="bg-white dark:bg-gray-600 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                    {appointment.doctor}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {appointment.mode}
                  </div>
                </div>
                <div className="text-xs font-mono text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-500 px-1.5 py-0.5 rounded-md">
                  {appointment.time}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {appointment.date}
              </div>
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div 
            className="p-4 sm:p-6 space-y-4 sm:space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Doctor Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Doctor Name *
              </label>
              <select 
                value={form.doctor} 
                onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="">Select a doctor</option>
                <option value="Dr. Smith">Dr. Smith - General Physician</option>
                <option value="Dr. Lee">Dr. Lee - Cardiologist</option>
                <option value="Dr. Patel">Dr. Patel - Endocrinologist</option>
                <option value="Dr. Gomez">Dr. Gomez - Neurologist</option>
                <option value="Dr. Brown">Dr. Brown - Dermatologist</option>
                <option value="Dr. Green">Dr. Green - Orthopedist</option>
                <option value="Dr. White">Dr. White - Psychiatrist</option>
                <option value="Dr. Nancy">Dr. Nancy - Pediatrician</option>
                <option value="Dr. Mike">Dr. Mike - Oncologist</option>
                <option value="Dr. Suba">Dr. Suba - Gastroenterologist</option>
                <option value="Dr. Raayan">Dr. Raayan - Urologist</option>
                <option value="Dr. Kavya">Dr. Kavya - Gynecologist</option>
                <option value="Dr. Nisanth">Dr. Nisanth - Ophthalmologist</option>
                <option value="Dr. Ramana">Dr. Ramana - Pulmonologist</option>
              </select>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Appointment Date *
              </label>
              <Input 
                type="date" 
                value={form.date} 
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Appointment Time *
              </label>
              <Input 
                type="time" 
                value={form.time} 
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type
              </label>
              <select 
                className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
                value={form.mode} 
                onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}
              >
                <option value="In-person">In-person</option>
                <option value="Telehealth">Telehealth</option>
              </select>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-2 sm:gap-3 pt-1 sm:pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="flex-1 py-2 text-xs sm:text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onReschedule({ ...appointment, ...form });
                }}
                disabled={!form.doctor || !form.date || !form.time}
                className="flex-1 py-2 text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Reschedule
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function HistoryModal({ open, onClose, history }: { open: boolean; onClose: () => void; history: Appointment[] }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg md:max-w-xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-4 sm:px-6 py-4 sm:py-5 rounded-t-lg"
          >
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl font-bold text-white m-0">
                Appointment History
              </DialogTitle>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.div 
              className="max-h-80 overflow-y-auto space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            {history.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                  <div className="text-sm sm:text-base">
                No past appointments.
                  </div>
              </motion.div>
            ) : (
              history.map((a, index) => (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05, 
                    duration: 0.3, 
                    ease: "easeOut" 
                  }}
                  style={{ willChange: "transform, opacity" }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          {a.doctor}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {a.date} • {a.mode}
                        </div>
                      </div>
                      <div className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-full ${
                        a.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : 
                        a.status === "No-Show" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : 
                        "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                      }`}>
                        {a.status}
                      </div>
                  </div>
                </motion.div>
              ))
            )}
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

interface AppointmentsPageProps {
  searchValue: string;
}

export default function AppointmentPage({ searchValue }: AppointmentsPageProps) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [appointments, setAppointments] = useState<Appointment[]>(allAppointments);
  const [selectedDate, setSelectedDate] = useState(`${today.getFullYear()}-07-10`);
  const [filterType, setFilterType] = useState("All");
  const [showBookModal, setShowBookModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReschedule, setShowReschedule] = useState<Appointment | null>(null);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const stats = {
    total: appointments.filter(a => a.status === "Upcoming").length,
    completed: completedCount,
    noShows: appointments.filter(a => a.status === "No-Show").length,
    cancelled: cancelledCount,
  };

  const handleCancel = (id: number | string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    if (typeof id === 'number') {
      setCancelledCount(c => c + 1);
    }
  };

  const handleJoin = (appt: Appointment) => {
    if (!appt.isDefault) {
      setAppointments(prev => prev.filter(a => a.id !== appt.id));
      alert(`Joining telehealth session with ${appt.doctor} at ${appt.time}`);
      setCompletedCount(c => c + 1);
    }
  };

  const handleComplete = (appt: Appointment) => {
    if (!appt.isDefault) {
      setAppointments(prev => prev.filter(a => a.id !== appt.id));
      setCompletedCount(c => c + 1);
    }
  };

  const handleMonthChange = (dir: "prev" | "next") => {
    const newMonth = dir === "prev" ? month - 1 : month + 1;
    if (newMonth < 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else if (newMonth > 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(newMonth);
    }
  };

  const filteredAppointments = appointments.filter(
    a =>
      a.date === selectedDate &&
      (filterType === "All" || a.mode === filterType) &&
      (
        a.doctor.toLowerCase().includes(searchValue.toLowerCase()) ||
        a.mode.toLowerCase().includes(searchValue.toLowerCase()) ||
        a.status.toLowerCase().includes(searchValue.toLowerCase()) ||
        a.time.toLowerCase().includes(searchValue.toLowerCase())
      )
  );

  // Default appointments for empty days
  const defaultAppointments = [
    {
      id: 'default-1',
      doctor: 'Dr. Smith - General Physician',
      mode: 'In-person',
      time: '09:00',
      status: 'Available',
      date: selectedDate,
      isDefault: true
    },
    {
      id: 'default-2', 
      doctor: 'Dr. Lee - Cardiologist',
      mode: 'Telehealth',
      time: '14:00',
      status: 'Available',
      date: selectedDate,
      isDefault: true
    },
    {
      id: 'default-3',
      doctor: 'Dr. Patel - Endocrinologist', 
      mode: 'In-person',
      time: '16:30',
      status: 'Available',
      date: selectedDate,
      isDefault: true
    }
  ];

  // Check if selected date has any appointments (boxed dates)
  const hasAppointmentsOnDate = appointments.some(a => {
    const d = new Date(a.date);
    const selected = new Date(selectedDate);
    return (
      d.getDate() === selected.getDate() &&
      d.getMonth() === selected.getMonth() &&
      d.getFullYear() === selected.getFullYear() &&
      (filterType === "All" || a.mode === filterType)
    );
  });

  // Show default appointments only for boxed dates, otherwise show "No appointments"
  const appointmentsToShow = hasAppointmentsOnDate && filteredAppointments.length === 0 
    ? defaultAppointments 
    : filteredAppointments;

  // Split appointments into upcoming and history
  const history = appointments.filter(a => ["Completed", "No-Show", "Cancelled"].includes(a.status));
  const upcoming = appointments.filter(a => a.status === "Upcoming");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full h-full p-2 sm:p-4 md:p-6 min-h-screen"
    >
      {/* Left Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
        className="w-full lg:w-1/2 xl:w-2/5 flex flex-col"
      >
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-2 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
        >
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Completed" value={stats.completed} color="text-green-600" />
          <StatCard label="Cancelled" value={stats.cancelled} color="text-red-500" />
        </motion.div>
        {/* Filters */}
        <motion.div 
          className="flex gap-1 sm:gap-2 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
        >
          {appointmentTypes.map((type, index) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3 + index * 0.05, 
                duration: 0.3, 
                ease: "easeOut" 
              }}
              style={{ willChange: "transform, opacity" }}
            >
              <Button
                size="sm"
                variant={filterType === type ? "secondary" : "ghost"}
                onClick={() => setFilterType(type)}
                className={`${subtleButton} text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2`}
              >
                {type}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="flex-1"
        >
          <Card className="p-3 sm:p-4 h-full dark:bg-gradient-to-r from-gray-800 to-zinc-800 flex flex-col">
            <div className="flex-1">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              month={month}
              year={year}
              appointments={appointments}
              filterType={filterType}
              onMonthChange={handleMonthChange}
            />
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Right Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
        className="w-full lg:w-1/2 xl:w-3/5 flex flex-col"
      >
        <Card className="p-3 sm:p-4 h-full dark:bg-gradient-to-r from-gray-800 to-zinc-800 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                Appointments on{" "}
                <span className="font-mono text-blue-600">{selectedDate}</span>
              </CardTitle>
            </CardHeader>
          </motion.div>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {appointmentsToShow.length === 0 ? (
                <motion.div
                  key="no-appointments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-gray-400 dark:text-gray-500 text-center py-8 sm:py-12 flex-1 flex items-center justify-center"
                >
                  <div className="text-sm sm:text-base">
                    No appointments for this date.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ willChange: "opacity" }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="flex-1 space-y-2 sm:space-y-3 pr-2">
                  {appointmentsToShow.map((appt, index) => (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3, 
                        ease: "easeOut" 
                      }}
                      style={{ willChange: "transform, opacity" }}
                        className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                      >
                        {/* Top Row - Doctor Info and Time */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white break-words leading-tight text-left">
                              {appt.doctor}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 text-left">
                              {appt.mode}
                            </div>
                          </div>
                          <div className="text-xs font-mono text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded-md flex-shrink-0">
                            {appt.time}
                          </div>
                      </div>
                        
                        {/* Bottom Row - Action Buttons */}
                        <div className="flex flex-wrap gap-1">
                        {appt.isDefault ? (
                          // Default appointment - show Book Now button
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{ willChange: "transform" }}
                            className="flex-1 min-w-0"
                          >
                            <Button 
                              size="sm" 
                              variant="default" 
                              onClick={() => setShowBookModal(true)} 
                              className={`${subtlePrimary} w-full text-xs px-2 py-1 h-7 sm:h-8`}
                            >
                              Book Now
                            </Button>
                          </motion.div>
                        ) : (
                          // Real appointment - show regular actions
                          <>
                          {appt.mode === "Telehealth" && appt.status === "Upcoming" && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              style={{ willChange: "transform" }}
                              className="flex-1 min-w-0"
                            >
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => handleJoin(appt)} 
                                className={`${subtlePrimary} w-full text-xs px-2 py-1 h-7 sm:h-8`}
                              >
                                Join
                              </Button>
                            </motion.div>
                          )}
                          {appt.mode === "In-person" && appt.status === "Upcoming" && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              style={{ willChange: "transform" }}
                              className="flex-1 min-w-0"
                            >
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => handleComplete(appt)} 
                                className={`${subtlePrimary} w-full text-xs px-2 py-1 h-7 sm:h-8`}
                              >
                                Completed
                              </Button>
                            </motion.div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{ willChange: "transform" }}
                            className="flex-1 min-w-0"
                          >
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => setShowReschedule(appt)} 
                              className={`${subtleButton} w-full text-xs px-2 py-1 h-7 sm:h-8`}
                            >
                              Reschedule
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{ willChange: "transform" }}
                            className="flex-1 min-w-0"
                          >
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleCancel(appt.id)} 
                              className={`${subtleDanger} w-full text-xs px-2 py-1 h-7 sm:h-8`}
                            >
                              Cancel
                            </Button>
                          </motion.div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <BookingModal open={showBookModal} onClose={() => setShowBookModal(false)} onBook={appt => setAppointments(prev => [...prev, appt])} />
      <HistoryModal open={showHistoryModal} onClose={() => setShowHistoryModal(false)} history={history} />
      {showReschedule && (
        <RescheduleModal
          open={!!showReschedule}
          onClose={() => setShowReschedule(null)}
          appointment={showReschedule}
          onReschedule={appt => {
            setAppointments(prev => prev.map(a => a.id === showReschedule.id ? { ...a, ...appt } : a));
            setShowReschedule(null);
          }}
        />
      )}
      
      {/* Floating Action Button (FAB) */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.1, 
          y: -2,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1, ease: "easeOut" }
        }}
        style={{ willChange: "transform, opacity" }}
        onClick={() => setShowBookModal(true)}
        aria-label="Schedule new appointment"
        title="Schedule new appointment"
      >
        <CalendarPlus className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>
    </motion.div>
  );
}
