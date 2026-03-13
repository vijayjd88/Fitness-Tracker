"use client";

import { FormEvent, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFitnessData } from "@/hooks/useFitnessData";
import { clearGuest, isGuest } from "@/lib/guest";
import { bmi, dailyCaloriesRequired } from "@/lib/calories";
import { applyTheme } from "@/components/ThemeInit";
import type { Workout } from "@/lib/types";
import type { ThemeMode, AccentColor } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const {
    workouts,
    settings,
    bodyProfile,
    weightHistory,
    updateSettings,
    updateBodyProfile,
    addWeightEntry,
    replaceWorkouts,
  } = useFitnessData();
  const [unitDuration, setUnitDuration] = useState(settings.unitDuration);
  const [workoutTypes, setWorkoutTypes] = useState(
    settings.workoutTypes.join(", "),
  );
  const [weeklyGoal, setWeeklyGoal] = useState(String(settings.weeklyGoal ?? 3));
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled ?? false);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime ?? "09:00");
  const [heightCm, setHeightCm] = useState(String(bodyProfile.heightCm ?? ""));
  const [weightKg, setWeightKg] = useState(String(bodyProfile.weightKg ?? ""));
  const [gender, setGender] = useState<string>(bodyProfile.gender ?? "");
  const [birthYear, setBirthYear] = useState(String(bodyProfile.birthYear ?? ""));
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().slice(0, 10));
  const [newWeightKg, setNewWeightKg] = useState("");
  const [theme, setTheme] = useState<ThemeMode>(settings.theme ?? "dark");
  const [accent, setAccent] = useState<AccentColor>(settings.accent ?? "emerald");
  const [targetWeightKg, setTargetWeightKg] = useState(String(settings.targetWeightKg ?? ""));
  const [weeklyCaloriesBurnedGoal, setWeeklyCaloriesBurnedGoal] = useState(
    String(settings.weeklyCaloriesBurnedGoal ?? ""),
  );
  const [weeklyMinutesGoal, setWeeklyMinutesGoal] = useState(String(settings.weeklyMinutesGoal ?? ""));
  const [saved, setSaved] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);
  const [bodySaved, setBodySaved] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bmiValue =
    bodyProfile.weightKg && bodyProfile.heightCm
      ? bmi(bodyProfile.weightKg, bodyProfile.heightCm)
      : null;
  const dailyCal =
    bodyProfile.weightKg && bodyProfile.heightCm
      ? dailyCaloriesRequired(
          bodyProfile.weightKg,
          bodyProfile.heightCm,
          bodyProfile.gender === "male" || bodyProfile.gender === "female" ? bodyProfile.gender : undefined,
          bodyProfile.birthYear,
        )
      : null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    const cleanedTypes = workoutTypes
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const goalNum = parseInt(weeklyGoal, 10);
    const tw = targetWeightKg.trim() ? Number(targetWeightKg) : undefined;
    const wc = weeklyCaloriesBurnedGoal.trim() ? Number(weeklyCaloriesBurnedGoal) : undefined;
    const wm = weeklyMinutesGoal.trim() ? Number(weeklyMinutesGoal) : undefined;
    updateSettings({
      unitDuration,
      workoutTypes: cleanedTypes.length ? cleanedTypes : settings.workoutTypes,
      weeklyGoal: Number.isFinite(goalNum) && goalNum > 0 ? goalNum : undefined,
      reminderEnabled,
      reminderTime: reminderTime || "09:00",
      theme,
      accent,
      targetWeightKg: Number.isFinite(tw) && tw > 0 ? tw : undefined,
      weeklyCaloriesBurnedGoal: Number.isFinite(wc) && wc >= 0 ? wc : undefined,
      weeklyMinutesGoal: Number.isFinite(wm) && wm > 0 ? wm : undefined,
    });
    applyTheme(theme, accent);
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
    <div className="w-full max-w-3xl space-y-8">
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
        <h2 className="text-sm font-medium text-slate-200">Appearance</h2>
        <div>
          <p className="label">Theme</p>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`btn-secondary flex-1 ${theme === t ? "ring-2 ring-[rgb(var(--accent-500))]" : ""}`}
                onClick={() => { setTheme(t); applyTheme(t, accent); updateSettings({ theme: t, accent }); }}
              >
                {t === "dark" ? "Dark" : "Light"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Accent color</p>
          <div className="flex flex-wrap gap-2">
            {(["emerald", "blue", "violet", "amber"] as const).map((a) => (
              <button
                key={a}
                type="button"
                className={`btn-secondary capitalize ${accent === a ? "ring-2 ring-[rgb(var(--accent-500))]" : ""}`}
                onClick={() => { setAccent(a); applyTheme(theme, a); updateSettings({ theme, accent: a }); }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Goals (targets)</h2>
        <p className="text-xs text-slate-400">
          Set targets to see progress on the dashboard. Weight goal uses your current weight from Body; weekly goals use this week&apos;s totals.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="targetWeight">Target weight (kg)</label>
            <input
              id="targetWeight"
              type="number"
              step="0.1"
              className="input"
              placeholder="Optional"
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="weeklyCalGoal">Weekly calories burned (kcal)</label>
            <input
              id="weeklyCalGoal"
              type="number"
              min={0}
              className="input"
              placeholder="e.g. 2000"
              value={weeklyCaloriesBurnedGoal}
              onChange={(e) => setWeeklyCaloriesBurnedGoal(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="weeklyMinGoal">Weekly minutes (workouts)</label>
            <input
              id="weeklyMinGoal"
              type="number"
              min={1}
              className="input"
              placeholder="e.g. 150"
              value={weeklyMinutesGoal}
              onChange={(e) => setWeeklyMinutesGoal(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Save with &quot;Save settings&quot; at the top (Units & types form).
        </p>
      </div>

      <div id="body" className="card space-y-4 scroll-mt-4">
        <h2 className="text-sm font-medium text-slate-200">Body & weight</h2>
        <p className="text-xs text-slate-400">
          Manage height, weight, BMI, and weight-over-time here only—separate from logging workouts. These values are used for daily calorie estimate and for estimating calories burned when you log a workout (optional).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="heightCm">Height (cm)</label>
            <input
              id="heightCm"
              type="number"
              min={100}
              max={250}
              className="input"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="weightKg">Current weight (kg)</label>
            <input
              id="weightKg"
              type="number"
              step="0.1"
              min={30}
              max={300}
              className="input"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="gender">Gender (for calories)</label>
            <select
              id="gender"
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="birthYear">Birth year (for calories)</label>
            <input
              id="birthYear"
              type="number"
              min={1920}
              max={new Date().getFullYear()}
              className="input"
              placeholder="e.g. 1990"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>
        </div>
        {(bmiValue !== null || dailyCal !== null) && (
          <div className="rounded-lg bg-slate-800/50 px-3 py-2 text-sm text-slate-300">
            {bmiValue !== null && (
              <span>BMI: <strong className="text-slate-100">{bmiValue}</strong></span>
            )}
            {bmiValue !== null && dailyCal !== null && " · "}
            {dailyCal !== null && (
              <span>Daily calories (approx): <strong className="text-slate-100">{dailyCal} kcal</strong></span>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-end gap-3 pt-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              const h = heightCm.trim() ? Number(heightCm) : undefined;
              const w = weightKg.trim() ? Number(weightKg) : undefined;
              updateBodyProfile({
                heightCm: h,
                weightKg: w,
                gender: gender === "male" || gender === "female" || gender === "other" ? gender : undefined,
                birthYear: birthYear.trim() && Number.isFinite(Number(birthYear)) ? Number(birthYear) : undefined,
              });
              setBodySaved(true);
              setTimeout(() => setBodySaved(false), 1500);
            }}
          >
            Save body
          </button>
          {bodySaved && <span className="text-xs text-emerald-400">Saved!</span>}
        </div>
        <div className="border-t border-slate-700 pt-4">
          <p className="label mb-2">Log weight (track over time)</p>
          <div className="flex flex-wrap items-end gap-2">
            <input
              type="date"
              className="input w-40"
              value={newWeightDate}
              onChange={(e) => setNewWeightDate(e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              min={30}
              max={300}
              className="input w-24"
              placeholder="kg"
              value={newWeightKg}
              onChange={(e) => setNewWeightKg(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                const w = Number(newWeightKg);
                if (!Number.isFinite(w) || w <= 0) return;
                addWeightEntry({ date: newWeightDate, weightKg: w });
                setWeightKg(String(w));
                updateBodyProfile({ weightKg: w });
                setNewWeightKg("");
                setNewWeightDate(new Date().toISOString().slice(0, 10));
              }}
            >
              Add weight
            </button>
          </div>
          {weightHistory.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Latest: {weightHistory[0].weightKg} kg on {new Date(weightHistory[0].date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Fitness tracker connections</h2>
        <p className="text-xs text-slate-400">
          Heart rate, SpO₂, and other metrics will only be visible here once the app connects to Garmin Connect, Apple Health, or Fitbit. Until then, you can log workouts and body stats manually. Integration coming soon.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Apple Watch", "Garmin", "Fitbit"].map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 px-3 py-3"
            >
              <span className="text-sm font-medium text-slate-300">{name}</span>
              <span className="text-xs text-slate-500">Coming soon</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Weekly goal & reminder</h2>
        <p className="text-xs text-slate-400">
          Turn reminders on, set a time, and click Save. When the browser asks, allow notifications. You’ll get a desktop notification at that time <strong>only if the app is open in a tab</strong> (e.g. in the background). One reminder per day when you’re below your goal.
        </p>
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
        <div className="flex items-center gap-3 pt-2">
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
              setGoalSaved(true);
              setTimeout(() => setGoalSaved(false), 2000);
            }}
          >
            Save goal & reminder
          </button>
          {goalSaved && (
            <span className="text-sm text-emerald-400">Saved!</span>
          )}
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Your data — why numbers can change</h2>
        <p className="text-xs text-slate-400">
          All data (workouts, body stats, settings) is stored <strong>on this device, in this browser</strong>. To always see the same numbers: use the same browser and don’t clear site data. A different browser or device has its own empty data. <strong>Export JSON</strong> below to backup or move data; cloud sync is planned so one account will follow you everywhere.
        </p>
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

      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-slate-200">Use LiveFit on your iPhone</h2>
        <p className="text-xs text-slate-400">
          Open LiveFit in <strong>Safari</strong> on your iPhone (your deployed URL, e.g. fitness-tracker-xlzi.vercel.app). Tap the <strong>Share</strong> button (square with arrow), then <strong>Add to Home Screen</strong>. It will open like an app. Your data is stored on that iPhone’s Safari for this site — use the same phone to see the same data, or Export/Import to move it.
        </p>
      </div>

      <div className="card space-y-2">
        <h2 className="text-sm font-medium text-slate-200">Sync across devices</h2>
        <p className="text-xs text-slate-400">
          Cloud sync with sign-in is planned. For now, use <strong>Export JSON</strong> on one device and <strong>Import JSON</strong> on another to move your data.
        </p>
      </div>

      <div className="card space-y-2">
        <h2 className="text-sm font-medium text-slate-200">Account</h2>
        <p className="text-xs text-slate-400">
          Sign out to switch account or continue as guest on another device.
        </p>
        <button
          type="button"
          onClick={() => {
            if (isGuest()) {
              clearGuest();
              router.replace("/welcome");
            } else {
              signOut({ callbackUrl: "/welcome" });
            }
          }}
          className="btn-secondary border-slate-600 text-slate-300 hover:border-slate-500"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}