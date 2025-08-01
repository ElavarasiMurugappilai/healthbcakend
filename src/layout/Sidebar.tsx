import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Pill,
  Trophy,
  BarChart2,
  Calendar,
  Bell,
  Search,
  LayoutDashboard,
  CalendarDays,
  Sun,
  Moon,
} from "lucide-react";

const sidebarIcons = [
  <Home size={20} />, // Dashboard
  <Pill size={20} />, // Medications
  <Trophy size={20} />, // Challenges
  <BarChart2 size={20} />, // Health Insights
  <Calendar size={20} />, // Appointments
  <Bell size={20} />, // Notifications
];

const sidebarLinks = [
  "Dashboard",
  "Medications",
  "Challenges",
  "Health Insights",
  "Appointments",
  "Notifications",
];

// Add a dynamic UserProfile component that takes user as a prop
const UserProfile = ({
  user,
  setShowLoginModal,
  setShowProfileModal,
}: {
  user: { name: string; email: string; avatar: string },
  setShowLoginModal: (show: boolean) => void,
  setShowProfileModal: (show: boolean) => void,
}) => {
  const isGuest = !user.name && !user.email && !user.avatar;
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl bg-sidebar-accent mt-auto cursor-pointer hover:shadow"
      onClick={() => isGuest ? setShowLoginModal(true) : setShowProfileModal(true)}
      title={isGuest ? "Login" : "Profile"}
      tabIndex={0}
      role="button"
      aria-label={isGuest ? "Login" : "Profile"}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") (isGuest ? setShowLoginModal(true) : setShowProfileModal(true)); }}
    >
      <img
        src={isGuest ? 'https://ui-avatars.com/api/?name=Guest&background=cccccc&color=555555' : user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
        alt={isGuest ? 'Guest' : user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="text-left">
        <div className="font-semibold text-sm text-sidebar-foreground">{isGuest ? 'Guest' : user.name}</div>
        <div className="text-xs text-muted-foreground">{isGuest ? 'Not logged in' : user.email}</div>
      </div>
    </div>
  );
};

interface SidebarProps {
  sidebarOpen: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  user: { name: string; email: string; avatar: string };
  setShowCustomizeModal: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setShowDateModal: (show: boolean) => void; // <-- add this
  selectedDate: string; // <-- add this
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  searchValue,
  setSearchValue,
  user,
  setShowCustomizeModal,
  setShowLoginModal,
  setShowProfileModal,
  setShowDateModal, // <-- add this
  selectedDate, // <-- add this
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarClose = () => {
    setSidebarOpen?.(false);
  };

  return (
    <>
      <aside
        className={`
          fixed md:static z-30 top-0 left-0 h-full md:h-auto bg-gray-200 dark:bg-[#18181b] p-0 pt-8 w-64
          flex flex-col transition-transform duration-1000
           ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Sidebar header for logo and close button on mobile */}
        <div className="md:hidden flex flex-col items-start justify-center h-20 px-6 border-b border-gray-300 dark:border-zinc-800 relative">
          {/* Logo/title for mobile sidebar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500 rounded-full w-6 h-6 inline-block" />
            <span className="font-bold text-xl">ARMED</span>
          </div>
          <button
            className="absolute top-4 right-4 text-3xl text-black dark:text-white bg-transparent border-none focus:outline-none"
            onClick={handleSidebarClose}
            aria-label="Close sidebar"
            type="button"
          >
            &times;
          </button>
        </div>
        <div className="relative h-full flex flex-col px-6 pt-6 md:pt-0">
          {/* Sidebar content below */}
          <nav className="flex-1 overflow-auto">
            <ul className="space-y-2 md:space-y-4">
              {sidebarLinks.map((link, i) => {
                const path = "/" + link.toLowerCase().replace(/ /g, "-");
                const isActive = location.pathname === path;
                return (
                  <li key={link}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-base font-medium text-sidebar-foreground hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer transition-colors duration-200 ${isActive ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                      onClick={() => navigate(path)}
                    >
                      <span className="text-lg">{sidebarIcons[i]}</span>
                      {link}
                    </Button>
                  </li>
                );
              })}
            </ul>
            {/* Utility items: only show on mobile */}
            <div className="block md:hidden">
              <hr className="my-4 border-gray-300 dark:border-zinc-800" />
              {/* Search bar with icon inside and clear button */}
              <div className="relative mb-2">
                <Input
                  type="text"
                  placeholder="Try searching 'Omega 3' ..."
                  className="w-full pl-10 pr-8 h-10 text-base rounded-lg border border-gray-500 focus:ring-2 focus:ring-orange-200"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      alert(`Searching for: ${searchValue}`);
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
              {/* Customize Dashboard (only on /dashboard) */}
              {location.pathname === '/dashboard' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center gap-2 mb-2"
                  onClick={() => setShowCustomizeModal(true)}
                >
                  <LayoutDashboard size={18} />
                  Customize Dashboard
                </Button>
              )}
              {/* Dark/Light mode toggle */}
              <Button
                variant="ghost"
                className="w-full justify-start flex items-center gap-2"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark'  : 'light'}  mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>
          </nav>
          {/* Profile/User card at the bottom */}
          <div className="mt-auto mb-4">
            <UserProfile
              user={user}
              setShowLoginModal={setShowLoginModal}
              setShowProfileModal={setShowProfileModal}
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile: clicking it closes the sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 