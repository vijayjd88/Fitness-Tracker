"use client";

import { useEffect, useRef } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";

export function ReminderEffect() {
  const { summary, settings } = useFitnessData();
  const notified = useRef(false);

  useEffect(() => {
    if (!settings.reminderEnabled || !settings.reminderTime || typeof window === "undefined") return;
    const [h, m] = settings.reminderTime.split(":").map(Number);
    const targetMinutes = h * 60 + m;

    const check = () => {
      const now = new Date();
      const currentMinutes = now.getMinutes() + now.getHours() * 60;
      if (currentMinutes < targetMinutes || currentMinutes > targetMinutes + 2) {
        notified.current = false;
        return;
      }
      if (notified.current) return;
      const goal = settings.weeklyGoal ?? 3;
      if (summary.totalThisWeek >= goal) return;
      if (!("Notification" in window) || Notification.permission === "denied") return;
      if (Notification.permission === "default") {
        Notification.requestPermission();
        return;
      }
      notified.current = true;
      new Notification("VibeFit reminder", {
        body: `You're at ${summary.totalThisWeek}/${goal} workouts this week. Log one?`,
      });
    };

    Notification.requestPermission();
    const id = setInterval(check, 60 * 1000);
    check();
    return () => clearInterval(id);
  }, [settings.reminderEnabled, settings.reminderTime, settings.weeklyGoal, summary.totalThisWeek]);

  return null;
}
