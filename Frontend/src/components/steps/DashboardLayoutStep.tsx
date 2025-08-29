import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LayoutDashboard, Bell, Users, Calendar, Activity, Heart, Pill, Droplets } from "lucide-react";

interface DashboardLayoutStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function DashboardLayoutStep({ formData, updateFormData }: DashboardLayoutStepProps) {
  const widgetOptions = [
    { id: "fitness", label: "Fitness & Activity", icon: Activity, description: "Step tracking, workout goals, exercise progress" },
    { id: "glucose", label: "Blood Glucose", icon: Droplets, description: "Glucose monitoring and trends" },
    { id: "medications", label: "Medication Schedule", icon: Pill, description: "Medication reminders and tracking" },
    { id: "care_team", label: "Care Team", icon: Users, description: "Healthcare providers and contacts" },
    { id: "appointments", label: "Appointments", icon: Calendar, description: "Upcoming medical appointments" },
    { id: "vitals", label: "Vital Signs", icon: Heart, description: "Blood pressure, heart rate monitoring" }
  ];

  const notificationOptions = [
    { id: "medication_reminders", label: "Medication Reminders" },
    { id: "appointment_alerts", label: "Appointment Alerts" },
    { id: "fitness_goals", label: "Fitness Goal Updates" },
    { id: "health_tips", label: "Daily Health Tips" },
    { id: "vital_alerts", label: "Vital Sign Alerts" },
    { id: "care_team_messages", label: "Care Team Messages" }
  ];

  const layoutOptions = [
    { id: "compact", label: "Compact View", description: "More widgets in less space" },
    { id: "comfortable", label: "Comfortable View", description: "Balanced layout with good spacing" },
    { id: "spacious", label: "Spacious View", description: "Larger widgets with more details" }
  ];

  const handleWidgetToggle = (widgetId: string) => {
    const currentWidgets = formData.visibleWidgets || [];
    const updatedWidgets = currentWidgets.includes(widgetId)
      ? currentWidgets.filter((w: string) => w !== widgetId)
      : [...currentWidgets, widgetId];
    updateFormData("visibleWidgets", updatedWidgets);
  };

  const handleNotificationToggle = (notificationId: string) => {
    const currentNotifications = formData.notificationPreferences || [];
    const updatedNotifications = currentNotifications.includes(notificationId)
      ? currentNotifications.filter((n: string) => n !== notificationId)
      : [...currentNotifications, notificationId];
    updateFormData("notificationPreferences", updatedNotifications);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Widgets */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <LayoutDashboard size={20} />
            Dashboard Widgets
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose which widgets you want to see on your dashboard
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgetOptions.map((widget) => {
              const Icon = widget.icon;
              const isSelected = (formData.visibleWidgets || []).includes(widget.id);
              
              return (
                <div
                  key={widget.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                  }`}
                  onClick={() => handleWidgetToggle(widget.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleWidgetToggle(widget.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} className={isSelected ? "text-purple-600" : "text-gray-500"} />
                        <Label className={`font-medium cursor-pointer ${
                          isSelected ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {widget.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {widget.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Layout Preference */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <LayoutDashboard size={20} />
            Layout Preference
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how you want your dashboard to be displayed
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.preferredLayout || "comfortable"}
            onValueChange={(value) => updateFormData('preferredLayout', value)}
            className="space-y-4"
          >
            {layoutOptions.map((layout) => (
              <div key={layout.id} className="flex items-start space-x-3">
                <RadioGroupItem value={layout.id} id={layout.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={layout.id} className="font-medium cursor-pointer">
                    {layout.label}
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {layout.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Bell size={20} />
            Notification Preferences
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select the types of notifications you want to receive
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notificationOptions.map((notification) => {
              const isSelected = (formData.notificationPreferences || []).includes(notification.id);
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                  }`}
                  onClick={() => handleNotificationToggle(notification.id)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleNotificationToggle(notification.id)}
                    />
                    <Label className={`cursor-pointer ${
                      isSelected ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {notification.label}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Users size={20} />
            Additional Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="careTeam"
              checked={formData.careTeamEnabled || false}
              onCheckedChange={(checked) => updateFormData('careTeamEnabled', checked)}
            />
            <Label htmlFor="careTeam" className="cursor-pointer">
              Enable Care Team features (connect with healthcare providers)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="appointments"
              checked={formData.appointmentReminders || false}
              onCheckedChange={(checked) => updateFormData('appointmentReminders', checked)}
            />
            <Label htmlFor="appointments" className="cursor-pointer">
              Enable appointment reminders and calendar integration
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
