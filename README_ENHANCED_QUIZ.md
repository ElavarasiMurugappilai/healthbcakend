# Enhanced Dashboard Quiz System

## Overview

The Enhanced Dashboard Quiz System is a comprehensive 7-step questionnaire designed to customize the health dashboard based on user preferences and health needs. This system replaces the basic quiz with a more detailed, user-friendly interface that collects specific data for each dashboard component.

## Features

### 7-Step Quiz Flow
1. **Personal Profile** - Basic user information and dashboard preferences
2. **Health Monitoring** - Glucose tracking and vital signs preferences  
3. **Hydration Goals** - Water intake tracking and reminder settings
4. **Appointments** - Schedule management and calendar integration
5. **Fitness & Activity** - Exercise goals and activity tracking
6. **Care Team** - Healthcare provider connections and communication preferences
7. **Medications** - Medication management and reminder system

### Key Improvements
- **Mobile-first responsive design** with ShadCN components
- **Progress tracking** with visual progress bar and step indicators
- **Auto-save functionality** - Progress saved to localStorage
- **User-friendly inputs** - Sliders, dropdowns, checkboxes instead of manual typing
- **Conditional logic** - Questions adapt based on previous answers
- **Backend integration** - Data stored in user profile for dashboard customization

## File Structure

```
Frontend/src/
├── pages/
│   └── EnhancedQuizPage.tsx          # Main quiz page with navigation
├── components/steps/
│   ├── GreetingStep.tsx              # Step 1: Personal profile
│   ├── GlucoseVitalsStep.tsx         # Step 2: Health monitoring
│   ├── WaterIntakeStep.tsx           # Step 3: Hydration goals
│   ├── ScheduleStep.tsx              # Step 4: Appointments
│   ├── FitnessActivityStep.tsx       # Step 5: Fitness & activity
│   ├── CareTeamStep.tsx              # Step 6: Care team
│   └── MedicationStep.tsx            # Step 7: Medications

Backend/src/routes/
└── profile.ts                        # Added /dashboard-quiz endpoint
```

## Usage

### Accessing the Quiz
Navigate to `/dashboard-quiz` to start the enhanced quiz flow.

### Data Structure
The quiz collects comprehensive data stored in the user profile:

```typescript
interface DashboardQuizData {
  // Step 1: Personal Profile
  fullName: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto: File | null;
  dashboardPreference: string;

  // Step 2: Health Monitoring
  hasDiabetes: string;
  diabetesType: string;
  glucoseMonitoringFrequency: string;
  trackingVitals: string[];
  monitoringGoal: string;

  // Step 3: Water Intake
  dailyWaterGlasses: number[];
  waterReminders: string;
  personalizedWaterGoal: string;
  // ... more fields

  // Steps 4-7: Similar structured data
}
```

### Backend Integration
- **Endpoint**: `POST /api/profile/dashboard-quiz`
- **Storage**: Data saved to `user.profile.dashboardPreferences`
- **Completion tracking**: `dashboardQuizCompleted` flag set to true

## Components Used

### ShadCN Components
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Button`, `Input`, `Label`, `Textarea`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `RadioGroup`, `RadioGroupItem`
- `Checkbox`, `Slider`, `Progress`

### Icons (Lucide React)
- Step-specific icons for visual clarity
- Navigation arrows and completion checkmarks

## Key Features

### 1. Progressive Enhancement
Each step builds upon previous answers with conditional logic:
- Diabetes type selection only appears if user has diabetes
- Medication reminders only shown if user takes medications
- Calendar sync options based on appointment preferences

### 2. User Experience
- **Visual progress tracking** with completion percentage
- **Step navigation** with previous/next buttons
- **Auto-save** prevents data loss
- **Responsive design** works on all devices
- **Smooth animations** between steps

### 3. Data Validation
- Required fields prevent progression until completed
- Type-safe data structures with TypeScript
- Backend validation and sanitization

### 4. Accessibility
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly
- High contrast design

## Testing

To test the complete quiz flow:

1. Start the backend server: `npm run dev` in `/backend`
2. Start the frontend: `npm run dev` in `/Frontend`
3. Navigate to `/dashboard-quiz`
4. Complete all 7 steps
5. Verify data is saved to user profile in database
6. Check dashboard customization reflects quiz answers

## Future Enhancements

- **Quiz analytics** - Track completion rates and drop-off points
- **A/B testing** - Test different question flows
- **Multi-language support** - Internationalization
- **Voice input** - Accessibility enhancement
- **Smart defaults** - Pre-fill based on user behavior
- **Quiz versioning** - Handle schema changes over time

## Technical Notes

- Built with **Vite + React + TypeScript + Tailwind CSS**
- Uses **ShadCN/UI** component library for consistent design
- **Framer Motion** for smooth animations
- **Sonner** for toast notifications
- **Lucide React** for icons
- **MongoDB** for data persistence
