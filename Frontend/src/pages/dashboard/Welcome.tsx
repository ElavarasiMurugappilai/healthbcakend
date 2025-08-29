import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface WelcomeProps {
  user: { name: string; email?: string; avatar?: string; age?: number; gender?: string; goals?: string[] };
  profile?: { fitnessGoals?: string; activityLevel?: string; healthGoal?: string };
  setShowScheduleModal: (show: boolean) => void;
}

// Utility: check if value looks like a MongoDB ObjectId
const isObjectId = (val: string) => /^[a-f\d]{24}$/i.test(val);

const Welcome: React.FC<WelcomeProps> = ({ user, profile, setShowScheduleModal }) => {
  // Prefer user.name → fallback to localStorage → Guest
  let displayName = user?.name;

  if (!displayName || isObjectId(displayName)) {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        displayName =
          parsed?.name && !isObjectId(parsed.name) ? parsed.name : "Guest";
      } else {
        displayName = "Guest";
      }
    } catch {
      displayName = "Guest";
    }
  }

  // Capitalize first letter of each word
  const capitalizeName = (name: string) =>
    name
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");

  const formattedName = displayName ? capitalizeName(displayName) : "Guest";

  // Time-based greeting logic
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) {
      return { greeting: "Good Morning", emoji: "👋" };
    } else if (hour >= 11 && hour < 16) {
      return { greeting: "Good Afternoon", emoji: "☀️" };
    } else if (hour >= 16 && hour < 21) {
      return { greeting: "Good Evening", emoji: "🌆" };
    } else {
      return { greeting: "Good Night", emoji: "🌙" };
    }
  };

  const { greeting, emoji } = getTimeBasedGreeting();

  // Get personalized message based on profile
  const getPersonalizedMessage = () => {
    if (profile?.healthGoal) {
      const hour = new Date().getHours();
      if (hour >= 16 && hour < 21) {
        return "Stay Hydrated!";
      } else if (hour >= 5 && hour < 11) {
        return "Start your day strong!";
      }
    }
    return "";
  };

  const personalizedMessage = getPersonalizedMessage();

  return (
    <section className="w-full px-4 py-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-4">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {greeting}, {formattedName} {emoji}
          </h1>
          {personalizedMessage && (
            <p className="text-lg text-muted-foreground mt-2">{personalizedMessage}</p>
          )}
          {user.age && user.gender && (
            <div className="flex flex-wrap gap-4 mt-3 justify-center lg:justify-start">
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                Age: {user.age}
              </span>
              <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                {user.gender}
              </span>
              {user.goals && user.goals.length > 0 && (
                <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                  Goal: {user.goals[0]}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center lg:justify-end gap-4 sm:gap-6">
          {/* Glucose */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="text-sm text-muted-foreground">Glucose</span>
            <span className="text-2xl font-bold">
              102 <span className="text-base font-normal">mg/dL</span>
            </span>
          </div>
          <div className="hidden md:block h-10 w-px bg-gray-300" />

          {/* Water */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="text-sm text-muted-foreground">Water</span>
            <span className="text-2xl font-bold">
              2.2 <span className="text-base font-normal">Liters</span>
            </span>
          </div>
          <div className="hidden md:block h-10 w-px bg-gray-300" />

          
          {/* Schedule button */}
          <Button
            onClick={() => setShowScheduleModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 font-semibold w-full sm:w-auto"
          >
            <Icons.calendarPlus className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
