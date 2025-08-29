import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Bell, RefreshCw } from "lucide-react";

interface ScheduleStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function ScheduleStep({ formData, updateFormData }: ScheduleStepProps) {
  const handleCalendarToggle = (calendar: string, checked: boolean) => {
    const currentCalendars = formData.calendarSync || [];
    if (checked) {
      updateFormData('calendarSync', [...currentCalendars, calendar]);
    } else {
      updateFormData('calendarSync', currentCalendars.filter((c: string) => c !== calendar));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Calendar size={20} />
            Schedule & Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Regular Doctor Visits */}
          <div className="space-y-2">
            <Label>Do you currently visit a doctor regularly?</Label>
            <RadioGroup
              value={formData.hasRegularDoctor || ""}
              onValueChange={(value) => updateFormData('hasRegularDoctor', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="doctor-yes" />
                <Label htmlFor="doctor-yes">Yes, I have regular checkups</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="doctor-no" />
                <Label htmlFor="doctor-no">No, I visit only when needed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Checkup Frequency */}
          <div className="space-y-2">
            <Label>How often do you prefer checkups?</Label>
            <Select 
              value={formData.checkupFrequency || ""} 
              onValueChange={(value) => updateFormData('checkupFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select checkup frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Every 3 months</SelectItem>
                <SelectItem value="biannually">Every 6 months</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="as_needed">Only when needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Sync */}
          <div className="space-y-3">
            <Label>Do you want to sync appointments with your calendar?</Label>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="google-calendar"
                  checked={(formData.calendarSync || []).includes('google')}
                  onCheckedChange={(checked) => handleCalendarToggle('google', checked as boolean)}
                />
                <Label htmlFor="google-calendar" className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Google Calendar
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outlook-calendar"
                  checked={(formData.calendarSync || []).includes('outlook')}
                  onCheckedChange={(checked) => handleCalendarToggle('outlook', checked as boolean)}
                />
                <Label htmlFor="outlook-calendar" className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Outlook Calendar
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apple-calendar"
                  checked={(formData.calendarSync || []).includes('apple')}
                  onCheckedChange={(checked) => handleCalendarToggle('apple', checked as boolean)}
                />
                <Label htmlFor="apple-calendar" className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Apple Calendar
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-sync"
                  checked={(formData.calendarSync || []).includes('none')}
                  onCheckedChange={(checked) => handleCalendarToggle('none', checked as boolean)}
                />
                <Label htmlFor="no-sync">No calendar sync needed</Label>
              </div>
            </div>
          </div>

          {/* Appointment Reminders */}
          <div className="space-y-2">
            <Label>Would you like reminders before appointments?</Label>
            <RadioGroup
              value={formData.appointmentReminders || ""}
              onValueChange={(value) => updateFormData('appointmentReminders', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="reminders-yes" />
                <Label htmlFor="reminders-yes" className="flex items-center gap-2">
                  <Bell size={16} />
                  Yes, send me reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="reminders-no" />
                <Label htmlFor="reminders-no">No reminders needed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reminder Timing */}
          {formData.appointmentReminders === 'yes' && (
            <div className="space-y-2">
              <Label>When should we remind you?</Label>
              <Select 
                value={formData.reminderTiming || ""} 
                onValueChange={(value) => updateFormData('reminderTiming', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 hour before</SelectItem>
                  <SelectItem value="2hours">2 hours before</SelectItem>
                  <SelectItem value="1day">1 day before</SelectItem>
                  <SelectItem value="2days">2 days before</SelectItem>
                  <SelectItem value="1week">1 week before</SelectItem>
                  <SelectItem value="custom">Multiple reminders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preferred Appointment Times */}
          <div className="space-y-2">
            <Label>What's your preferred appointment time?</Label>
            <Select 
              value={formData.preferredAppointmentTime || ""} 
              onValueChange={(value) => updateFormData('preferredAppointmentTime', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="early_morning">Early Morning (7-9 AM)</SelectItem>
                <SelectItem value="morning">Morning (9-12 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12-4 PM)</SelectItem>
                <SelectItem value="evening">Evening (4-7 PM)</SelectItem>
                <SelectItem value="flexible">I'm flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Travel Time Consideration */}
          <div className="space-y-2">
            <Label>Should we consider travel time for appointments?</Label>
            <RadioGroup
              value={formData.considerTravelTime || ""}
              onValueChange={(value) => updateFormData('considerTravelTime', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="travel-yes" />
                <Label htmlFor="travel-yes" className="flex items-center gap-2">
                  <Clock size={16} />
                  Yes, add buffer time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="travel-no" />
                <Label htmlFor="travel-no">No, just appointment time</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
