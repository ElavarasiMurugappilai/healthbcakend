import React, { useState } from "react";
import { useDateStore } from "@/store/useDateStore";
import Welcome from "./dashboard/Welcome";
import Fitness from "./dashboard/Fitness";
import BloodGlucose from "./dashboard/BloodGlucose";
import MyCareTeam from "./dashboard/MyCareTeam";
import MedicationSchedule from "./dashboard/MedicationSchedule";
import { Icons } from "@/components/ui/icons";
import { AnimatePresence, motion } from "framer-motion";

// Import shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";



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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMedications(prevMeds => prevMeds.map((med, i) =>
        i === index ? { ...med, status: 'Taken' } : med
      ));
      setIsLoading(false);
    }, 500);
  };

  // Skeleton loading component
  const DashboardSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="h-80">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="h-80">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="h-80">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Global selectedDate from Zustand store
  const selectedDate = useDateStore(state => state.selectedDate);
  // You can now use selectedDate anywhere in this component or pass it to children as needed.

  return (
    <>
      <Welcome user={user} setShowScheduleModal={setShowScheduleModal} />
      
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Fitness Goals and Blood Glucose Trends */}
          <section className="flex flex-col w-10 lg:flex-row gap-2 mb-2 w-full">
            {visibleSections.fitnessGoals && (
              <Fitness setShowFitnessModal={setShowFitnessModal} />
            )}
            {visibleSections.glucoseTrends && (
                            <BloodGlucose glucoseData={glucoseData} barSize={barSize} />
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
        </>
      )}
      {/* Bottom spacing to ensure page is fully visible */}
      <div className="h-4"></div>

      {/* Schedule Visit Modal - Using shadcn Dialog */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule a Visit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduleForm.date}
                onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduleForm.time}
                onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                type="text"
                placeholder="Reason for visit"
                value={scheduleForm.reason}
                onChange={e => setScheduleForm(f => ({ ...f, reason: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-200">
                Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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