import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

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
          badge.isEarned ? 'ring-2 ring-success bg-success/10' : 'opacity-80'
        }`}>
          <div className={`mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${
            badge.isEarned ? 'bg-success/30' : 'bg-muted'
          }`}>
            <div className={badge.color}>
              {badge.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{badge.name}</h3>
          <p className="text-muted-foreground mb-3">{badge.description}</p>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icons.award className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium">{badge.points} points</span>
          </div>
          {badge.isEarned ? (
            <Badge variant="default" className="text-success bg-success/30 hover:bg-success/30 text-sm font-medium">
              ✓ Earned {badge.earnedDate && `on ${new Date(badge.earnedDate).toLocaleDateString()}`}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-muted-foreground text-sm">
              Not earned yet
            </Badge>
          )}
        </Card>
      ))}
    </div>
  </div>
);

export default BadgesTab; 