import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { User, Target, Users, Pill, Activity, Dumbbell, Droplets, Star, Check, Plus, ArrowLeft, ArrowRight, Heart, Zap, Stethoscope } from 'lucide-react';
import API from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface QuizData {
  dateOfBirth: string;
  gender: string;
  dashboardStyle: string;
  fitnessGoal: string;
  activityLevel: string;
  stepTarget: number;
  selectedDoctors: any[];
  personalDoctors: any[];
  pendingMedications: any[];
  acceptedMedications: any[];
  selectedCards: string[];
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  photo?: string;
  rating?: number;
  experience?: number;
  isSystemDoctor: boolean;
}

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  suggestedBy: string;
  reason?: string;
}

const QUIZ_STORAGE_KEY = "healthapp.quiz.data";

const EnhancedQuizPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [systemDoctors, setSystemDoctors] = useState<Doctor[]>([]);
  const [pendingMedications, setPendingMedications] = useState<Medication[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState<QuizData>({
    dateOfBirth: "",
    gender: "",
    dashboardStyle: "card",
    fitnessGoal: "",
    activityLevel: "",
    stepTarget: 8000,
    selectedDoctors: [],
    personalDoctors: [],
    pendingMedications: [],
    acceptedMedications: [],
    selectedCards: ["fitness", "glucose"],
  });

  const quizSteps = [
    { id: 1, title: "Personal Profile", icon: User, description: "Basic information and preferences" },
    { id: 2, title: "Fitness & Health Goals", icon: Target, description: "Set your health objectives" },
    { id: 3, title: "Health Tracking & Doctors", icon: Users, description: "Connect with healthcare providers" },
    { id: 4, title: "Medication Management", icon: Pill, description: "Manage your medications" },
    { id: 5, title: "Dashboard Selection", icon: Activity, description: "Choose your dashboard cards" },
  ];

  const fitnessGoals = [
    { id: "weight-loss", title: "Weight Loss", icon: "🏃‍♀️", description: "Lose weight and get fit" },
    { id: "muscle-gain", title: "Muscle Gain", icon: "💪", description: "Build strength and muscle" },
    { id: "endurance", title: "Endurance", icon: "🚴‍♂️", description: "Improve cardiovascular health" },
    { id: "flexibility", title: "Flexibility", icon: "🧘‍♀️", description: "Increase flexibility and mobility" },
    { id: "general-health", title: "General Health", icon: "❤️", description: "Overall health and wellness" },
  ];

  const activityLevels = [
    { id: "sedentary", title: "Sedentary", description: "Little to no exercise" },
    { id: "light", title: "Light", description: "Light exercise 1-3 days/week" },
    { id: "moderate", title: "Moderate", description: "Moderate exercise 3-5 days/week" },
    { id: "active", title: "Active", description: "Hard exercise 6-7 days/week" },
    { id: "very-active", title: "Very Active", description: "Very hard exercise, physical job" },
  ];

  const dashboardCards = [
    { id: "fitness", title: "Fitness Goals", icon: Dumbbell, description: "Track your fitness progress" },
    { id: "glucose", title: "Glucose Monitoring", icon: Droplets, description: "Monitor blood glucose levels" },
    { id: "medications", title: "Medication Schedule", icon: Pill, description: "Manage your medications" },
    { id: "care-team", title: "My Care Team", icon: Users, description: "Connect with your doctors" },
    { id: "water", title: "Water Intake", icon: Droplets, description: "Track daily water consumption" },
    { id: "sleep", title: "Sleep Tracking", icon: Star, description: "Monitor sleep patterns" },
  ];

  // Load system doctors and check auth on component mount
  useEffect(() => {
    const initializeQuiz = async () => {
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Load saved quiz data from localStorage
        const savedData = localStorage.getItem(QUIZ_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(prev => ({ ...prev, ...parsedData }));
        }

        // Fetch system doctors
        const doctorsResponse = await API.get('/doctors/system');
        setSystemDoctors(doctorsResponse.data);

        // Fetch pending medications
        const medicationsResponse = await API.get('/medications/pending');
        setPendingMedications(medicationsResponse.data);

        setAuthChecked(true);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast.error('Failed to load quiz data');
      }
    };

    initializeQuiz();
  }, [navigate]);

  const updateFormData = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    // Save to localStorage for persistence
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(newFormData));
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save profile and dashboard preferences
      const profileResponse = await API.post("/profile/dashboard-quiz", formData);

      if (profileResponse.data.success) {
        toast.success("Quiz completed successfully!");
        localStorage.removeItem(QUIZ_STORAGE_KEY);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to save quiz data");
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  // Floating animated icons
  const floatingIcons = [
    { icon: Heart, delay: 0, duration: 6 },
    { icon: Activity, delay: 1, duration: 8 },
    { icon: Stethoscope, delay: 2, duration: 7 },
    { icon: Pill, delay: 3, duration: 9 },
    { icon: Users, delay: 4, duration: 6 },
    { icon: Target, delay: 5, duration: 8 },
  ];

  // Step Components
  const PersonalProfileStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Dashboard Style</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {[
            { id: 'card', title: 'Card View', description: 'Clean card-based layout' },
            { id: 'compact', title: 'Compact View', description: 'Dense information display' }
          ].map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all ${
                formData.dashboardStyle === style.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => updateFormData('dashboardStyle', style.id)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium">{style.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{style.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const FitnessGoalsStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6">
      <div>
        <Label>Fitness Goal</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {fitnessGoals.map((goal) => (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all ${
                formData.fitnessGoal === goal.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => updateFormData('fitnessGoal', goal.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{goal.icon}</div>
                <h3 className="font-medium">{goal.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label>Activity Level</Label>
        <div className="grid grid-cols-1 gap-3 mt-2">
          {activityLevels.map((level) => (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all ${
                formData.activityLevel === level.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => updateFormData('activityLevel', level.id)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{level.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{level.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label>Daily Step Target: {formData.stepTarget.toLocaleString()}</Label>
        <Slider
          value={[formData.stepTarget]}
          onValueChange={(value) => updateFormData('stepTarget', value[0])}
          max={20000}
          min={5000}
          step={1000}
          className="mt-2"
        />
      </div>
    </div>
  );

  const DoctorsStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">System Doctors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemDoctors.map((doctor) => (
            <Card
              key={doctor._id}
              className={`cursor-pointer transition-all ${
                formData.selectedDoctors.includes(doctor._id)
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => {
                const selected = formData.selectedDoctors.includes(doctor._id)
                  ? formData.selectedDoctors.filter((id: string) => id !== doctor._id)
                  : [...formData.selectedDoctors, doctor._id];
                updateFormData('selectedDoctors', selected);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doctor.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
                    {doctor.rating && (
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{doctor.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Personal Doctors</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Personal Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doctorName">Name</Label>
                  <Input id="doctorName" placeholder="Doctor's name" />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" placeholder="e.g., Cardiologist" />
                </div>
                <Button className="w-full">Add Doctor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );

  const MedicationsStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Pending Medication Suggestions</h3>
        {pendingMedications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No pending medication suggestions.</p>
        ) : (
          <div className="space-y-4">
            {pendingMedications.map((medication) => (
              <Card key={medication._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{medication.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {medication.dosage} - {medication.frequency}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Suggested by: {medication.suggestedBy}</p>
                    {medication.reason && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{medication.reason}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Decline</Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const DashboardSelectionStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Choose Dashboard Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all ${
                  formData.selectedCards.includes(card.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  const selected = formData.selectedCards.includes(card.id)
                    ? formData.selectedCards.filter((id: string) => id !== card.id)
                    : [...formData.selectedCards, card.id];
                  updateFormData('selectedCards', selected);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{card.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  const stepComponents = [
    PersonalProfileStep,
    FitnessGoalsStep,
    DoctorsStep,
    MedicationsStep,
    DashboardSelectionStep,
  ];

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Floating animated icons */}
      {floatingIcons.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className="absolute text-blue-200 dark:text-blue-800 opacity-20"
            initial={{ y: "100vh", x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200) }}
            animate={{
              y: "-10vh",
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <IconComponent size={24} />
          </motion.div>
        );
      })}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Health Profile Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Let's personalize your health monitoring experience
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {currentStep + 1} of {quizSteps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-4 max-w-4xl mx-auto w-full">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {quizSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                    index === currentStep
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : index < currentStep
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check size={16} />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-current opacity-30" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step */}
          <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {quizSteps[currentStep].title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quizSteps[currentStep].description}
                      </p>
                    </div>
                    
                    <CurrentStepComponent
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center max-w-4xl mx-auto w-full px-4 sm:px-0 py-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 h-10 sm:h-11"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {currentStep + 1} of {quizSteps.length} steps
              </p>
            </div>

            {currentStep === quizSteps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 h-10 sm:h-11"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span className="hidden sm:inline">Complete Setup</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 h-10 sm:h-11"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuizPage;
