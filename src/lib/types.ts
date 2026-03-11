export type WorkoutType = "run" | "lift" | "yoga" | "other";

export interface Workout {
  id: string;
  date: string; // ISO date string
  type: WorkoutType | string;
  durationMinutes: number;
  notes?: string;
}

export interface Settings {
  id: string;
  unitDuration: "minutes" | "hours";
  workoutTypes: string[];
  weeklyGoal?: number;
  reminderEnabled?: boolean;
  reminderTime?: string;
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

