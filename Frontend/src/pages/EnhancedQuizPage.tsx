import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { User, Target, Users, Pill, Activity, Dumbbell, Droplets, Star, Check, Plus, ArrowLeft, ArrowRight, Heart, Zap, Stethoscope } from 'lucide-react';
import API from '../api';
import { useGlobalState } from "../context/globalState"; // Correct relative path
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
  isSystemApproved: boolean;
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pendingMedications, setPendingMedications] = useState<Medication[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [personalDoctorName, setPersonalDoctorName] = useState('');
  const [personalDoctorSpecialization, setPersonalDoctorSpecialization] = useState('');
  const [isAddDoctorDialogOpen, setIsAddDoctorDialogOpen] = useState(false);


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
    selectedCards: ["fitness", "bloodGlucose"],
  });

  // Use global state and setter
  const { setGlobalState } = useGlobalState();

  // Handle medication acceptance
  const handleMedicationAccept = async (medication: Medication) => {
    try {
      const response = await API.post('/medications/accept', { medication });
      if (response.data.success) {
        toast.success('Medication accepted and added to schedule');
        // Remove from pending medications
        setPendingMedications(prev => prev.filter(med => med._id !== medication._id));
        // Add to accepted medications in form data
        updateFormData('acceptedMedications', [...formData.acceptedMedications, medication]);
      }
    } catch (error) {
      console.error('Error accepting medication:', error);
      toast.error('Failed to accept medication');
    }
  };

  // Handle medication decline
  const handleMedicationDecline = async (medication: Medication) => {
    try {
      const response = await API.post('/medications/decline', { 
        medicationId: medication._id,
        reason: 'User declined'
      });
      if (response.data.success) {
        toast.success('Medication declined');
        // Remove from pending medications
        setPendingMedications(prev => prev.filter(med => med._id !== medication._id));
      }
    } catch (error) {
      console.error('Error declining medication:', error);
      toast.error('Failed to decline medication');
    }
  };

  // Handle adding personal doctor
  const handleAddPersonalDoctor = async () => {
    if (!personalDoctorName.trim() || !personalDoctorSpecialization.trim()) {
      toast.error('Please fill in both name and specialization');
      return;
    }

    try {
      const response = await API.post('/doctors/personal', {
        name: personalDoctorName.trim(),
        specialization: personalDoctorSpecialization.trim()
      });
      
      if (response.data.success) {
        const newDoctor = response.data.data;
        // Add to personal doctors in form data
        updateFormData('personalDoctors', [...formData.personalDoctors, newDoctor]);
        toast.success('Personal doctor added successfully');
        
        // Reset form and close dialog
        setPersonalDoctorName('');
        setPersonalDoctorSpecialization('');
        setIsAddDoctorDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding personal doctor:', error);
      toast.error('Failed to add personal doctor');
    }
  };

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
    { id: "bloodGlucose", title: "Blood Glucose", icon: Droplets, description: "Monitor blood glucose levels" },
    { id: "medicationSchedule", title: "Medication Schedule", icon: Pill, description: "Manage your medications" },
    { id: "careTeam", title: "My Care Team", icon: Users, description: "Connect with your doctors" },
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
          
          // Validate and fix selectedCards to only include valid enum values
          const validCardIds = ['fitness', 'bloodGlucose', 'careTeam', 'medicationSchedule'];
          if (parsedData.selectedCards) {
            parsedData.selectedCards = parsedData.selectedCards
              .map((card: string) => card === 'glucose' ? 'bloodGlucose' : card)
              .filter((card: string) => validCardIds.includes(card));
          }
          
          setFormData(prev => ({ ...prev, ...parsedData }));
        }

        // Fetch system doctors with fallback
        try {
          const doctorsResponse = await API.get('/doctors/system');
          if (doctorsResponse.data.success) {
            setDoctors(doctorsResponse.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch system doctors, using fallback:', error);
          // Fallback mock data to prevent quiz from breaking
          const fallbackDoctors = [
            {
              _id: 'fallback-1',
              name: 'Dr. Sarah Johnson',
              specialization: 'Cardiologist',
              rating: 4.8,
              experience: 10,
              photo: undefined,
              isSystemApproved: true
            },
            {
              _id: 'fallback-2', 
              name: 'Dr. Michael Chen',
              specialization: 'Endocrinologist',
              rating: 4.7,
              experience: 8,
              photo: undefined,
              isSystemApproved: true
            },
            {
              _id: 'fallback-3',
              name: 'Dr. Emily Rodriguez',
              specialization: 'General Practitioner',
              rating: 4.9,
              experience: 12,
              photo: undefined,
              isSystemApproved: true
            }
          ];
          setDoctors(fallbackDoctors);
          toast.error('Failed to load system doctors, using default options');
        }

        // Fetch pending medications with fallback
        try {
          const medicationsResponse = await API.get('/medications/pending');
          if (medicationsResponse.data.success) {
            setPendingMedications(medicationsResponse.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch pending medications:', error);
          setPendingMedications([]); // Empty array fallback
        }

        setAuthChecked(true);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast.error('Failed to load quiz data');
      }
    };

    initializeQuiz();
  }, [navigate]);

  const saveFitnessGoal = async (goal: string) => {
    try {
      // Save to the database
      await API.post('/goals', { fitnessGoal: goal });

      // Update global state (e.g., using context or Redux)
      setGlobalState((prevState) => ({
        ...prevState,
        fitnessGoal: goal,
      }));

      toast.success('Fitness goal updated successfully!');
    } catch (error) {
      console.error('Failed to save fitness goal:', error);
      toast.error('Failed to update fitness goal.');
    }
  };

  const saveSelectedDoctors = async (doctors: any[]) => {
    try {
      // Save to the database
      await API.post('/doctors/selected', { selectedDoctors: doctors });

      // Update global state (e.g., using context or Redux)
      setGlobalState((prevState) => ({
        ...prevState,
        selectedDoctors: doctors,
      }));

      toast.success('Selected doctors updated successfully!');
    } catch (error) {
      console.error('Failed to save selected doctors:', error);
      toast.error('Failed to update selected doctors.');
    }
  };

  // Update the `updateFormData` function to handle fitness goal selection
  const updateFormData = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Save to localStorage for persistence
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(newFormData));

    // Save fitness goal to the database and update global state
    if (field === 'fitnessGoal') {
      saveFitnessGoal(value);
    }

    // Save selected doctors to the database and update global state
    if (field === 'selectedDoctors') {
      saveSelectedDoctors(value);
    }
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
      console.log("📤 Frontend sending quiz data:", JSON.stringify(formData, null, 2));
      
      // Save profile and dashboard preferences
      const payload = {
        ...formData,
        selectedDoctors: formData.selectedDoctors
      };
      const profileResponse = await API.post("/profile/dashboard-quiz", payload);

      // Also save selected doctors to the dedicated endpoint
      if (formData.selectedDoctors.length > 0) {
        try {
          await API.post("/doctors/selected", { selectedDoctors: formData.selectedDoctors });
          console.log("✅ Selected doctors saved successfully");
        } catch (doctorError) {
          console.error("❌ Failed to save selected doctors:", doctorError);
          // Don't fail the entire submission if this fails
        }
      }

      if (profileResponse.data.success) {
        // Update localStorage user object with quiz preferences
        const existingUser = localStorage.getItem("user");
        if (existingUser && existingUser !== "undefined" && existingUser !== "null") {
          try {
            const parsedUser = JSON.parse(existingUser);
            const updatedUser = {
              ...parsedUser,
              selectedCards: formData.selectedCards,
              selectedDoctors: formData.selectedDoctors,
              dashboardStyle: formData.dashboardStyle,
              fitnessGoal: formData.fitnessGoal,
              activityLevel: formData.activityLevel,
              stepTarget: formData.stepTarget
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Dispatch event to update dashboard
            window.dispatchEvent(new Event("user-updated"));
            
            console.log("✅ Updated localStorage user with quiz data:", updatedUser);
          } catch (error) {
            console.error("❌ Error updating localStorage user:", error);
          }
        }
        
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

  const DoctorsStep = ({ formData, updateFormData }: { formData: QuizData; updateFormData: (key: keyof QuizData, value: any) => void }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">System Doctors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
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
          <Dialog open={isAddDoctorDialogOpen} onOpenChange={setIsAddDoctorDialogOpen}>
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
                  <Input 
                    id="doctorName" 
                    placeholder="Doctor's name" 
                    value={personalDoctorName}
                    onChange={(e) => setPersonalDoctorName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    placeholder="e.g., Cardiologist" 
                    value={personalDoctorSpecialization}
                    onChange={(e) => setPersonalDoctorSpecialization(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddPersonalDoctor}
                  disabled={!personalDoctorName.trim() || !personalDoctorSpecialization.trim()}
                >
                  Add Doctor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Display Personal Doctors */}
        {formData.personalDoctors.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Your Personal Doctors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.personalDoctors.map((doctor) => (
                <Card key={doctor._id} className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{doctor.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
                      <Badge variant="outline" className="text-xs mt-1">Personal</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const MedicationsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Pending Medication Suggestions</h3>
        {pendingMedications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No pending medication suggestions.</p>
        ) : (
          <div className="space-y-4">
            {pendingMedications.map((medication: Medication) => (
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleMedicationDecline(medication)}
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleMedicationAccept(medication)}
                    >
                      Accept
                    </Button>
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
                    ? formData.selectedCards.filter((id) => id !== card.id)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative">
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen overflow-y-auto">
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
