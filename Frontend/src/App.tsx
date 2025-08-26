import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, useLocation, Navigate,useNavigate } from "react-router-dom";
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";

// import ProtectedRoute from "./routes/protectedRoute";
// Import shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Toaster } from 'sonner';
import { Pill, Stethoscope, Droplets, Dumbbell, Heart, Activity, Zap, Star } from "lucide-react";


// Import modular components
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MedicationsPage from "./pages/MedicationsPage";
import ChallengesPage from "./pages/ChallengesPage";
import HealthInsightsPage from "./pages/HealthInsightsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotificationsPage from "./pages/NotificationsPage";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/QuizPage";



// Responsive window width hook
function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

type CareTeamMember = {
  name: string;
  role: string;
  img: string;
  badge?: number;
  unread?: boolean;
  messages?: string[];
};

export default function App() {
  // User state
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  // Removed legacy inline login modal in favor of dedicated page
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editAvatar, setEditAvatar] = useState('');
  const [toast, setToast] = useState('');

  // Removed unused destructured elements from useTheme
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [medications, setMedications] = useState([
    { name: "Metformin", qty: "1 pill", dosage: "500 mg", status: "Missed", time: "12:30" },
    { name: "Omega 3", qty: "3 pills", dosage: "800 mg", status: "Taken", time: "08:00" },
    { name: "Levothyroxine", qty: "2 pills", dosage: "50 mg", status: "Upcoming", time: "18:00" },
    { name: "Aspirin", qty: "1 pill", dosage: "100 mg", status: "Taken", time: "09:00" },
    { name: "Atorvastatin", qty: "1 pill", dosage: "20 mg", status: "Upcoming", time: "21:00" },
  ]);
  const [selectedMember, setSelectedMember] = useState<CareTeamMember | null>(null);
  const [showFitnessModal, setShowFitnessModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', reason: '' });
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    fitnessGoals: true,
    glucoseTrends: true,
    careTeam: true,
    medicationSchedule: true,
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [, setShowCareTeamModal] = useState(false);
  // const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });

  const [careTeam] = useState([
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
    { name: "Phillip Workman", role: "Neurologist", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Cheyenne Herwitz", role: "Cardiologist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Ava Patel", role: "General Physician", img: "https://randomuser.me/api/portraits/women/68.jpg" },
   
  ]);

  const width = useWindowWidth();
  const location = useLocation();
  const navigate = useNavigate();

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      console.log("Loading user from localStorage:", storedUser);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        console.log("Parsed user data:", parsed);
        setUser({
          name: parsed?.name || "",
          email: parsed?.email || "",
          avatar: parsed?.avatar || ""
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Listen for user-updated events
  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const storedUser = localStorage.getItem("user");
        console.log("User updated event - stored user:", storedUser);
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log("User updated event - parsed user:", parsed);
          setUser({
            name: parsed?.name || "",
            email: parsed?.email || "",
            avatar: parsed?.avatar || ""
          });
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    };

    window.addEventListener("user-updated", handleUserUpdate);
    return () => window.removeEventListener("user-updated", handleUserUpdate);
  }, []);

  // Handle Take button
  const handleTake = (index: number) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, status: "Taken" } : med
      )
    );
    setToast("Medication marked as taken!");
    setTimeout(() => setToast(""), 2000);
  };

  // Handle Schedule Visit form submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    setToast('Visit scheduled successfully!');
    setTimeout(() => setToast(''), 2000);
    setScheduleForm({ date: '', time: '', reason: '' });
  };

  // Handle section toggle
  const handleSectionToggle = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Auth helpers used by modal and routing
  // const handleLogin = () => {
  //   navigate("/dashboard");
  // };

  const handleLogout = () => {
    setUser({ name: "", email: "", avatar: "" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

 const isAuthPage =
  location.pathname === "/login" ||
  location.pathname === "/signup" ||
  location.pathname === "/quiz";
  

  
  // Close profile modal when on auth pages
  useEffect(() => {
    if (isAuthPage && showProfileModal) {
      setShowProfileModal(false);
    }
  }, [isAuthPage, showProfileModal]);

  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-100 dark:bg-[#252545]">
        <div>
            {/* Full Screen Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>

          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 text-orange-500/30 dark:text-orange-400/30 animate-float-slow">
              <Pill size={32} />
            </div>
            <div className="absolute top-1/3 right-1/4 text-blue-500/25 dark:text-blue-400/25 animate-float-medium">
              <Stethoscope size={28} />
            </div>
            <div className="absolute bottom-1/3 left-1/3 text-blue-600/35 dark:text-blue-500/35 animate-float-fast">
              <Droplets size={24} />
            </div>
            <div className="absolute bottom-1/4 right-1/3 text-orange-600/20 dark:text-orange-500/20 animate-float-slow">
              <Dumbbell size={36} />
            </div>
            <div className="absolute top-1/2 left-1/6 text-orange-500/30 dark:text-orange-400/30 animate-float-medium">
              <Heart size={26} />
            </div>
            <div className="absolute top-2/3 right-1/6 text-blue-500/25 dark:text-blue-400/25 animate-float-fast">
              <Activity size={30} />
            </div>
            <div className="absolute bottom-1/3 right-1/2 text-orange-600/20 dark:text-orange-500/20 animate-float-slow">
              <Zap size={22} />
            </div>
            <div className="absolute top-1/6 right-1/3 text-blue-600/25 dark:text-blue-500/25 animate-float-medium">
              <Star size={20} />
            </div>
          </div>
        
        </div>
        {/* Header */}
        {!isAuthPage && (
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setShowCustomizeModal={setShowCustomizeModal}
            setShowDateModal={setShowDateModal}
            showCustomizeModal={showCustomizeModal}
            visibleSections={visibleSections}
            handleSectionToggle={handleSectionToggle}
            setToast={setToast}
          />
        )}

        <div className={`flex flex-1 ${isAuthPage ? "" : "flex-col md:flex-row overflow-hidden bg-sidebar"}`}>
          {/* Sidebar */}
          {!isAuthPage && (
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              user={user}
              setShowCustomizeModal={setShowCustomizeModal}
              setShowProfileModal={setShowProfileModal}
              setShowDateModal={setShowDateModal}
              selectedDate={selectedDate}
            />
          )}

          {/* Main Content */}
          <main
            className={
              isAuthPage
                ? "flex-1 min-h-screen flex items-center justify-center bg-background"
                : "flex-1 p-2 sm:p-4 md:p-6 pb-8 overflow-y-auto space-y-3 bg-gray-200 dark:bg-[#18181b]"
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%" }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/dashboard" element={
                    <DashboardPage
                      user={user}
                      setShowScheduleModal={setShowScheduleModal}
                      medications={medications}
                      careTeam={careTeam}
                      searchValue={searchValue}
                      visibleSections={visibleSections}
                      selectedDate={selectedDate}
                      setShowFitnessModal={setShowFitnessModal}
                      setShowCareTeamModal={setShowCareTeamModal}
                      setSelectedMember={setSelectedMember}
                      handleTake={handleTake}
                      handleSectionToggle={handleSectionToggle}
                      width={width}
                      showScheduleModal={showScheduleModal}
                    />
                  } />
                  <Route path="/medications" element={<MedicationsPage searchValue={searchValue} />} />
                  <Route path="/challenges" element={<ChallengesPage searchValue={searchValue} />} />
                  <Route path="/health-insights" element={<HealthInsightsPage searchValue={searchValue} />} />
                  <Route path="/appointments" element={<AppointmentsPage searchValue={searchValue} />} />
                  <Route path="/notifications" element={<NotificationsPage searchValue={searchValue} />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
        
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        {/* ...rest of the code... */}

        {/* Toast message */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
            {toast}
          </div>
        )}

        {/* Removed legacy inline Login Modal; use /login route instead */}
       


        {/* Profile Modal - Using shadcn Dialog - Only show when not on auth pages */}
        <Dialog open={showProfileModal && !isAuthPage} onOpenChange={setShowProfileModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={editingProfile ? editAvatar : user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}`} />
                <AvatarFallback>{user.name || 'User'}</AvatarFallback>
              </Avatar>
              
              {!editingProfile ? (
                <>
                  <div className="text-center">
                    <div className="font-bold text-lg">{user.name || 'Guest'}</div>
                    <div className="text-sm text-muted-foreground">{user.email || 'Not logged in'}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    {user.name ? (
                      <>
                        <Button onClick={() => setEditingProfile(true)}>Edit Profile</Button>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                      </>
                    ) : (
                      <Button onClick={() => navigate('/login')}>Login</Button>
                    )}
                  </div>
                </>
              ) : (
                <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={e => {
                    e.preventDefault();
                    setUser(u => ({ ...u, name: editForm.name, email: editForm.email, avatar: editAvatar }));
                    setEditingProfile(false);
                    setToast('Profile updated successfully!');
                    setTimeout(() => setToast(''), 2000);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => {
                            setEditAvatar(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editName">Name</Label>
                    <Input
                      id="editName"
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Care Team Member Modal - Using shadcn Dialog */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Care Team Member</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedMember.img} />
                  <AvatarFallback>{selectedMember.name}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-bold text-lg">{selectedMember.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedMember.role}</div>
                </div>
                {selectedMember.badge && (
                  <Badge variant="secondary">{selectedMember.badge}</Badge>
                )}
                {selectedMember.messages && (
                  <div className="w-full space-y-2">
                    {selectedMember.messages.map((msg: string, idx: number) => (
                      <Card key={idx}>
                        <CardContent className="p-3">
                          <p className="text-sm">{msg}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Fitness Modal - Using shadcn Dialog */}
        <Dialog open={showFitnessModal} onOpenChange={setShowFitnessModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Fitness Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>You have completed 4 out of 5 workouts this week! Keep it up!</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Date Picker Modal - Using shadcn Dialog */}
        <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Date</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date.toISOString().slice(0, 10));
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  className="rounded-md border"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowDateModal(false)}>
                  Select
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}
