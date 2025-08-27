import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PreferencesStepProps {
  formData: any;
  updateFormData: (key: string, value: any) => void;
}

export default function PreferencesStep({
  formData,
  updateFormData,
}: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      {/* Join Challenges */}
      <div className="flex items-center justify-between">
        <Label>Join Challenges</Label>
        <Switch
          checked={formData.joinChallenges}
          onCheckedChange={(val) => updateFormData("joinChallenges", val)}
        />
      </div>

      {/* Challenge Difficulty + Reward Type (only if challenges enabled) */}
      {formData.joinChallenges && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Challenge Difficulty</Label>
            <Select
              value={formData.challengeDifficulty}
              onValueChange={(val) => updateFormData("challengeDifficulty", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reward Type</Label>
            <Select
              value={formData.rewardType}
              onValueChange={(val) => updateFormData("rewardType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="badges">Badges</SelectItem>
                <SelectItem value="discounts">Discounts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <Label>Enable Notifications</Label>
        <Switch
          checked={formData.notificationsEnabled}
          onCheckedChange={(val) => updateFormData("notificationsEnabled", val)}
        />
      </div>

      {formData.notificationsEnabled && (
        <div className="space-y-4">
          {/* Notification Timing */}
          <div>
            <Label>Notification Timing</Label>
            <RadioGroup
              value={formData.notificationTiming}
              onValueChange={(val) => updateFormData("notificationTiming", val)}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="morning" id="notif-morning" />
                <Label htmlFor="notif-morning">Morning</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="evening" id="notif-evening" />
                <Label htmlFor="notif-evening">Evening</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="anytime" id="notif-anytime" />
                <Label htmlFor="notif-anytime">Anytime</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notification Channels */}
          <div className="space-y-2">
            <Label>Notification Channels</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <span>Push Notifications</span>
                <Switch
                  checked={formData.pushNotifications}
                  onCheckedChange={(val) =>
                    updateFormData("pushNotifications", val)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <span>Email</span>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(val) =>
                    updateFormData("emailNotifications", val)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <span>SMS</span>
                <Switch
                  checked={formData.smsNotifications}
                  onCheckedChange={(val) =>
                    updateFormData("smsNotifications", val)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
