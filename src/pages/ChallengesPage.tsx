import React, { useState } from "react";
import Goals from "./challenges/Goals";
import BadgesTab from "./challenges/Badges";
import LeaderboardTab from "./challenges/Leaderboard";
import { Target, Award, Users, Activity, Zap, Heart, Star, Trophy, Calendar, Lightbulb, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
      case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'weekly': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case 'monthly': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
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
      <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800">
        {/* Header with Icon and Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${challenge.color} text-white shadow-lg`}>
            {challenge.icon}
          </div>
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(challenge.type)}`}>
              {challenge.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {challenge.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {challenge.current} / {challenge.target} {challenge.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
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
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Award className="w-4 h-4" />
              <span className="font-semibold">{challenge.points} pts</span>
            </span>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
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
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-red-400"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Join Challenge
            </Button>
          )}
        </div>

        {/* Tip */}
        {challenge.tip && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{challenge.tip}</p>
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
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-medium capitalize">{challenge.type}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-muted-foreground">Difficulty</div>
              <div className="font-medium capitalize">{challenge.difficulty}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-muted-foreground">Points</div>
              <div className="font-medium">{challenge.points} pts</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${challenge.color}`}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-2 block">Progress Value</label>
                  <Input
                    type="number"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    min={0}
                    max={challenge.target}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-2 block">Slider</label>
                  <input
                    type="range"
                    min={0}
                    max={challenge.target}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="font-medium">{challenge.startDate}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">End Date</div>
                <div className="font-medium">{challenge.endDate}</div>
              </div>
            </div>
          </div>

          {/* Tip */}
          {challenge.tip && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Pro Tip</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{challenge.tip}</p>
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
      icon: <Activity size={24} />,
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
      icon: <Zap size={24} />,
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
      icon: <Heart size={24} />,
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
      icon: <Star size={24} />,
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
      icon: <Target size={24} />,
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
      icon: <Trophy size={24} />,
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
      icon: <Trophy size={20} />,
      color: 'text-yellow-500',
      isEarned: true,
      earnedDate: '2024-01-15',
      points: 100
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Complete 5 weekly challenges',
      icon: <Award size={20} />,
      color: 'text-blue-500',
      isEarned: true,
      earnedDate: '2024-01-18',
      points: 250
    },
    {
      id: '3',
      name: 'Hydration Hero',
      description: 'Drink 8 glasses of water for 7 consecutive days',
      icon: <Heart size={20} />,
      color: 'text-cyan-500',
      isEarned: false,
      points: 300
    },
    {
      id: '4',
      name: 'Fitness Master',
      description: 'Complete 20 challenges total',
      icon: <Target size={20} />,
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
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Goals */}
        <div className="mb-8">
      <Goals userPoints={userPoints} activeCount={challenges.filter(c => c.isActive).length} />
        </div>
        
      {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'challenges' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Target className="w-5 h-5" />
              <span>Challenges</span>
            </div>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'badges' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Award className="w-5 h-5" />
              <span>Badges</span>
            </div>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'leaderboard' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Users className="w-5 h-5" />
              <span>Leaderboard</span>
            </div>
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
          
        {activeTab === 'badges' && (
          <motion.div
            key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BadgesTab badges={filteredBadges} />
          </motion.div>
        )}
          
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LeaderboardTab leaderboard={filteredLeaderboard} />
          </motion.div>
        )}
      </AnimatePresence>

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
              className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
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