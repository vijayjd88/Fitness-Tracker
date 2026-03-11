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
}

export interface WorkoutSummary {
  totalThisWeek: number;
  totalThisMonth: number;
  byType: Record<string, number>;
}

