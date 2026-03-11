"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useFitnessData } from "@/hooks/useFitnessData";

export default function LogPage() {
  const { settings, addWorkout } = useFitnessData();
  const router = useRouter();

  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [type, setType] = useState<string>(
    settings.workoutTypes[0] ?? "Run",
  );
  const [duration, setDuration] = useState<string>("30");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const durationMinutes = Number(duration);
    if (!date) {
      setError("Please choose a date.");
      return;
    }
    if (!type.trim()) {
      setError("Please choose a workout type.");
      return;
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      setError("Duration must be a positive number of minutes.");
      return;
    }

    setSaving(true);
    try {
      addWorkout({
        date,
        type,
        durationMinutes,
        notes: notes.trim() || undefined,
      });
      router.push("/history");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Log a workout
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Capture the essentials: date, type, and duration. You can always edit
        or delete later in history (coming soon).
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 card">
        <div>
          <label className="label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="type">
            Workout type
          </label>
          <select
            id="type"
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {settings.workoutTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="duration">
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            min={1}
            className="input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            className="input min-h-[80px] resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save workout"}
          </button>
        </div>
      </form>
    </div>
  );
}

