import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/ui/icons";

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
        return <Icons.checkCircle className="w-4 h-4 text-green-500" />;
      case 'missed':
        return <Icons.xCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <Icons.alertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Icons.clock className="w-4 h-4 text-gray-400" />;
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
                    <Icons.pill className="w-3 h-3 text-white" />
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
                      <Badge
                        variant={
                          log.status === 'taken' ? 'default' :
                          log.status === 'missed' ? 'destructive' :
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {getStatusText(log.status)}
                      </Badge>
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
              <Icons.calendar className="w-8 h-10 sm:w-10 sm:h-12 text-gray-400" />
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMonthChange('prev')}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        >
                      <Icons.chevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Select value={currentMonth.toString()} onValueChange={(value) => setCurrentMonth(parseInt(value))}>
            <SelectTrigger className="text-xs sm:text-sm font-medium bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300 w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(2024, i).toLocaleDateString('en-US', { month: 'short' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(parseInt(value))}>
            <SelectTrigger className="text-xs sm:text-sm font-medium bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300 w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMonthChange('next')}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        >
                      <Icons.chevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-muted-foreground text-center py-1">
            {day}
          </div>
        ))}
        {getCalendarDays().map((day, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => day && setSelectedDate(day.toISOString().slice(0, 10))}
            disabled={!day}
            className={`relative p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 h-auto ${
              day
                ? getDateStatus(day) === 'all-taken'
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : getDateStatus(day) === 'missed'
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : getDateStatus(day) === 'partial'
                  ? 'bg-accent/10 text-accent hover:bg-accent/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                : 'text-muted-foreground/50 cursor-not-allowed'
            } ${
              day && selectedDate === day.toISOString().slice(0, 10)
                ? 'ring-2 ring-primary'
                : ''
            }`}
          >
            {day?.getDate()}
            {day && getDateStatus(day) !== 'none' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current opacity-75"></div>
            )}
          </Button>
        ))}
      </div>


    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 ">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Medication History</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Track your medication adherence over time</p>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {['Today', 'Yesterday', 'Last Week', 'Last Month'].map((period, index) => {
            let date = new Date();
            switch (period) {
              case 'Yesterday':
                date.setDate(date.getDate() - 1);
                break;
              case 'Last Week':
                date.setDate(date.getDate() - 7);
                break;
              case 'Last Month':
                date.setMonth(date.getMonth() - 1);
                break;
              default:
                break;
            }
            return (
              <Button
                key={period}
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(date.toISOString().slice(0, 10))}
                className="text-xs px-2 py-1 h-auto"
              >
                {period}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Calendar and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-1">
          <EditableCalendarWidget />
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-2">
          <CompactTimelineView />
        </div>
      </div>
    </div>
  );
};

export default History; 