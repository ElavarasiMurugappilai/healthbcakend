import React, { useEffect, useState, useMemo } from "react";
import Welcome from "./dashboard/Welcome";
import Fitness from "./dashboard/Fitness";
import BloodGlucose from "./dashboard/BloodGlucose";
import MyCareTeam from "./dashboard/MyCareTeam";
import MedicationSchedule from "./dashboard/MedicationSchedule";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api"; // <--- make sure api.ts has axios instance

// Shape of profile coming from backend
interface Profile {
  userId: string;
  fitnessGoals?: string;
  exercise?: string;
  stepGoal?: number[];
  medications?: { name: string; dosage: string; status: string; time: string }[];
  careTeam?: { name: string; role: string; img?: string; messages?: string[] }[];
  trackGlucose?: boolean;
  takeMeds?: boolean;
  healthGoal?: string;
  activityLevel?: string;
}

// User interface
interface User {
  name: string;
  email: string;
  avatar: string;
  age?: number;
  gender?: string;
  goals?: string[];
}

const DashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({ name: "", email: "", avatar: "" });

  // State for filters/search
  const [statusFilter, setStatusFilter] = useState("any");

  // State for visit scheduling modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "", reason: "" });
  const [toast, setToast] = useState("");

  // State for enabled cards (load from localStorage)
  const [enabledCards, setEnabledCards] = useState({
    showFitness: false,
    showGlucose: false,
    showCareTeam: false,
    showMedications: false,
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
              try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.log("No token found, skipping profile fetch");
            setLoading(false);
            return;
          }

          const res = await api.get("/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Update both profile and user data from backend response
          if (res.data.profile) {
            setProfile(res.data.profile);
          }
          if (res.data.user) {
            setUser({
              name: res.data.user.name || "",
              email: res.data.user.email || "",
              avatar: res.data.user.avatar || "",
              age: res.data.user.age,
              gender: res.data.user.gender,
              goals: res.data.user.goals || []
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
    };
    fetchProfile();
  }, []);

  // Get user data from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      console.log("🔍 DashboardPage: Raw stored user data:", storedUser);
      
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsed = JSON.parse(storedUser);
        console.log("🔍 DashboardPage: Parsed user data:", parsed);
        
        setUser({
          name: parsed?.name || "",
          email: parsed?.email || "",
          avatar: parsed?.avatar || "",
        });
        
        console.log("✅ DashboardPage: User state set to:", {
          name: parsed?.name || "",
          email: parsed?.email || "",
          avatar: parsed?.avatar || "",
        });
      } else {
        console.log("⚠️ DashboardPage: No valid user data found in localStorage");
      }
    } catch (error) {
      console.error("❌ DashboardPage: Error parsing user from localStorage:", error);
    }
  }, []);

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
          const parsed = JSON.parse(storedUser);
          setUser({
            name: parsed?.name || "",
            email: parsed?.email || "",
            avatar: parsed?.avatar || "",
          });
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    };

    window.addEventListener("user-updated", handleUserUpdate);
    return () => window.removeEventListener("user-updated", handleUserUpdate);
  }, []);

  // Load enabled cards from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dashboardEnabledCards");
      if (stored) {
        setEnabledCards(JSON.parse(stored));
      }
    } catch (e) {
      setEnabledCards({
        showFitness: false,
        showGlucose: false,
        showCareTeam: false,
        showMedications: false,
      });
    }
  }, []);

  // Compute visible sections based on profile
  const visibleSections = useMemo(
    () => ({
       // Always show fitness card since it has its own backend data
      glucoseTrends: !!profile?.trackGlucose,
      medicationSchedule: !!profile?.takeMeds,
      careTeam: (profile?.careTeam ?? []).length > 0,
    }),
    [profile]
  );

  // Filter medications & care team dynamically
  const filteredMedications =
    profile?.medications
      ?.filter(
        (med) =>
          (statusFilter === "any" || med.status === statusFilter)
      )
      .map((med) => ({
        ...med,
        qty: (med as any).qty ?? "", // Provide qty or default to empty string
      })) ?? [];

  const careTeam =
    profile?.careTeam
      ?.map((member) => ({
        ...member,
        img: member.img ?? "", // Ensure img is always a string
      })) ?? [];

  // Glucose data (placeholder until you track actual readings)
  const glucoseData = [
    { time: 8, today: 60, yesterday: 40 },
    { time: 10, today: 120, yesterday: 100 },
    { time: 12, today: 70, yesterday: 80 },
    { time: 14, today: 60, yesterday: 80 },
    { time: 16, today: 110, yesterday: 100 },
    { time: 18, today: 80, yesterday: 70 },
    { time: 20, today: 60, yesterday: 60 },
  ];

  // Adaptive bar size for glucose chart
  const width = window.innerWidth;
  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;

  // Visit scheduling
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    setToast("Visit scheduled successfully!");
    setTimeout(() => setToast(""), 2000);
    setScheduleForm({ date: "", time: "", reason: "" });
  };

  // Mark medication as taken
  const handleTake = (index: number) => {
    if (!profile) return;
    const updated = [...(profile.medications ?? [])];
    updated[index].status = "Taken";
    setProfile({ ...profile, medications: updated });
  };

  // Skeleton loader
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

  // Global selectedDate from Zustand store (unused for now)
  // const selectedDate = useDateStore((state) => state.selectedDate);

  return (
    <>
      <Welcome user={user} profile={profile || undefined} setShowScheduleModal={setShowScheduleModal} />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Only render cards the user selected in the quiz */}
          <section className="flex flex-col w-10 lg:flex-row gap-2 mb-2 w-full">
            {enabledCards.showFitness && (
              <Fitness setShowFitnessModal={() => {}} isFullWidth={false} />
            )}
            {enabledCards.showGlucose && (
              <BloodGlucose glucoseData={glucoseData} barSize={barSize} />
            )}
          </section>

          <section className="flex flex-col lg:flex-row gap-2 w-full mb-6">
            {enabledCards.showCareTeam && (
              <MyCareTeam filteredCareTeam={careTeam} setSelectedMember={() => {}} setShowCareTeamModal={() => {}} />
            )}
            {enabledCards.showMedications && (
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

      {/* Schedule Visit Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule a Visit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm((f) => ({ ...f, date: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm((f) => ({ ...f, time: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" type="text" placeholder="Reason for visit" value={scheduleForm.reason} onChange={(e) => setScheduleForm((f) => ({ ...f, reason: e.target.value }))} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 hover:-translate-y-1 transition-all duration-200">
                Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-success text-success-foreground px-4 py-2 rounded shadow-lg z-50 transition">
          {toast}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
