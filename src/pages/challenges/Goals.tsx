import React from "react";

interface GoalsProps {
  userPoints: number;
  activeCount: number;
}

const Goals: React.FC<GoalsProps> = ({ userPoints, activeCount }) => (
  <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-4 text-center sm:text-left">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-foreground">Challenges</h1>
      <p className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">Engage with fun health-related goals</p>
    </div>
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-foreground">{userPoints}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">Total Points</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-foreground">{activeCount}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">Active</div>
      </div>
    </div>
  </div>
);

export default Goals; 