import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users } from "lucide-react";

type Challenge = {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  points: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

interface ChallengeTabProps {
  challenges: Challenge[];
  handleJoinChallenge: (challengeId: string) => void;
  handleLeaveChallenge: (challengeId: string) => void;
  handleUpdateProgress: (challengeId: string, newProgress: number) => void;
  getProgressPercentage: (current: number, target: number) => number;
  getDifficultyColor: (difficulty: string) => string;
  getTypeColor: (type: string) => string;
}

const ChallengeTab: React.FC<ChallengeTabProps> = ({
  challenges,
  handleJoinChallenge,
  handleLeaveChallenge,
  handleUpdateProgress,
  getProgressPercentage,
  getDifficultyColor,
  getTypeColor,
}) => (
  <div className="space-y-6">
    <div className="grid gap-6">
      {challenges.map((challenge) => (
        <div className="w-full min-w-0" key={challenge.id}>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-3 rounded-lg ${challenge.color} text-white`}>
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                      {challenge.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{challenge.description}</p>
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">
                        {challenge.current} / {challenge.target} {challenge.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${challenge.color.replace('bg-', 'bg-')}`}
                        style={{ width: `${getProgressPercentage(challenge.current, challenge.target)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {challenge.points} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants}
                      </span>
                    </div>
                    {challenge.isActive ? (
                      <div className="flex flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0 mx-auto flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveChallenge(challenge.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Leave
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateProgress(challenge.id, challenge.current + 1)}
                          disabled={challenge.current >= challenge.target}
                          className="hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black"
                        >
                          Update Progress
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleJoinChallenge(challenge.id)}
                        className="hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black"
                      >
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  </div>
);

export default ChallengeTab; 