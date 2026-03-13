export type WorkoutType = "run" | "lift" | "yoga" | "other";

export interface Workout {
  id: string;
  date: string; // ISO date string
  type: WorkoutType | string;
  durationMinutes: number;
  notes?: string;
  /** Optional: estimated calories burned (from tracker or manual) */
  caloriesBurned?: number;
}

export type ThemeMode = "light" | "dark";
export type AccentColor = "emerald" | "blue" | "violet" | "amber";

export interface Settings {
  id: string;
  unitDuration: "minutes" | "hours";
  workoutTypes: string[];
  weeklyGoal?: number;
  reminderEnabled?: boolean;
  reminderTime?: string;
  /** Theme: light or dark */
  theme?: ThemeMode;
  /** Accent for buttons, progress, links */
  accent?: AccentColor;
  /** Goal: target weight (kg) */
  targetWeightKg?: number;
  /** Goal: calories to burn per week (from workouts) */
  weeklyCaloriesBurnedGoal?: number;
  /** Goal: total workout minutes per week */
  weeklyMinutesGoal?: number;
}

/** User body profile for BMI and calorie estimates */
export interface BodyProfile {
  heightCm?: number;
  weightKg?: number;
  /** For calorie formula (Mifflin-St Jeor) */
  gender?: "male" | "female" | "other";
  birthYear?: number;
}

/** Single weight log entry for tracking over time */
export interface WeightEntry {
  date: string; // ISO date
  weightKg: number;
}

export interface WorkoutSummary {
  totalThisWeek: number;
  totalThisMonth: number;
  byType: Record<string, number>;
  currentStreakWeeks: number;
  longestStreakWeeks: number;
  mostActiveWeekday: string | null;
  workoutsPerWeekLast8: number[];
}

export interface GoalSettings {
  weeklyTarget: number;
  reminderEnabled: boolean;
  reminderTime: string; // "HH:mm"
}

