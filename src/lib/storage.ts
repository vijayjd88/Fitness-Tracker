import { BodyProfile, Settings, WeightEntry, Workout, WorkoutSummary } from "@/lib/types";

const WORKOUTS_KEY = "fitness-tracker.workouts";
const SETTINGS_KEY = "fitness-tracker.settings";
const BODY_PROFILE_KEY = "fitness-tracker.bodyProfile";
const WEIGHT_HISTORY_KEY = "fitness-tracker.weightHistory";

const DEFAULT_SETTINGS: Settings = {
  id: "default",
  unitDuration: "minutes",
  workoutTypes: ["Walk", "Run", "Lift", "Yoga", "Muay Thai", "Tennis", "Hike", "Other"],
  theme: "dark",
  accent: "emerald",
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

export function updateWorkout(id: string, patch: Partial<Omit<Workout, "id">>) {
  const current = loadWorkouts();
  const index = current.findIndex((w) => w.id === id);
  if (index === -1) return current;
  const next = [...current];
  next[index] = { ...next[index], ...patch };
  next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  saveWorkouts(next);
  return next;
}

export function deleteWorkout(id: string) {
  const current = loadWorkouts();
  const next = current.filter((w) => w.id !== id);
  saveWorkouts(next);
  return next;
}

export function replaceWorkouts(workouts: Workout[]) {
  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  saveWorkouts(sorted);
  return sorted;
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

export function loadBodyProfile(): BodyProfile {
  return loadFromStorage<BodyProfile>(BODY_PROFILE_KEY, {});
}

export function saveBodyProfile(profile: BodyProfile) {
  saveToStorage(BODY_PROFILE_KEY, profile);
}

export function loadWeightHistory(): WeightEntry[] {
  const entries = loadFromStorage<WeightEntry[]>(WEIGHT_HISTORY_KEY, []);
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addWeightEntry(entry: WeightEntry) {
  const current = loadWeightHistory();
  const filtered = current.filter((e) => e.date !== entry.date);
  const next = [entry, ...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  saveToStorage(WEIGHT_HISTORY_KEY, next);
  return next;
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

function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export function summarizeWorkouts(workouts: Workout[]): WorkoutSummary {
  const now = new Date();
  let totalThisWeek = 0;
  let totalThisMonth = 0;
  const byType: Record<string, number> = {};
  const byWeek: Record<string, number> = {};
  const byWeekday: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const w of workouts) {
    const d = new Date(w.date);
    if (isSameWeek(d, now)) totalThisWeek += 1;
    if (isSameMonth(d, now)) totalThisMonth += 1;
    byType[w.type] = (byType[w.type] ?? 0) + 1;
    const wk = getWeekKey(d);
    byWeek[wk] = (byWeek[wk] ?? 0) + 1;
    byWeekday[d.getDay()] = (byWeekday[d.getDay()] ?? 0) + 1;
  }

  const thisWeekKey = getWeekKey(now);
  const allWeeks: string[] = [];
  for (let i = 0; i < 52; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - 7 * i);
    allWeeks.push(getWeekKey(d));
  }
  let currentStreakWeeks = 0;
  for (const wk of allWeeks) {
    if ((byWeek[wk] ?? 0) > 0) currentStreakWeeks += 1;
    else break;
  }
  const weekKeys = Object.keys(byWeek).sort();
  let longestStreakWeeks = 0;
  let run = 0;
  for (let i = 0; i < weekKeys.length; i++) {
    if ((byWeek[weekKeys[i]] ?? 0) > 0) {
      run += 1;
      longestStreakWeeks = Math.max(longestStreakWeeks, run);
    } else {
      run = 0;
    }
  }

  const last8Weeks: number[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - 7 * i);
    last8Weeks.push(byWeek[getWeekKey(d)] ?? 0);
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let mostActiveWeekday: string | null = null;
  let maxCount = 0;
  for (let i = 0; i < 7; i++) {
    if ((byWeekday[i] ?? 0) > maxCount) {
      maxCount = byWeekday[i] ?? 0;
      mostActiveWeekday = weekdays[i];
    }
  }

  return {
    totalThisWeek,
    totalThisMonth,
    byType,
    currentStreakWeeks,
    longestStreakWeeks,
    mostActiveWeekday,
    workoutsPerWeekLast8: last8Weeks,
  };
}

