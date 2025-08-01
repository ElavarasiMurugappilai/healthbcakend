import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  History as HistoryIcon,
  Pill,
  Zap,
  Calendar,
  TrendingUp,
  Droplets,
  Activity,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import History from "./medications/History";


type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
};

type MedicationLog = {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
};

interface MedicationsPageProps {
  searchValue: string;
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ searchValue }) => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: '08:00, 20:00',
      instructions: 'Take with food',
      startDate: '2024-01-15',
      isActive: true
    },
    {
      id: '2',
      name: 'Omega 3',
      dosage: '1000mg',
      frequency: 'Once daily',
      time: '09:00',
      instructions: 'Take with breakfast',
      startDate: '2024-01-10',
      isActive: true
    },
    {
      id: '3',
      name: 'Levothyroxine',
      dosage: '50mcg',
      frequency: 'Once daily',
      time: '07:00',
      instructions: 'Take on empty stomach',
      startDate: '2024-01-01',
      isActive: true
    }
  ]);

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    {
      id: '1',
      medicationId: '1',
      date: '2024-01-20',
      time: '08:00',
      status: 'taken',
      notes: 'Taken with breakfast'
    },
    {
      id: '2',
      medicationId: '1',
      date: '2024-01-20',
      time: '20:00',
      status: 'missed'
    },
    {
      id: '3',
      medicationId: '2',
      date: '2024-01-20',
      time: '09:00',
      status: 'taken'
    },
    {
      id: '4',
      medicationId: '2',
      date: '2024-01-20',
      time: '09:00',
      status: 'taken'
    },
    {
      id: '5',
      medicationId: '2',
      date: '2024-01-20',
      time: '09:00',
      status: 'taken'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'add'>('today');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    time: '',
    instructions: ''
  });
  const [toast, setToast] = useState('');

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchValue.toLowerCase()) ||
    med.frequency.toLowerCase().includes(searchValue.toLowerCase()) ||
    med.instructions.toLowerCase().includes(searchValue.toLowerCase())
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = medicationLogs.filter(log => log.date === today);

  const getTodayMedications = () => {
    return filteredMedications.filter(med => med.isActive).map(med => {
      const times = med.time.split(', ');
      const todayLogsForMed = todayLogs.filter(log => log.medicationId === med.id);
      
      return times.map(time => ({
        ...med,
        time,
        status: todayLogsForMed.find(log => log.time === time)?.status || 'pending'
      }));
    }).flat();
  };

  const handleTakeMedication = (medicationId: string, time: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      date: today,
      time,
      status: 'taken',
      notes: 'Taken on time'
    };
    setMedicationLogs(prev => [...prev, newLog]);
  };

  const handleSkipMedication = (medicationId: string, time: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      date: today,
      time,
      status: 'skipped',
      notes: 'Skipped by user'
    };
    setMedicationLogs(prev => [...prev, newLog]);
    setToast('Medication marked as skipped');
    setTimeout(() => setToast(''), 3000);
  };

  const handleMissedMedication = (medicationId: string, time: string) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      date: today,
      time,
      status: 'missed',
      notes: 'Missed dose'
    };
    setMedicationLogs(prev => [...prev, newLog]);
    setToast('Medication marked as missed');
    setTimeout(() => setToast(''), 3000);
  };

  const handleMarkAllAsTaken = () => {
    const pendingMeds = getTodayMedications().filter(med => med.status === 'pending');
    pendingMeds.forEach(med => {
      handleTakeMedication(med.id, med.time);
    });
    setToast('All medications marked as taken!');
    setTimeout(() => setToast(''), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken':
        return 'Taken';
      case 'missed':
        return 'Missed';
      case 'skipped':
        return 'Skipped';
      default:
        return 'Pending';
    }
  };

  // Get medication-specific icon
  const getMedicationIcon = (medicationName: string) => {
    const name = medicationName.toLowerCase();
    if (name.includes('metformin')) {
      return <Pill className="w-8 h-8 text-blue-600" />;
    } else if (name.includes('omega') || name.includes('fish')) {
      return <Droplets className="w-8 h-8 text-orange-500" />;
    } else if (name.includes('levothyroxine') || name.includes('thyroid')) {
      return <Activity className="w-8 h-8 text-purple-600" />;
    } else {
      return <Pill className="w-8 h-8 text-gray-600" />;
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.dosage || !newMedication.time) {
      setToast('Please fill in all required fields');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      time: newMedication.time,
      instructions: newMedication.instructions,
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true
    };

    setMedications(prev => [...prev, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      time: '',
      instructions: ''
    });
    setShowAddModal(false);
    setToast('Medication added successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const todayMeds = getTodayMedications();
  const totalMeds = todayMeds.length;
  const takenMeds = todayMeds.filter(med => med.status === 'taken').length;
  const missedMeds = todayMeds.filter(med => med.status === 'missed').length;
  const pendingMeds = todayMeds.filter(med => med.status === 'pending').length;

  // Group medications by time for timeline
  const timelineData = todayMeds.reduce((acc, med) => {
    const time = med.time;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(med);
    return acc;
  }, {} as Record<string, typeof todayMeds>);

  const sortedTimes = Object.keys(timelineData).sort();

  return (
    <div className="space-y-6 bg-transparent dark:bg-gray-900 min-h-screen p-3 sm:p-6 overflow-x-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
        className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 sm:gap-4 bg-white dark:bg-gray-800 text-card-foreground rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words">Medications</h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base break-words">Track daily medicines and dosage</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          variant="default" 
          className="w-full mt-4 sm:w-auto sm:mt-0 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl my-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
            activeTab === 'today' 
              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg transform scale-105' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Today's Medications
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
            activeTab === 'history' 
              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg transform scale-105' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <HistoryIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
          History
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'today' && (
          <motion.div
            key="today"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
            className="space-y-4 sm:space-y-6 overflow-x-hidden"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Today's Medications</h2>
            
            {/* Enhanced Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ willChange: "transform" }}
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-blue-600 rounded-full opacity-10 transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8"></div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <Pill className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{totalMeds}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Total Today</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{totalMeds}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ willChange: "transform" }}
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-10 transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8"></div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{takenMeds}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Taken</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{takenMeds}</p>
                    {totalMeds > 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 sm:h-2 mt-1 sm:mt-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-1 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(takenMeds / totalMeds) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ willChange: "transform" }}
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-10 transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8"></div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{missedMeds}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Missed</p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">{missedMeds}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ willChange: "transform" }}
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-10 transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8"></div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{pendingMeds}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Pending</p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingMeds}</p>
                  </div>
                </div>
              </motion.div>
              </div>

            {/* Mark All as Taken Button */}
            {pendingMeds > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                className="flex justify-center mb-4 sm:mb-6"
              >
                <Button
                  onClick={handleMarkAllAsTaken}
                  className="bg-blue-600 dark:bg-blue-500 text-white shadow-lg transform hover:scale-105 transition-all duration-300 text-sm hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Mark All as Taken
                </Button>
              </motion.div>
            )}

            

            {/* Enhanced Medication Cards Grid */}
                        <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">All Medications</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                {todayMeds.map((med, index) => (
                  <motion.div
                    key={`${med.id}-${med.time}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex"
                  >
                    {/* Left side - Medication content */}
                    <div className="flex-1">
                    {/* Status Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        med.status === 'taken' ? 'bg-green-100 text-green-700' :
                        med.status === 'missed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700 animate-pulse'
                      }`}>
                        {getStatusText(med.status)}
                      </span>
                    </div>

                    {/* Medication Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1 truncate text-left">{med.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 truncate text-left">{med.dosage} • {med.time}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate text-left">{med.instructions}</p>
                      </div>
                    </div>
                    

                    {/* Action Buttons */}
                        {med.status === 'pending' && (
                      <div className="flex space-x-1 sm:space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{ willChange: "transform" }}
                              onClick={() => handleTakeMedication(med.id, med.time)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-2 sm:px-4 rounded-lg font-medium shadow-lg transition-all duration-300 text-xs sm:text-sm"
                            >
                              Take
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{ willChange: "transform" }}
                              onClick={() => handleSkipMedication(med.id, med.time)}
                          className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm"
                            >
                              Skip
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{ willChange: "transform" }}
                              onClick={() => handleMissedMedication(med.id, med.time)}
                          className="flex-1 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm"
                            >
                              Missed
                        </motion.button>
                          </div>
                        )}


                    {med.status !== 'pending' && (
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(med.status)}
                        <span className={`text-xs sm:text-sm font-medium ${
                          med.status === 'taken' ? 'text-green-600' :
                          med.status === 'missed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {getStatusText(med.status)}
                        </span>
                      </div>
                    )}
                    </div>
                    
                    {/* Right side - Medication-specific icon */}
                    <div className="flex items-center justify-center ml-4 sm:ml-6">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-3 sm:p-4 border border-blue-100">
                        {getMedicationIcon(med.name)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs border border-white/20 overflow-x-hidden"
          >
            <History 
              medicationLogs={medicationLogs}
              medications={medications}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
            />
          </motion.div>
        )}
      </AnimatePresence>
      

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 style">
          <div className="bg-card text-card-foreground rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-md border max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Add New Medication</h2>
            <form onSubmit={handleAddMedication} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Medication Name *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                  placeholder="e.g., Metformin"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dosage *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                  placeholder="e.g., 500mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select 
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time(s) *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                  placeholder="e.g., 08:00, 20:00"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instructions</label>
                <textarea
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                  placeholder="e.g., Take with food"
                  rows={3}
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 text-sm"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 text-sm">
                  Add Medication
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg z-50 text-sm"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default MedicationsPage; 