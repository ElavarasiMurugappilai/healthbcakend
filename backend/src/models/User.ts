import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Profile interfaces for embedded documents
interface IHealthCondition {
  name: string;
  diagnosedDate?: Date;
  severity?: 'mild' | 'moderate' | 'severe';
}

interface ICareTeamMember {
  name: string;
  role: string;
  img?: string;
  badge?: number;
  unread?: boolean;
  messages?: any[];
}

interface IProfile {
  // Personal Info
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  
  // Health Info
  conditions?: IHealthCondition[];
  allergies?: string;
  smoker?: boolean;
  alcohol?: 'none' | 'occasional' | 'regular';
  sleepHours?: number[];
  
  // Fitness & Goals
  exercise?: 'none' | 'occasional' | 'regular';
  exerciseTypes?: string[];
  exerciseDuration?: number[];
  fitnessGoals?: string;
  waterIntake?: number[];
  stepGoal?: number[];
  
  // Health Tracking Preferences
  trackGlucose?: boolean;
  trackBP?: boolean;
  trackHR?: boolean;
  trackSleep?: boolean;
  trackWeight?: boolean;
  
  // Medications
  takeMeds?: boolean;
  prescriptionFile?: string;
  medicationReminders?: boolean;
  
  // Preferences
  joinChallenges?: boolean;
  challengeDifficulty?: 'easy' | 'medium' | 'hard';
  rewardType?: 'points' | 'badges' | 'discounts';
  notificationsEnabled?: boolean;
  notificationTiming?: 'morning' | 'evening' | 'anytime';
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  
  // Units
  units?: {
    weight?: 'kg' | 'lbs';
    height?: 'cm' | 'ft';
    glucose?: 'mg/dL' | 'mmol/L';
  };
  
  // Care Team
  careTeam?: ICareTeamMember[];
  selectedDoctors?: string[];
  
  // Dashboard Preferences
  selectedCards?: string[];
  
  // Metadata
  completedAt?: Date;
  lastUpdated?: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  profile?: IProfile;
  isVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): any;
}

const HealthConditionSchema = new Schema({
  name: { type: String, required: true },
  diagnosedDate: { type: Date },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'] }
});

const CareTeamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  img: { type: String },
  badge: { type: Number, default: 0 },
  unread: { type: Boolean, default: false },
  messages: [{ type: Schema.Types.Mixed }]
});

const ProfileSchema = new Schema({
  // Personal Info
  age: { type: Number, min: 0, max: 150 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  weight: { type: Number, min: 0 },
  height: { type: Number, min: 0 },
  
  // Health Info
  conditions: [HealthConditionSchema],
  allergies: { type: String },
  smoker: { type: Boolean, default: false },
  alcohol: { type: String, enum: ['none', 'occasional', 'regular'], default: 'none' },
  sleepHours: [{ type: Number, min: 0, max: 24 }],
  
  // Fitness & Goals
  exercise: { type: String, enum: ['none', 'occasional', 'regular'], default: 'none' },
  exerciseTypes: [{ type: String }],
  exerciseDuration: [{ type: Number, min: 0 }],
  fitnessGoals: { type: String },
  waterIntake: [{ type: Number, min: 0 }],
  stepGoal: [{ type: Number, min: 0 }],
  
  // Health Tracking Preferences
  trackGlucose: { type: Boolean, default: false },
  trackBP: { type: Boolean, default: false },
  trackHR: { type: Boolean, default: false },
  trackSleep: { type: Boolean, default: false },
  trackWeight: { type: Boolean, default: false },
  
  // Medications
  takeMeds: { type: Boolean, default: false },
  prescriptionFile: { type: String },
  medicationReminders: { type: Boolean, default: false },
  
  // Preferences
  joinChallenges: { type: Boolean, default: false },
  challengeDifficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  rewardType: { type: String, enum: ['points', 'badges', 'discounts'] },
  notificationsEnabled: { type: Boolean, default: true },
  notificationTiming: { type: String, enum: ['morning', 'evening', 'anytime'], default: 'anytime' },
  pushNotifications: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  
  // Units
  units: {
    weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    height: { type: String, enum: ['cm', 'ft'], default: 'cm' },
    glucose: { type: String, enum: ['mg/dL', 'mmol/L'], default: 'mg/dL' }
  },
  
  // Care Team
  careTeam: [CareTeamMemberSchema],
  selectedDoctors: [{ type: String }],
  
  // Dashboard Preferences
  selectedCards: {
    type: [String],
    enum: ['fitness', 'bloodGlucose', 'careTeam', 'medicationSchedule'],
    default: []
  },
  
  // Metadata
  completedAt: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  _id: false // Embedded document doesn't need its own _id
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  profile: {
    type: ProfileSchema,
    default: () => ({})
  },
  // Main user fields for quiz preferences (for easy access)
  selectedCards: {
    type: [String],
    enum: ['fitness', 'bloodGlucose', 'careTeam', 'medicationSchedule'],
    default: []
  },
  selectedDoctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
  dashboardStyle: { type: String },
  fitnessGoal: { type: String },
  activityLevel: { type: String },
  stepTarget: { type: Number },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (exclude sensitive data)
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  
  return userObject;
};

// Update profile.lastUpdated on profile changes
UserSchema.pre('save', function(next) {
  if (this.isModified('profile')) {
    this.profile!.lastUpdated = new Date();
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
