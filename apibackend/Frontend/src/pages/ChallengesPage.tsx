import React, { useState } from "react";
import Goals from "./challenges/Goals";
import BadgesTab from "./challenges/Badges";
import LeaderboardTab from "./challenges/Leaderboard";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";

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
  tip?: string;
};

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

type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  challengesCompleted: number;
};

interface ChallengesPageProps {
  searchValue: string;
}

// Challenge Card Component
const ChallengeCard: React.FC<{
  challenge: Challenge;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onCardClick: (challenge: Challenge) => void;
}> = ({ challenge, onJoin, onLeave, onUpdateProgress, onCardClick }) => {
  const progressPercentage = Math.min(100, (challenge.current / challenge.target) * 100);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'hard': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'text-primary bg-primary/10';
      case 'weekly': return 'text-purple-600 bg-purple-50';
      case 'monthly': return 'text-orange-600 bg-orange-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
      onClick={() => onCardClick(challenge)}
    >
  <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border border-border hover:border-primary bg-card">
        {/* Header with Icon and Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${challenge.color} text-primary-foreground shadow-lg`}>
            {challenge.icon}
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`text-xs font-semibold ${getTypeColor(challenge.type)}`}>
              {challenge.type}
            </Badge>
            <Badge className={`text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-foreground">
              {challenge.current} / {challenge.target} {challenge.unit}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${challenge.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Icons.award className="w-4 h-4" />
              <span className="font-semibold">{challenge.points} pts</span>
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Icons.users className="w-4 h-4" />
              <span className="font-semibold">{challenge.participants}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {challenge.isActive ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onLeave(challenge.id);
                }}
                className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
              >
                Leave
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateProgress(challenge.id, Math.min(challenge.target, challenge.current + 1));
                }}
                disabled={challenge.current >= challenge.target}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Update
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onJoin(challenge.id);
              }}
              className="flex-1 bg-success hover:bg-success/90"
            >
              Join Challenge
            </Button>
          )}
        </div>

        {/* Tip */}
        {challenge.tip && (
          <div className="mt-6 p-4 bg-muted rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <Icons.lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-primary leading-relaxed">{challenge.tip}</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Challenge Modal Component
const ChallengeModal: React.FC<{
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProgress: (id: string, progress: number) => void;
}> = ({ challenge, isOpen, onClose, onUpdateProgress }) => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (challenge) {
      setProgress(challenge.current);
    }
  }, [challenge]);

  if (!challenge) return null;

  const progressPercentage = Math.min(100, (progress / challenge.target) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${challenge.color} text-white`}>
              {challenge.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-medium capitalize">{challenge.type}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Difficulty</div>
              <div className="font-medium capitalize">{challenge.difficulty}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Points</div>
              <div className="font-medium">{challenge.points} pts</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Participants</div>
              <div className="font-medium">{challenge.participants}</div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Update Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current Progress</span>
                <span className="font-medium">{progress} / {challenge.target} {challenge.unit}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${challenge.color}`}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="progress" className="text-sm text-muted-foreground mb-2 block">Progress Value</Label>
                  <Input
                    id="progress"
                    type="number"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    min={0}
                    max={challenge.target}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="slider" className="text-sm text-muted-foreground mb-2 block">Slider</Label>
                  <input
                    id="slider"
                    type="range"
                    min={0}
                    max={challenge.target}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  onUpdateProgress(challenge.id, progress);
                  onClose();
                }}
                className="w-full"
              >
                Update Progress
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Timeline</h3>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="font-medium">{challenge.startDate}</div>
              </div>
              <Icons.chevronRight className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">End Date</div>
                <div className="font-medium">{challenge.endDate}</div>
              </div>
            </div>
          </div>

          {/* Tip */}
          {challenge.tip && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <Icons.lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-primary">Pro Tip</div>
                  <p className="text-sm text-primary">{challenge.tip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChallengesPage: React.FC<ChallengesPageProps> = ({ searchValue }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Daily Steps Goal',
      description: 'Walk 5,000 steps today ',
      type: 'daily',
      target: 5000,
      current: 3200,
      unit: 'steps',
      icon: <Icons.activity size={24} />,
      color: 'bg-blue-500',
      points: 50,
      isActive: true,
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      participants: 1247,
      difficulty: 'easy',
      tip: '💡 Try taking the stairs instead of the elevator!'
    },
    {
      id: '2',
      title: 'Weekly Workout Streak',
      description: 'Complete 5 workouts this week ',
      type: 'weekly',
      target: 5,
      current: 3,
      unit: 'workouts',
      icon: <Icons.zap size={24} />,
      color: 'bg-green-500',
      points: 200,
      isActive: true,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 892,
      difficulty: 'medium',
      tip: '💡 Mix cardio and strength training for best results!'
    },
    {
      id: '3',
      title: 'Hydration Master',
      description: 'Drink 8 glasses of water daily ',
      type: 'daily',
      target: 8,
      current: 6,
      unit: 'glasses',
      icon: <Icons.heart size={24} />,
      color: 'bg-cyan-500',
      points: 30,
      isActive: true,
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      participants: 2156,
      difficulty: 'easy',
      tip: '💡 Set reminders on your phone to stay hydrated!'
    },
    {
      id: '4',
      title: 'Sleep Well Challenge',
      description: 'Get 8 hours of quality sleep',
      type: 'weekly',
      target: 7,
      current: 4,
      unit: 'days',
      icon: <Icons.star size={24} />,
      color: 'bg-purple-500',
      points: 150,
      isActive: true,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 567,
      difficulty: 'hard',
      tip: '💡 Avoid screens for better sleep!'
    },
    {
      id: '5',
      title: 'Mindful Minutes',
      description: ' meditation daily',
      type: 'daily',
      target: 10,
      current: 7,
      unit: 'minutes',
      icon: <Icons.target size={24} />,
      color: 'bg-indigo-500',
      points: 40,
      isActive: false,
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      participants: 743,
      difficulty: 'medium',
      tip: '💡 Find a quiet space and focus on your breath!'
    },
    {
      id: '6',
      title: 'Monthly Reading Goal',
      description: 'Read 4 books this month ',
      type: 'monthly',
      target: 4,
      current: 2,
      unit: 'books',
      icon: <Icons.trophy size={24} />,
      color: 'bg-orange-500',
      points: 300,
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 234,
      difficulty: 'hard',
      tip: '💡 Carry a book with you to read during commutes!'
    }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first daily challenge',
      icon: <Icons.trophy size={20} />,
      color: 'text-yellow-500',
      isEarned: true,
      earnedDate: '2024-01-15',
      points: 100
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Complete 5 weekly challenges',
      icon: <Icons.award size={20} />,
      color: 'text-blue-500',
      isEarned: true,
      earnedDate: '2024-01-18',
      points: 250
    },
    {
      id: '3',
      name: 'Hydration Hero',
      description: 'Drink 8 glasses of water for 7 consecutive days',
      icon: <Icons.heart size={20} />,
      color: 'text-cyan-500',
      isEarned: false,
      points: 300
    },
    {
      id: '4',
      name: 'Fitness Master',
      description: 'Complete 20 challenges total',
      icon: <Icons.target size={20} />,
      color: 'text-green-500',
      isEarned: false,
      points: 500
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      points: 2840,
      rank: 1,
      challengesCompleted: 23
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      points: 2650,
      rank: 2,
      challengesCompleted: 21
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      points: 2420,
      rank: 3,
      challengesCompleted: 19
    },
    {
      id: '4',
      name: 'Alex Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      points: 2180,
      rank: 4,
      challengesCompleted: 17
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
      points: 1950,
      rank: 5,
      challengesCompleted: 15
    }
  ]);

  const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'leaderboard'>('challenges');
  const [userPoints, setUserPoints] = useState(1250);
  const [toast, setToast] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isActive: true, participants: challenge.participants + 1 }
        : challenge
    ));
    showToast('Challenge joined successfully! 🎉');
  };

  const handleLeaveChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isActive: false, participants: Math.max(0, challenge.participants - 1) }
        : challenge
    ));
    showToast('Challenge left successfully! 👋');
  };

  const handleUpdateProgress = (challengeId: string, newProgress: number) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, current: Math.min(challenge.target, newProgress) }
        : challenge
    ));
    showToast('Progress updated successfully! 📈');
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCardClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                         c.type.toLowerCase().includes(searchValue.toLowerCase()) ||
                         c.difficulty.toLowerCase().includes(searchValue.toLowerCase());
    
    return matchesSearch;
  });

  const filteredBadges = badges.filter(b =>
    b.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    b.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredLeaderboard = leaderboard.filter(l =>
    l.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
  <div className="min-h-screen bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Goals */}
        <div className="mb-8">
      <Goals userPoints={userPoints} activeCount={challenges.filter(c => c.isActive).length} />
        </div>
        
      {/* Tabs - Using shadcn Tabs with Compact Responsive Design */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'challenges' | 'badges' | 'leaderboard')} className="w-full mb-8">
          <TabsList className="tabs-list grid w-full grid-cols-3 bg-card p-1 rounded-lg shadow-md border border-border h-auto min-h-[50px] sm:min-h-[55px] md:min-h-[60px] overflow-hidden">
            <TabsTrigger 
              value="challenges"
              className="tabs-trigger relative py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/50 data-[state=inactive]:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex flex-col items-center gap-1 relative z-10">
                <Icons.target className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Challenges</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="badges"
              className="tabs-trigger relative py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/50 data-[state=inactive]:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex flex-col items-center gap-1 relative z-10">
                <Icons.award className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Badges</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="tabs-trigger relative py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/50 data-[state=inactive]:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex flex-col items-center gap-1 relative z-10">
                <Icons.users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Leaderboard</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="tabs-content space-y-6 mt-6">
            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoinChallenge}
                    onLeave={handleLeaveChallenge}
                    onUpdateProgress={handleUpdateProgress}
                    onCardClick={handleCardClick}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
          
          <TabsContent value="badges" className="tabs-content space-y-6 mt-6">
            <BadgesTab badges={filteredBadges} />
          </TabsContent>
          
          <TabsContent value="leaderboard" className="tabs-content space-y-6 mt-6">
            <LeaderboardTab leaderboard={filteredLeaderboard} />
          </TabsContent>
        </Tabs>

        {/* Challenge Modal */}
        <ChallengeModal
          challenge={selectedChallenge}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedChallenge(null);
          }}
          onUpdateProgress={handleUpdateProgress}
        />

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.3 }}
              className="fixed bottom-6 right-6 bg-success text-success-foreground px-6 py-3 rounded-xl shadow-lg z-50"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChallengesPage; 