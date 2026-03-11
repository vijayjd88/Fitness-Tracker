"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addWorkout,
  loadSettings,
  loadWorkouts,
  saveSettings,
  summarizeWorkouts,
} from "@/lib/storage";
import type { Settings, Workout, WorkoutSummary } from "@/lib/types";

interface UseFitnessData {
  workouts: Workout[];
  summary: WorkoutSummary;
  settings: Settings;
  isReady: boolean;
  addWorkout: (workout: Omit<Workout, "id">) => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

const EMPTY_SUMMARY: WorkoutSummary = {
  totalThisWeek: 0,
  totalThisMonth: 0,
  byType: {},
};

export function useFitnessData(): UseFitnessData {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setWorkouts(loadWorkouts());
    setSettings(loadSettings());
  }, []);

  const summary = useMemo<WorkoutSummary>(
    () => (workouts.length ? summarizeWorkouts(workouts) : EMPTY_SUMMARY),
    [workouts],
  );

  const isReady = settings !== null;

  const handleAddWorkout = (workout: Omit<Workout, "id">) => {
    const withId: Workout = { ...workout, id: crypto.randomUUID() };
    const next = addWorkout(withId);
    setWorkouts(next);
  };

  const updateSettings = (partial: Partial<Settings>) => {
    if (!settings) return;
    const next: Settings = { ...settings, ...partial };
    setSettings(next);
    saveSettings(next);
  };

  return {
    workouts,
    summary,
    settings: settings ?? DEFAULT_FALLBACK_SETTINGS,
    isReady,
    addWorkout: handleAddWorkout,
    updateSettings,
  };
}

const DEFAULT_FALLBACK_SETTINGS: Settings = {
  id: "default",
  unitDuration: "minutes",
  workoutTypes: ["Run", "Lift", "Yoga", "Other"],
};

