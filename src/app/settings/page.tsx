"use client";

import { FormEvent, useState, useRef } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import type { Workout } from "@/lib/types";

export default function SettingsPage() {
  const { workouts, settings, updateSettings, replaceWorkouts } = useFitnessData();
  const [unitDuration, setUnitDuration] = useState(settings.unitDuration);
  const [workoutTypes, setWorkoutTypes] = useState(
    settings.workoutTypes.join(", "),
  );
  const [weeklyGoal, setWeeklyGoal] = useState(String(settings.weeklyGoal ?? 3));
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled ?? false);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime ?? "09:00");
  const [saved, setSaved] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    const cleanedTypes = workoutTypes
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const goalNum = parseInt(weeklyGoal, 10);
    updateSettings({
      unitDuration,
      workoutTypes: cleanedTypes.length ? cleanedTypes : settings.workoutTypes,
      weeklyGoal: Number.isFinite(goalNum) && goalNum > 0 ? goalNum : undefined,
      reminderEnabled,
      reminderTime: reminderTime || "09:00",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const exportJson = () => {
    const data = JSON.stringify(workouts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibefit-workouts-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = ["date", "type", "durationMinutes", "notes"];
    const rows = workouts.map((w) =>
      [w.date, w.type, w.durationMinutes, (w.notes ?? "").replace(/"/g, '""')].map((c) => `"${c}"`).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibefit-workouts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = reader.result as string;
        const parsed = JSON.parse(raw) as unknown;
        const list = Array.isArray(parsed) ? parsed : [];
        const valid: Workout[] = list.filter(
          (w): w is Workout =>
            w &&
            typeof w === "object" &&
            typeof (w as Workout).id === "string" &&
            typeof (w as Workout).date === "string" &&
            typeof (w as Workout).type === "string" &&
            typeof (w as Workout).durationMinutes === "number",
        );
        if (valid.length === 0 && list.length > 0) {
          setImportMessage("File had no valid workout entries.");
          return;
        }
        if (valid.length > 0 && typeof window !== "undefined" && !window.confirm(`Replace all ${workouts.length} workouts with ${valid.length} from file?`)) {
          return;
        }
        replaceWorkouts(valid.length ? valid : []);
        setImportMessage(`Imported ${valid.length} workouts.`);
        setTimeout(() => setImportMessage(null), 3000);
      } catch {
        setImportMessage("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="w-full max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Units, workout types, goals, reminders, and backup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 card">
        <h2 className="text-sm font-medium text-slate-200">Units & types</h2>
        <div>
          <p className="label">Duration unit</p>
          <div className="flex gap-3">
            <button
              type="button"
              className={`btn-secondary ${unitDuration === "minutes" ? "border-emerald-400 text-emerald-400" : ""}`}
              onClick={() => setUnitDuration("minutes")}
            >
              Minutes
            </button>
            <button
              type="button"
              className={`btn-secondary ${unitDuration === "hours" ? "border-emerald-400 text-emerald-400" : ""}`}
              onClick={() => setUnitDuration("hours")}
            >
              Hours
            </button>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="types">Default workout types</label>
          <p className="mb-1 text-xs text-slate-500">Comma-separated. Used in Log workout form.</p>
          <input
            id="types"
            className="input"
            value={workoutTypes}
            onChange={(e) => setWorkoutTypes(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary">Save settings</button>
          {saved && <span className="text-xs text-emerald-400">Saved!</span>}
        </div>
      </form>

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Weekly goal & reminder</h2>
        <div>
          <label className="label" htmlFor="goal">Workouts per week (goal)</label>
          <input
            id="goal"
            type="number"
            min={1}
            max={14}
            className="input w-24"
            value={weeklyGoal}
            onChange={(e) => setWeeklyGoal(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            id="reminder"
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
          />
          <label htmlFor="reminder" className="text-sm text-slate-300">Remind me to log workouts</label>
        </div>
        {reminderEnabled && (
          <div>
            <label className="label" htmlFor="reminderTime">Reminder time</label>
            <input
              id="reminderTime"
              type="time"
              className="input w-32"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        )}
        <div className="pt-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              const goalNum = parseInt(weeklyGoal, 10);
              updateSettings({
                weeklyGoal: Number.isFinite(goalNum) && goalNum > 0 ? goalNum : undefined,
                reminderEnabled,
                reminderTime: reminderTime || "09:00",
              });
            }}
          >
            Save goal & reminder
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Backup & restore</h2>
        <p className="text-xs text-slate-400">
          Export your data to keep a copy or move to another device. Import replaces current data.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={exportJson}>
            Export JSON
          </button>
          <button type="button" className="btn-secondary" onClick={exportCsv}>
            Export CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Import JSON
          </button>
        </div>
        {importMessage && (
          <p className="text-sm text-slate-300">{importMessage}</p>
        )}
      </div>

      <div className="card space-y-2">
        <h2 className="text-sm font-medium text-slate-200">Sync across devices</h2>
        <p className="text-xs text-slate-400">
          Cloud sync with sign-in is planned. For now, use <strong>Export JSON</strong> on one device and <strong>Import JSON</strong> on another to move your data.
        </p>
      </div>
    </div>
  );
}