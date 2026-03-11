import { Settings, Workout, WorkoutSummary } from "@/lib/types";

const WORKOUTS_KEY = "fitness-tracker.workouts";
const SETTINGS_KEY = "fitness-tracker.settings";

const DEFAULT_SETTINGS: Settings = {
  id: "default",
  unitDuration: "minutes",
  workoutTypes: ["Run", "Lift", "Yoga", "Muay Thai", "Tennis", "Hike", "Other"],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (e.g., quota)
  }
}

export function loadWorkouts(): Workout[] {
  return loadFromStorage<Workout[]>(WORKOUTS_KEY, []);
}

export function saveWorkouts(workouts: Workout[]) {
  saveToStorage(WORKOUTS_KEY, workouts);
}

export function addWorkout(workout: Workout) {
  const current = loadWorkouts();
  const next = [workout, ...current].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  saveWorkouts(next);
  return next;
}

export function loadSettings(): Settings {
  const stored = loadFromStorage<Settings | null>(SETTINGS_KEY, null);
  if (!stored) {
    saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return stored;
}

export function saveSettings(settings: Settings) {
  saveToStorage(SETTINGS_KEY, settings);
}

function isSameWeek(date: Date, now: Date) {
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}

function isSameMonth(date: Date, now: Date) {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function summarizeWorkouts(workouts: Workout[]): WorkoutSummary {
  const now = new Date();
  let totalThisWeek = 0;
  let totalThisMonth = 0;
  const byType: Record<string, number> = {};

  for (const w of workouts) {
    const d = new Date(w.date);
    if (isSameWeek(d, now)) totalThisWeek += 1;
    if (isSameMonth(d, now)) totalThisMonth += 1;
    const key = w.type;
    byType[key] = (byType[key] ?? 0) + 1;
  }

  return { totalThisWeek, totalThisMonth, byType };
}

