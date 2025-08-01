import React from "react";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isEarned: boolean;
  earnedDate?: string;
  points: number;
};

interface BadgesTabProps {
  badges: Badge[];
}

const BadgesTab: React.FC<BadgesTabProps> = ({ badges }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {badges.map((badge) => (
        <Card key={badge.id} className={`p-6 text-center transition-all duration-300 ${
          badge.isEarned ? 'ring-2 ring-green-200 bg-green-50/50' : 'opacity-75'
        }`}>
          <div className={`mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${
            badge.isEarned ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <div className={badge.color}>
              {badge.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{badge.name}</h3>
          <p className="text-muted-foreground mb-3">{badge.description}</p>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{badge.points} points</span>
          </div>
          {badge.isEarned ? (
            <div className="text-green-600 text-sm font-medium">
              ✓ Earned {badge.earnedDate && `on ${new Date(badge.earnedDate).toLocaleDateString()}`}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Not earned yet
            </div>
          )}
        </Card>
      ))}
    </div>
  </div>
);

export default BadgesTab; 