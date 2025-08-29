import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { User, Calendar, Image } from "lucide-react";
import { useState } from "react";

interface GreetingStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function GreetingStep({ formData, updateFormData }: GreetingStepProps) {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        updateFormData('profilePhoto', base64String);
        
        // Also update localStorage immediately for sidebar
        const currentFormData = JSON.parse(localStorage.getItem('quizFormData') || '{}');
        currentFormData.profilePhoto = base64String;
        localStorage.setItem('quizFormData', JSON.stringify(currentFormData));
        
        // Trigger sidebar update
        window.dispatchEvent(new Event('user-updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <User size={20} />
            Let's get to know you! 👋
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            We'll use this information to personalize your health journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-medium">What should we call you? 😊</Label>
            <Input
              id="fullName"
              placeholder="Your awesome name here..."
              className="text-lg p-4 border-2 focus:border-blue-400 transition-all duration-200 hover:border-blue-300"
              value={formData.fullName || ""}
              onChange={(e) => {
                updateFormData('fullName', e.target.value);
                
                // Update localStorage immediately for sidebar and dashboard
                const currentFormData = JSON.parse(localStorage.getItem('quizFormData') || '{}');
                currentFormData.fullName = e.target.value;
                localStorage.setItem('quizFormData', JSON.stringify(currentFormData));
                
                // Also update user in localStorage for immediate reflection
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.name = e.target.value;
                localStorage.setItem('user', JSON.stringify(currentUser));
                
                // Trigger updates
                window.dispatchEvent(new Event('user-updated'));
              }}
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-base font-medium">When's your birthday? 🎂</Label>
            <Input
              id="dateOfBirth"
              type="date"
              className="text-lg p-4 border-2 focus:border-blue-400 transition-all duration-200 hover:border-blue-300"
              value={formData.dateOfBirth || ""}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            />
            <p className="text-xs text-gray-500">We'll use this to give you age-appropriate health tips</p>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-base font-medium">How do you identify? 🌟</Label>
            <Select value={formData.gender || ""} onValueChange={(value) => updateFormData('gender', value)}>
              <SelectTrigger className="text-lg p-4 border-2 focus:border-blue-400 transition-all duration-200 hover:border-blue-300">
                <SelectValue placeholder="Choose what feels right for you..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">This helps us provide relevant health information</p>
          </div>

          {/* Profile Photo */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Add your photo? 📸</Label>
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 transition-all duration-200 bg-blue-50/30 dark:bg-blue-950/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="flex items-center gap-2 px-6 py-3 text-lg border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <Image size={20} />
                {profilePhoto ? 'Change Photo' : 'Upload Your Photo'}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              {profilePhoto && (
                <div className="text-center">
                  <span className="text-sm text-green-600 font-medium">✓ {profilePhoto.name}</span>
                  <p className="text-xs text-gray-500 mt-1">Looking great! This will appear in your dashboard</p>
                </div>
              )}
              {!profilePhoto && (
                <p className="text-sm text-gray-500 text-center">Optional, but it makes your dashboard more personal!</p>
              )}
            </div>
          </div>

          {/* Dashboard Preference */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What motivates you most? ✨</Label>
            <RadioGroup
              value={formData.dashboardPreference || ""}
              onValueChange={(value) => updateFormData('dashboardPreference', value)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 border-2 border-transparent rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                <RadioGroupItem value="motivational_quotes" id="quotes" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="quotes" className="font-medium cursor-pointer">💪 Motivational quotes</Label>
                  <p className="text-sm text-gray-500 mt-1">Daily inspiration to keep you going strong</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border-2 border-transparent rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                <RadioGroupItem value="health_tips" id="tips" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="tips" className="font-medium cursor-pointer">🏥 Health tips</Label>
                  <p className="text-sm text-gray-500 mt-1">Practical advice for better health habits</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border-2 border-transparent rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                <RadioGroupItem value="both" id="both" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="both" className="font-medium cursor-pointer">🌟 Both quotes and tips</Label>
                  <p className="text-sm text-gray-500 mt-1">Get the best of both worlds!</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
