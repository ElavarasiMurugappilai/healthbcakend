import React from "react";
import { Card } from "@/components/ui/card";

type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  challengesCompleted: number;
};

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ leaderboard }) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Top Performers</h2>
      <div className="space-y-3">
        {leaderboard.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {entry.rank}
              </div>
              <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium text-foreground text-left">{entry.name}</div>
                <div className="text-sm text-muted-foreground text-left">
                  {entry.challengesCompleted} challenges completed
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-foreground">{entry.points} pts</div>
              <div className="text-sm text-muted-foreground">Rank #{entry.rank}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default LeaderboardTab; 