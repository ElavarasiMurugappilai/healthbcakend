import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Pill, Stethoscope, Droplets, Dumbbell, Heart, Activity, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ------------------- Step Components -------------------

const ProfileStep = ({ data, onChange }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="age">Age</Label>
      <Input
        id="age"
        type="number"
        placeholder="Enter your age"
        value={data.age || ""}
        onChange={(e) => onChange({ age: e.target.value })}
        className="w-full"
      />
    </div>
    <div>
      <Label htmlFor="gender">Gender</Label>
      <Select onValueChange={(value) => onChange({ gender: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select gender" value={data.gender} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="weight">Weight (kg)</Label>
      <Input
        id="weight"
        type="number"
        placeholder="Enter your weight in kg"
        value={data.weight || ""}
        onChange={(e) => onChange({ weight: e.target.value })}
        className="w-full"
      />
    </div>
    <div>
      <Label htmlFor="height">Height (cm)</Label>
      <Input
        id="height"
        type="number"
        placeholder="Enter your height in cm"
        value={data.height || ""}
        onChange={(e) => onChange({ height: e.target.value })}
        className="w-full"
      />
    </div>
    <div className="md:col-span-2">
      <Label htmlFor="conditions">Conditions</Label>
      <Input
        id="conditions"
        placeholder="Any pre-existing conditions?"
        value={data.conditions || ""}
        onChange={(e) => onChange({ conditions: e.target.value })}
        className="w-full"
      />
    </div>
    <div className="md:col-span-2">
      <Label htmlFor="allergies">Allergies</Label>
      <Input
        id="allergies"
        placeholder="Any allergies?"
        value={data.allergies || ""}
        onChange={(e) => onChange({ allergies: e.target.value })}
        className="w-full"
      />
    </div>
  </div>
);

const FitnessStep = ({ data, onChange }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="exercise">Exercise Habits</Label>
      <Select onValueChange={(value) => onChange({ exercise: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select habit" value={data.exercise} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="occasional">Occasional</SelectItem>
          <SelectItem value="regular">Regular</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="fitnessGoals">Fitness Goals</Label>
      <Input
        id="fitnessGoals"
        placeholder="What are your fitness goals?"
        value={data.fitnessGoals || ""}
        onChange={(e) => onChange({ fitnessGoals: e.target.value })}
        className="w-full"
      />
    </div>
    <div>
      <Label htmlFor="waterIntake">Water Intake (L/day)</Label>
      <Input
        id="waterIntake"
        type="number"
        placeholder="How much water do you drink daily (L)?"
        value={data.waterIntake || ""}
        onChange={(e) => onChange({ waterIntake: e.target.value })}
        className="w-full"
      />
    </div>
    <div>
      <Label htmlFor="stepGoal">Step Goal</Label>
      <Input
        id="stepGoal"
        type="number"
        placeholder="What's your daily step goal?"
        value={data.stepGoal || ""}
        onChange={(e) => onChange({ stepGoal: e.target.value })}
        className="w-full"
      />
    </div>
  </div>
);

const HealthTrackingStep = ({ data, onChange }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="md:col-span-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="trackGlucose"
          checked={data.trackGlucose || false}
          onCheckedChange={(checked) => onChange({ trackGlucose: checked })}
        />
        <Label htmlFor="trackGlucose">Track Glucose</Label>
      </div>
    </div>
    <div className="md:col-span-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="trackBP"
          checked={data.trackBP || false}
          onCheckedChange={(checked) => onChange({ trackBP: checked })}
        />
        <Label htmlFor="trackBP">Track Blood Pressure</Label>
      </div>
    </div>
    <div className="md:col-span-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="trackSleep"
          checked={data.trackSleep || false}
          onCheckedChange={(checked) => onChange({ trackSleep: checked })}
        />
        <Label htmlFor="trackSleep">Track Sleep</Label>
      </div>
    </div>
    <div className="md:col-span-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="trackHR"
          checked={data.trackHR || false}
          onCheckedChange={(checked) => onChange({ trackHR: checked })}
        />
        <Label htmlFor="trackHR">Track Heart Rate</Label>
      </div>
    </div>
    <div>
      <Label htmlFor="units">Preferred Units</Label>
      <Select onValueChange={(value) => onChange({ units: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select units" value={data.units} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="metric">Metric</SelectItem>
          <SelectItem value="imperial">Imperial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const MedicationsStep = ({ data, onChange }: any) => (
  <div className="grid grid-cols-1 gap-4">
    <div className="flex items-center space-x-2">
      <Checkbox
        id="takeMeds"
        checked={data.takeMeds || false}
        onCheckedChange={(checked) => onChange({ takeMeds: checked })}
      />
      <Label htmlFor="takeMeds">Do you take medications?</Label>
    </div>
    {data.takeMeds && (
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
          <TabsTrigger value="manual">Enter Manually</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Input
            type="file"
            onChange={(e) => onChange({ prescription: e.target.files?.[0] })}
            className="w-full"
          />
        </TabsContent>
        <TabsContent value="manual">
          <Label htmlFor="medName">Medication Name</Label>
          <Input
            id="medName"
            placeholder="Enter medication name"
            value={data.medName || ""}
            onChange={(e) => onChange({ medName: e.target.value })}
            className="w-full"
          />
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            placeholder="Enter dosage"
            value={data.dosage || ""}
            onChange={(e) => onChange({ dosage: e.target.value })}
            className="w-full"
          />
        </TabsContent>
      </Tabs>
    )}
  </div>
);

const ReviewStep = ({ data }: any) => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-2">Review & Confirm</h2>
    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto max-h-[60vh]">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

// ------------------- Steps Array -------------------

const steps = [
  { label: "Profile", component: ProfileStep },
  { label: "Fitness & Goals", component: FitnessStep },
  { label: "Health Tracking", component: HealthTrackingStep },
  { label: "Medications", component: MedicationsStep },
  { label: "Review", component: ReviewStep },
];

// ------------------- Main QuizPage -------------------

const QuizPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (values: any) => setForm((prev: any) => ({ ...prev, ...values }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CurrentStep = steps[step].component;

  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col">
      <Toaster richColors />

      {/* Full Screen Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-orange-500/30 dark:text-orange-400/30 animate-float-slow">
          <Pill size={32} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-blue-500/25 dark:text-blue-400/25 animate-float-medium">
          <Stethoscope size={28} />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-blue-600/35 dark:text-blue-500/35 animate-float-fast">
          <Droplets size={24} />
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-orange-600/20 dark:text-orange-500/20 animate-float-slow">
          <Dumbbell size={36} />
        </div>
        <div className="absolute top-1/2 left-1/6 text-orange-500/30 dark:text-orange-400/30 animate-float-medium">
          <Heart size={26} />
        </div>
        <div className="absolute top-2/3 right-1/6 text-blue-500/25 dark:text-blue-400/25 animate-float-fast">
          <Activity size={30} />
        </div>
        <div className="absolute bottom-1/3 right-1/2 text-orange-600/20 dark:text-orange-500/20 animate-float-slow">
          <Zap size={22} />
        </div>
        <div className="absolute top-1/6 right-1/3 text-blue-600/25 dark:text-blue-500/25 animate-float-medium">
          <Star size={20} />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 flex-1 flex flex-col p-6 overflow-auto"
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">Onboarding Wizard</h1>
          <Progress value={((step + 1) / steps.length) * 100} className="mt-2" />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{steps[step].label}</span>
            <span>Step {step + 1} of {steps.length}</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto">
          <CurrentStep data={form} onChange={handleChange} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
          ) : (
            <Button
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPage;
