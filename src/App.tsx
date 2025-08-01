import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";

// Import shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Import modular components
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MedicationsPage from "./pages/MedicationsPage";
import ChallengesPage from "./pages/ChallengesPage";
import HealthInsightsPage from "./pages/HealthInsightsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotificationsPage from "./pages/NotificationsPage";

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
  const [showLoginModal, setShowLoginModal] = useState(false);
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
  const [showCareTeamModal, setShowCareTeamModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });
  const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=cccccc&color=555555';

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
    { name: "Phillip Workman", role: "Neurologist", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Cheyenne Herwitz", role: "Cardiologist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Ava Patel", role: "General Physician", img: "https://randomuser.me/api/portraits/women/68.jpg" },
   
  ]);

  const width = useWindowWidth();
  const location = useLocation();

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

  // Open edit form with current user info
  useEffect(() => {
    if (showProfileModal && user.name) {
      setEditForm({ name: user.name, email: user.email });
      setEditAvatar(user.avatar);
      setEditingProfile(false);
    }
  }, [showProfileModal, user]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: loginForm.name, email: loginForm.email, avatar: '' });
    setShowLoginModal(false);
    setShowProfileModal(true);
    setToast('Logged in successfully!');
    setTimeout(() => setToast(''), 2000);
  };

  // Handle logout
  const handleLogout = () => {
    setUser({ name: '', email: '', avatar: '' });
    setShowProfileModal(false);
    setToast('Logged out successfully!');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-100 dark:bg-[#252545]">
        {/* Header */}
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

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-sidebar">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            user={user}
            setShowCustomizeModal={setShowCustomizeModal}
            setShowLoginModal={setShowLoginModal}
            setShowProfileModal={setShowProfileModal}
            setShowDateModal={setShowDateModal}
            selectedDate={selectedDate}
          />

          {/* Main Content */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 pb-8 overflow-y-auto space-y-3 bg-gray-200 dark:bg-[#18181b]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%" }} // optional, helps with layout
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
                  {/* Redirect all other routes to /dashboard */}
                  <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Toast message */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
            {toast}
          </div>
        )}

        {/* Login Modal - Using shadcn Dialog */}
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Profile Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Profile Name"
                  value={loginForm.name}
                  onChange={e => setLoginForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowLoginModal(false)}>
                  Close
                </Button>
                <Button type="submit">Login</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Profile Modal - Using shadcn Dialog */}
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
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
                      <Button onClick={() => setShowLoginModal(true)}>Login</Button>
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

        {/* Customize Dashboard Modal - Using shadcn Dialog */}
        <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fitnessGoals"
                    checked={visibleSections.fitnessGoals}
                    onChange={() => handleSectionToggle('fitnessGoals')}
                    className="rounded"
                  />
                  <Label htmlFor="fitnessGoals">Fitness Goals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="glucoseTrends"
                    checked={visibleSections.glucoseTrends}
                    onChange={() => handleSectionToggle('glucoseTrends')}
                    className="rounded"
                  />
                  <Label htmlFor="glucoseTrends">Blood Glucose Trends</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="careTeam"
                    checked={visibleSections.careTeam}
                    onChange={() => handleSectionToggle('careTeam')}
                    className="rounded"
                  />
                  <Label htmlFor="careTeam">My Care Team</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="medicationSchedule"
                    checked={visibleSections.medicationSchedule}
                    onChange={() => handleSectionToggle('medicationSchedule')}
                    className="rounded"
                  />
                  <Label htmlFor="medicationSchedule">Medication Schedule</Label>
                </div>
              </div>
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
                <Label htmlFor="selectedDate">Date</Label>
                <Input
                  id="selectedDate"
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
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
