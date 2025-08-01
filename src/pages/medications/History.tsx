import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Clock, Pill, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryProps {
  medicationLogs: any[];
  medications: any[];
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
}

const History: React.FC<HistoryProps> = ({ medicationLogs, medications, getStatusIcon, getStatusText }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  // Comprehensive sample data for different dates with various statuses
  const enhancedMedicationLogs = [
    // July 2025 - Current month data
    { id: '1', medicationId: '1', date: '2025-07-29', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '2', medicationId: '1', date: '2025-07-29', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '3', medicationId: '2', date: '2025-07-29', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '4', medicationId: '3', date: '2025-07-29', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '5', medicationId: '1', date: '2025-07-28', time: '08:00', status: 'missed', notes: 'Forgot to take' },
    { id: '6', medicationId: '1', date: '2025-07-28', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '7', medicationId: '2', date: '2025-07-28', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '8', medicationId: '3', date: '2025-07-28', time: '07:00', status: 'skipped', notes: 'Skipped by user' },
    
    { id: '9', medicationId: '1', date: '2025-07-27', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '10', medicationId: '1', date: '2025-07-27', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '11', medicationId: '2', date: '2025-07-27', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '12', medicationId: '3', date: '2025-07-27', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '13', medicationId: '1', date: '2025-07-26', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '14', medicationId: '1', date: '2025-07-26', time: '20:00', status: 'missed', notes: 'Missed dose' },
    { id: '15', medicationId: '2', date: '2025-07-26', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '16', medicationId: '3', date: '2025-07-26', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '17', medicationId: '1', date: '2025-07-25', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '18', medicationId: '1', date: '2025-07-25', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '19', medicationId: '2', date: '2025-07-25', time: '09:00', status: 'skipped', notes: 'Skipped by user' },
    { id: '20', medicationId: '3', date: '2025-07-25', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '21', medicationId: '1', date: '2025-07-24', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '22', medicationId: '1', date: '2025-07-24', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '23', medicationId: '2', date: '2025-07-24', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '24', medicationId: '3', date: '2025-07-24', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '25', medicationId: '1', date: '2025-07-23', time: '08:00', status: 'missed', notes: 'Forgot to take' },
    { id: '26', medicationId: '1', date: '2025-07-23', time: '20:00', status: 'missed', notes: 'Missed dose' },
    { id: '27', medicationId: '2', date: '2025-07-23', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '28', medicationId: '3', date: '2025-07-23', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '29', medicationId: '1', date: '2025-07-22', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '30', medicationId: '1', date: '2025-07-22', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '31', medicationId: '2', date: '2025-07-22', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '32', medicationId: '3', date: '2025-07-22', time: '07:00', status: 'skipped', notes: 'Skipped by user' },
    
    { id: '33', medicationId: '1', date: '2025-07-21', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '34', medicationId: '1', date: '2025-07-21', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '35', medicationId: '2', date: '2025-07-21', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '36', medicationId: '3', date: '2025-07-21', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    // June 2025 data
    { id: '37', medicationId: '1', date: '2025-06-30', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '38', medicationId: '1', date: '2025-06-30', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '39', medicationId: '2', date: '2025-06-30', time: '09:00', status: 'missed', notes: 'Forgot to take' },
    { id: '40', medicationId: '3', date: '2025-06-30', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '41', medicationId: '1', date: '2025-06-29', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '42', medicationId: '1', date: '2025-06-29', time: '20:00', status: 'skipped', notes: 'Skipped by user' },
    { id: '43', medicationId: '2', date: '2025-06-29', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '44', medicationId: '3', date: '2025-06-29', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    // August 2025 data
    { id: '45', medicationId: '1', date: '2025-08-01', time: '08:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '46', medicationId: '1', date: '2025-08-01', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '47', medicationId: '2', date: '2025-08-01', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '48', medicationId: '3', date: '2025-08-01', time: '07:00', status: 'taken', notes: 'Taken on empty stomach' },
    
    { id: '49', medicationId: '1', date: '2025-08-02', time: '08:00', status: 'missed', notes: 'Forgot to take' },
    { id: '50', medicationId: '1', date: '2025-08-02', time: '20:00', status: 'taken', notes: 'Taken with dinner' },
    { id: '51', medicationId: '2', date: '2025-08-02', time: '09:00', status: 'taken', notes: 'Taken with breakfast' },
    { id: '52', medicationId: '3', date: '2025-08-02', time: '07:00', status: 'skipped', notes: 'Skipped by user' }
  ];
  
  // Use enhanced logs instead of original
  const allLogs = [...medicationLogs, ...enhancedMedicationLogs];
  
  // Default medications data if none provided
  const defaultMedications = [
    { id: '1', name: 'Metformin', dosage: '500 mg', instructions: 'Take with meals' },
    { id: '2', name: 'Omega 3', dosage: '800 mg', instructions: 'Take with breakfast' },
    { id: '3', name: 'Levothyroxine', dosage: '50 mg', instructions: 'Take on empty stomach' },
    { id: '4', name: 'Aspirin', dosage: '100 mg', instructions: 'Take with food' },
    { id: '5', name: 'Atorvastatin', dosage: '20 mg', instructions: 'Take in the evening' }
  ];
  
  const medicationsToUse = medications.length > 0 ? medications : defaultMedications;
  
  // Get unique dates from logs
  const uniqueDates = [...new Set(allLogs.map(log => log.date))].sort().reverse();
  
  // Filter logs by selected date
  let filteredLogs = allLogs.filter(log => log.date === selectedDate);
  
  // Check if the selected date has any actual history (dotted dates)
  const hasHistory = filteredLogs.length > 0;
  
  // If no logs for selected date, don't create default entries - show "no history" message
  if (filteredLogs.length === 0) {
    filteredLogs = []; // Empty array to show no history
  }
  
  // Get calendar data for the current month
  const currentDate = new Date(currentYear, currentMonth, 1);
  
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  };

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const dayLogs = allLogs.filter(log => log.date === dateStr);
    
    if (dayLogs.length === 0) return 'none';
    if (dayLogs.every(log => log.status === 'taken')) return 'all-taken';
    if (dayLogs.some(log => log.status === 'missed')) return 'missed';
    return 'partial';
  };

  const getEnhancedStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const CompactTimelineView = () => (
    <div className="relative w-full h-[400px] overflow-y-auto">
      {hasHistory ? (
        <div className="space-y-3 pr-2">
          {filteredLogs.map((log, index) => {
            const medication = medicationsToUse.find((med: any) => med.id === log.medicationId);
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.03,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                style={{ willChange: "transform, opacity" }}
                className="relative flex items-start space-x-3 w-full"
              >
                {/* Timeline Node */}
                <motion.div 
                  className="relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{ willChange: "transform" }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                    log.status === 'taken' ? 'bg-green-500' :
                    log.status === 'missed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}>
                    <Pill className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
                
                {/* Compact Content Card */}
                <motion.div
                  whileHover={{ 
                    scale: 1.01, 
                    y: -1,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
                  }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ willChange: "transform" }}
                  className="flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate text-left">{medication?.name}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-300 mt-1">
                        <span>🕒 {log.time}</span>
                      </div>
                    </div>
                    <motion.div 
                      className="flex items-center space-x-1 flex-shrink-0"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={{ willChange: "transform" }}
                    >
                      {getEnhancedStatusIcon(log.status)}
                      <span className={`text-xs font-medium ${
                        log.status === 'taken' ? 'text-green-600 dark:text-green-400' :
                        log.status === 'missed' ? 'text-red-600 dark:text-red-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {getStatusText(log.status)}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-10 sm:w-10 sm:h-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
                No History Available
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xs">
                No medication history found for this date
              
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  const EditableCalendarWidget = () => (
    <Card className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={() => handleMonthChange('prev')}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="text-xs sm:text-sm font-medium bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2024, i).toLocaleDateString('en-US', { month: 'short' })}
              </option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="text-xs sm:text-sm font-medium bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300"
          >
            {Array.from({ length: 10 }, (_, i) => 2020 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => handleMonthChange('next')}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="space-y-2 sm:space-y-3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 py-1 sm:py-2">
                {day}
              </div>
            ))}
        </div>
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
            {getCalendarDays().map((date, index) => (
              <button
                key={index}
                onClick={() => date && setSelectedDate(date.toISOString().slice(0, 10))}
              className={`aspect-square w-full min-w-0 flex flex-col items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium ${
                date ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                } ${
                  date && date.toISOString().slice(0, 10) === selectedDate 
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg ring-2 ring-blue-300 dark:ring-blue-400' 
                  : date ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600' : 'bg-transparent'
                }`}
              >
              <span className="pt-0.5 sm:pt-1">{date ? date.getDate() : ''}</span>
                {date && (
                <span className={`mt-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full block ${
                    getDateStatus(date) === 'all-taken' ? 'bg-green-500 shadow-sm' :
                    getDateStatus(date) === 'missed' ? 'bg-red-500 shadow-sm' :
                    getDateStatus(date) === 'partial' ? 'bg-yellow-500 shadow-sm' :
                    'bg-transparent'
                  }`}></span>
                )}
              </button>
            ))}
        </div>
      </div>
      
      {/* Calendar Legend */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
       
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6 bg-gray-50 dark:bg-gray-900 min-h-[500px] p-3 sm:p-4 md:p-6 text-gray-900 dark:text-white" style={{ scrollBehavior: "smooth" }}>
      {/* Header */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Medications History</h2>
       
      </div>

                        {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Calendar Section - First on small screens */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                      <div className="h-auto sm:h-[400px]">
                        <EditableCalendarWidget />
                      </div>
                    </div>
                    
                    {/* Timeline Section - Second on small screens */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-[400px] sm:h-[436px] overflow-hidden">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
  Timeline for {(() => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1); // Add one day
    return d.getDate().toString().padStart(2, '0') + '/' +
           (d.getMonth() + 1).toString().padStart(2, '0') + '/' +
           d.getFullYear();
  })()}
</h3>
                        <div>
                          <CompactTimelineView />
                        </div>
                      </div>
                    </div>
                  </div>
    </div>
  );
};

export default History; 