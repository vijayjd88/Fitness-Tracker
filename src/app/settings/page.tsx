"use client";

import { FormEvent, useState } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";

export default function SettingsPage() {
  const { settings, updateSettings } = useFitnessData();
  const [unitDuration, setUnitDuration] = useState(settings.unitDuration);
  const [workoutTypes, setWorkoutTypes] = useState(
    settings.workoutTypes.join(", "),
  );
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);

    const cleanedTypes = workoutTypes
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    updateSettings({
      unitDuration,
      workoutTypes: cleanedTypes.length ? cleanedTypes : settings.workoutTypes,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Settings
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Adjust units and default workout types to match how you train.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 card">
        <div>
          <p className="label">Duration unit</p>
          <div className="flex gap-3">
            <button
              type="button"
              className={`btn-secondary ${
                unitDuration === "minutes"
                  ? "border-emerald-400 text-emerald-400"
                  : ""
              }`}
              onClick={() => setUnitDuration("minutes")}
            >
              Minutes
            </button>
            <button
              type="button"
              className={`btn-secondary ${
                unitDuration === "hours"
                  ? "border-emerald-400 text-emerald-400"
                  : ""
              }`}
              onClick={() => setUnitDuration("hours")}
            >
              Hours
            </button>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="types">
            Default workout types
          </label>
          <p className="mb-1 text-xs text-slate-500">
            Comma-separated list. These appear in the Log workout form.
          </p>
          <input
            id="types"
            className="input"
            value={workoutTypes}
            onChange={(e) => setWorkoutTypes(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary">
            Save settings
          </button>
          {saved && (
            <span className="text-xs text-emerald-400">Saved!</span>
          )}
        </div>
      </form>
    </div>
  );
}

