import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  History as HistoryIcon,
  Pill,
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  <div className="space-y-6 bg-gray-200 min-h-screen p-3 sm:p-6 overflow-x-hidden overflow-y-auto scrollbar-hide">
    {/* Redesigned Header Card */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="w-full bg-card text-card-foreground rounded-2xl p-4 sm:p-6 shadow-lg border border-border flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6"
    >
      {/* Progress Ring and Adherence */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
        {/* Progress Ring SVG */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <svg className="w-20 h-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="#6366f1"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={(2 * Math.PI * 34) * (1 - (takenMeds / (totalMeds || 1)))}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
          </svg>
          <span className="absolute text-xl font-bold text-primary">
            {totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0}%
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Track daily medicines and dosage</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs px-2 py-1 border-primary text-primary bg-primary/10">Taken: {takenMeds}</Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 border-destructive text-destructive bg-destructive/10">Missed: {missedMeds}</Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 border-warning text-warning bg-warning/10">Pending: {pendingMeds}</Badge>
          </div>
        </div>
      </div>
      {/* Next Medication Reminder and Add Button */}
      <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
        {/* Next Medication Reminder */}
        {todayMeds.length > 0 ? (
          <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2 mb-1 w-full md:w-auto">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">
              Next: {(() => {
                const next = todayMeds.find(med => med.status === 'pending');
                return next ? `${next.name} at ${next.time}` : 'All taken!';
              })()}
            </span>
          </div>
        ) : null}
        <Button
          onClick={() => setShowAddModal(true)}
          variant="default"
          className="shadow-lg text-sm w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>
    </motion.div>

      {/* Tabs - Using shadcn Tabs with Compact Responsive Design */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'today' | 'history')} className="w-full">
  <TabsList className="grid w-full grid-cols-2 bg-card p-1 rounded-lg my-4 shadow-md border border-border h-auto min-h-[40px] sm:min-h-[45px] md:min-h-[50px]">
          <TabsTrigger 
            value="today"
            className="py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted data-[state=inactive]:text-muted-foreground data-[state=inactive]:opacity-80 data-[state=active]:scale-[1.01]"
        >
          Today's Medications
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted data-[state=inactive]:text-muted-foreground data-[state=inactive]:opacity-80 data-[state=active]:scale-[1.01]"
        >
          <HistoryIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
          History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 sm:space-y-6 overflow-x-hidden overflow-y-auto scrollbar-hide data-[state=inactive]:hidden data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-left-2 md:data-[state=active]:slide-in-from-left-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Today's Medications</h2>
            {/* Compact, Responsive Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 w-full">
              {/* Total Today */}
              <Card className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-md shadow border border-border min-h-[60px] max-h-[90px] w-full aspect-[4/3]">
                <span className="mb-0.5">
                  <Pill className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">Total Today</span>
                <span className="text-sm sm:text-base font-bold text-primary">{totalMeds}</span>
              </Card>
              {/* Taken */}
              <Card className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-md shadow border border-border min-h-[60px] max-h-[90px] w-full aspect-[4/3]">
                <span className="mb-0.5">
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">Taken</span>
                <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--success)' }}>{takenMeds}</span>
              </Card>
              {/* Missed */}
              <Card className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-md shadow border border-border min-h-[60px] max-h-[90px] w-full aspect-[4/3]">
                <span className="mb-0.5">
                  <XCircle className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">Missed</span>
                <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--destructive)' }}>{missedMeds}</span>
              </Card>
              {/* Pending */}
              <Card className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-md shadow border border-border min-h-[60px] max-h-[90px] w-full aspect-[4/3]">
                <span className="mb-0.5">
                  <Clock className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">Pending</span>
                <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--warning)' }}>{pendingMeds}</span>
              </Card>
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
                  className="bg-primary text-primary-foreground shadow-lg transform hover:scale-105 transition-all duration-300 text-sm hover:bg-primary/80"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Mark All as Taken
                </Button>
              </motion.div>
            )}

            {/* Enhanced Medication Cards Grid */}
                        <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">All Medications</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                {todayMeds.map((med, index) => (
                  <motion.div
                    key={`${med.id}-${med.time}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 flex"
                  >
                    {/* Left side - Medication content */}
                    <div className="flex-1">
                    {/* Status Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <Badge
                        variant={
                          med.status === 'taken' ? 'default' :
                          med.status === 'missed' ? 'destructive' :
                          'secondary'
                        }
                        className={med.status === 'pending' ? 'animate-pulse' : ''}
                      >
                        {getStatusText(med.status)}
                      </Badge>
                    </div>

                    {/* Medication Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-base sm:text-lg text-foreground mb-1 truncate text-left">{med.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate text-left">{med.dosage} • {med.time}</p>
                        <p className="text-xs text-muted-foreground/70 truncate text-left">{med.instructions}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                        {med.status === 'pending' && (
                      <div className="flex space-x-1 sm:space-x-2">
                        <Button
                              onClick={() => handleTakeMedication(med.id, med.time)}
                          className="flex-1 bg-primary text-primary-foreground py-2 px-2 sm:px-4 rounded-lg font-medium shadow-lg transition-all duration-300 text-xs sm:text-sm hover:bg-primary/80"
                            >
                              Take
                        </Button>
                        <Button
                          variant="outline"
                              onClick={() => handleSkipMedication(med.id, med.time)}
                          className="flex-1 bg-card border border-border hover:bg-muted text-muted-foreground py-2 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm"
                            >
                              Skip
                        </Button>
                        <Button
                          variant="outline"
                              onClick={() => handleMissedMedication(med.id, med.time)}
                          className="flex-1 bg-card border border-destructive hover:bg-destructive/10 text-destructive py-2 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm"
                            >
                              Missed
                        </Button>
                          </div>
                        )}

                    {med.status !== 'pending' && (
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(med.status)}
                        <span className={`text-xs sm:text-sm font-medium ${
                          med.status === 'taken' ? 'text-primary' :
                          med.status === 'missed' ? 'text-destructive' :
                          'text-accent'
                        }`}>
                          {getStatusText(med.status)}
                        </span>
                      </div>
                    )}
                    </div>
                    
                    {/* Right side - Medication-specific icon */}
                    <div className="flex items-center justify-center ml-4 sm:ml-6">
                      <div className="bg-muted rounded-full p-3 sm:p-4 border border-border">
                        {getMedicationIcon(med.name)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
        </TabsContent>

  <TabsContent value="history" className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs border border-border/20 overflow-x-hidden overflow-y-auto scrollbar-hide data-[state=inactive]:hidden data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-right-2 md:data-[state=active]:slide-in-from-right-4">
            <History 
              medicationLogs={medicationLogs}
              medications={medications}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
            />
        </TabsContent>
      </Tabs>

      {/* Add Medication Modal - Using shadcn Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicationName">Medication Name *</Label>
              <Input
                id="medicationName"
                  type="text"
                  placeholder="e.g., Metformin"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                  type="text"
                  placeholder="e.g., 500mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
              </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time(s) *</Label>
              <Input
                id="time"
                  type="text"
                  placeholder="e.g., 08:00, 20:00"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
                <textarea
                id="instructions"
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-sm"
                  placeholder="e.g., Take with food"
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
                />
              </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              <Button type="submit">Add Medication</Button>
            </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg z-50 text-sm"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default MedicationsPage; 