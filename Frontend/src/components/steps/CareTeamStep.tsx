import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, MessageCircle, Users, Heart } from "lucide-react";

interface CareTeamStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function CareTeamStep({ formData, updateFormData }: CareTeamStepProps) {
  const handleCareTeamToggle = (member: string, checked: boolean) => {
    const currentTeam = formData.careTeamMembers || [];
    if (checked) {
      updateFormData('careTeamMembers', [...currentTeam, member]);
    } else {
      updateFormData('careTeamMembers', currentTeam.filter((m: string) => m !== member));
    }
  };

  const handleSupportToggle = (support: string, checked: boolean) => {
    const currentSupport = formData.supportPreferences || [];
    if (checked) {
      updateFormData('supportPreferences', [...currentSupport, support]);
    } else {
      updateFormData('supportPreferences', currentSupport.filter((s: string) => s !== support));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Stethoscope size={20} />
            Care Team & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Family Doctor */}
          <div className="space-y-2">
            <Label>Do you currently have a family doctor?</Label>
            <RadioGroup
              value={formData.hasFamilyDoctor || ""}
              onValueChange={(value) => updateFormData('hasFamilyDoctor', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="family-doctor-yes" />
                <Label htmlFor="family-doctor-yes">Yes, I have a family doctor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="family-doctor-no" />
                <Label htmlFor="family-doctor-no">No, I need to find one</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Care Team Assignment */}
          <div className="space-y-3">
            <Label>Would you like us to assign you a care team? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="doctor"
                  checked={(formData.careTeamMembers || []).includes('doctor')}
                  onCheckedChange={(checked) => handleCareTeamToggle('doctor', checked as boolean)}
                />
                <Label htmlFor="doctor" className="flex items-center gap-2">
                  <Stethoscope size={16} />
                  General Practitioner/Doctor
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nutritionist"
                  checked={(formData.careTeamMembers || []).includes('nutritionist')}
                  onCheckedChange={(checked) => handleCareTeamToggle('nutritionist', checked as boolean)}
                />
                <Label htmlFor="nutritionist" className="flex items-center gap-2">
                  <Heart size={16} />
                  Nutritionist/Dietitian
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fitness_coach"
                  checked={(formData.careTeamMembers || []).includes('fitness_coach')}
                  onCheckedChange={(checked) => handleCareTeamToggle('fitness_coach', checked as boolean)}
                />
                <Label htmlFor="fitness_coach" className="flex items-center gap-2">
                  <Users size={16} />
                  Fitness Coach/Trainer
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mental_health"
                  checked={(formData.careTeamMembers || []).includes('mental_health')}
                  onCheckedChange={(checked) => handleCareTeamToggle('mental_health', checked as boolean)}
                />
                <Label htmlFor="mental_health" className="flex items-center gap-2">
                  <Heart size={16} />
                  Mental Health Counselor
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="specialist"
                  checked={(formData.careTeamMembers || []).includes('specialist')}
                  onCheckedChange={(checked) => handleCareTeamToggle('specialist', checked as boolean)}
                />
                <Label htmlFor="specialist" className="flex items-center gap-2">
                  <Stethoscope size={16} />
                  Specialist (based on conditions)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no_team"
                  checked={(formData.careTeamMembers || []).includes('none')}
                  onCheckedChange={(checked) => handleCareTeamToggle('none', checked as boolean)}
                />
                <Label htmlFor="no_team">I don't need a care team right now</Label>
              </div>
            </div>
          </div>

          {/* Chat Support */}
          <div className="space-y-2">
            <Label>Do you want chat support from your care team inside the app?</Label>
            <RadioGroup
              value={formData.chatSupport || ""}
              onValueChange={(value) => updateFormData('chatSupport', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="chat-yes" />
                <Label htmlFor="chat-yes" className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  Yes, enable in-app chat
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="chat-no" />
                <Label htmlFor="chat-no">No, I prefer other communication methods</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Communication Preferences */}
          {formData.chatSupport === 'no' && (
            <div className="space-y-2">
              <Label>How would you prefer to communicate with your care team?</Label>
              <Select 
                value={formData.communicationMethod || ""} 
                onValueChange={(value) => updateFormData('communicationMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone calls</SelectItem>
                  <SelectItem value="video_call">Video calls</SelectItem>
                  <SelectItem value="in_person">In-person appointments only</SelectItem>
                  <SelectItem value="portal">Patient portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Support Preferences */}
          <div className="space-y-3">
            <Label>What type of support do you prefer? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication_suggestions"
                  checked={(formData.supportPreferences || []).includes('medication_suggestions')}
                  onCheckedChange={(checked) => handleSupportToggle('medication_suggestions', checked as boolean)}
                />
                <Label htmlFor="medication_suggestions">Medication suggestions and management</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diet_tips"
                  checked={(formData.supportPreferences || []).includes('diet_tips')}
                  onCheckedChange={(checked) => handleSupportToggle('diet_tips', checked as boolean)}
                />
                <Label htmlFor="diet_tips">Diet tips and meal planning</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exercise_guidance"
                  checked={(formData.supportPreferences || []).includes('exercise_guidance')}
                  onCheckedChange={(checked) => handleSupportToggle('exercise_guidance', checked as boolean)}
                />
                <Label htmlFor="exercise_guidance">Exercise guidance and fitness plans</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mental_health_support"
                  checked={(formData.supportPreferences || []).includes('mental_health_support')}
                  onCheckedChange={(checked) => handleSupportToggle('mental_health_support', checked as boolean)}
                />
                <Label htmlFor="mental_health_support">Mental health and wellness support</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lifestyle_coaching"
                  checked={(formData.supportPreferences || []).includes('lifestyle_coaching')}
                  onCheckedChange={(checked) => handleSupportToggle('lifestyle_coaching', checked as boolean)}
                />
                <Label htmlFor="lifestyle_coaching">Lifestyle coaching and habit formation</Label>
              </div>
            </div>
          </div>

          {/* Care Team Interaction Frequency */}
          <div className="space-y-2">
            <Label>How often would you like to interact with your care team?</Label>
            <Select 
              value={formData.careTeamFrequency || ""} 
              onValueChange={(value) => updateFormData('careTeamFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interaction frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily check-ins</SelectItem>
                <SelectItem value="weekly">Weekly updates</SelectItem>
                <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                <SelectItem value="monthly">Monthly consultations</SelectItem>
                <SelectItem value="as_needed">Only when I need help</SelectItem>
                <SelectItem value="emergency_only">Emergency situations only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Preferences */}
          <div className="space-y-2">
            <Label>Care team data sharing preference</Label>
            <RadioGroup
              value={formData.dataSharing || ""}
              onValueChange={(value) => updateFormData('dataSharing', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full_access" id="full-access" />
                <Label htmlFor="full-access">Full access to my health data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited_access" id="limited-access" />
                <Label htmlFor="limited-access">Limited access (I choose what to share)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consultation_only" id="consultation-only" />
                <Label htmlFor="consultation-only">Consultation only (no data sharing)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
