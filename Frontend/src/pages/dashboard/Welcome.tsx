import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Link } from "react-router-dom";

interface WelcomeProps {
  user: { name: string; email?: string; avatar?: string };
  setShowScheduleModal: (show: boolean) => void;
}

// Utility: check if value looks like a MongoDB ObjectId
const isObjectId = (val: string) => /^[a-f\d]{24}$/i.test(val);

const Welcome: React.FC<WelcomeProps> = ({ user, setShowScheduleModal }) => {
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

  return (
    <section className="w-full px-4 py-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center lg:text-left">
          Welcome, {formattedName}!
        </h1>

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

          {/* Health Questionnaire button */}
          <Link to="/health-questionnaire">
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 font-semibold w-full sm:w-auto border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Icons.clipboardCheck className="w-4 h-4 mr-2" />
              Health Questionnaire
            </Button>
          </Link>
          
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
