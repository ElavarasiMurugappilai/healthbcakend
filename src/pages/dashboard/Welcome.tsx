import React from "react";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  user: { name: string };
  setShowScheduleModal: (show: boolean) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ user, setShowScheduleModal }) => {
  return (
    <section className="w-full px-4 py-6">
      {/* Entire Block: stacked on mobile & tablet, row on desktop */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-4">
        
        {/* Row 1: Welcome Text */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center lg:text-left">
          Welcome, {user.name || "Guest"}!
        </h1>

        {/* Row 2: Stats + Schedule Button */}
        <div className="flex flex-col md:flex-row items-center justify-center lg:justify-end gap-4 sm:gap-6">
          
          {/* Glucose */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="text-sm text-muted-foreground">Glucose</span>
            <span className="text-2xl font-bold">
              102 <span className="text-base font-normal">mg/dL</span>
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px bg-gray-300" />

          {/* Water */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="text-sm text-muted-foreground">Water</span>
            <span className="text-2xl font-bold">
              2.2 <span className="text-base font-normal">Liters</span>
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px bg-gray-300" />

          {/* Schedule Button */}
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 font-semibold w-full sm:w-auto"
            onClick={() => setShowScheduleModal(true)}
          >
            Schedule Visit +
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
