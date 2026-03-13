"use client";

import { useState, useMemo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { WorkoutTypeIcon } from "@/components/WorkoutTypeIcon";
import type { Workout } from "@/lib/types";

export default function HistoryPage() {
  const { workouts, settings, updateWorkout, deleteWorkout } = useFitnessData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchNotes, setSearchNotes] = useState<string>("");

  const filtered = useMemo(() => {
    let list = workouts;
    if (filterType !== "all") {
      list = list.filter((w) => w.type.toLowerCase() === filterType.toLowerCase());
    }
    if (dateFrom) {
      list = list.filter((w) => w.date >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((w) => w.date <= dateTo);
    }
    if (searchNotes.trim()) {
      const q = searchNotes.trim().toLowerCase();
      list = list.filter((w) => (w.notes ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [workouts, filterType, dateFrom, dateTo, searchNotes]);

  const types = useMemo(() => {
    const set = new Set(workouts.map((w) => w.type));
    return ["all", ...Array.from(set).sort()];
  }, [workouts]);

  const handleDelete = (w: Workout) => {
    if (typeof window !== "undefined" && window.confirm(`Delete "${w.type}" on ${w.date}?`)) {
      deleteWorkout(w.id);
      setEditingId(null);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Workout history
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Edit, delete, or filter your workouts. Use search to find by notes.
      </p>

      <div className="mt-6 space-y-4">
        <div className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All types" : t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">From date</label>
            <input
              type="date"
              className="input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="label">To date</label>
            <input
              type="date"
              className="input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Search in notes</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. side kick"
              value={searchNotes}
              onChange={(e) => setSearchNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          {workouts.length === 0 ? (
            <p className="text-sm text-slate-400">
              You have not logged any workouts yet. Your first one will appear here.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-400">
              No workouts match the current filters. Try changing type, dates, or search.
            </p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {filtered.map((w) => (
                <li key={w.id} className="py-3 text-sm">
                  {editingId === w.id ? (
                    <WorkoutEditForm
                      workout={w}
                      settings={settings}
                      onSave={(patch) => {
                        updateWorkout(w.id, patch);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <WorkoutTypeIcon type={w.type} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-100">{w.type}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(w.date).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-medium text-slate-300">
                          {settings.unitDuration === "minutes"
                            ? `${w.durationMinutes} min`
                            : `${(w.durationMinutes / 60).toFixed(1)} h`}
                        </p>
                        {w.caloriesBurned != null && (
                          <p className="mt-1 text-xs text-slate-500">
                            {w.caloriesBurned} kcal
                          </p>
                        )}
                        {w.notes && (
                          <p className="mt-1 max-w-xs text-xs text-slate-400 truncate">
                            {w.notes}
                          </p>
                        )}
                        <div className="mt-2 flex gap-2 justify-end">
                          <button
                            type="button"
                            className="text-xs text-emerald-400 hover:underline"
                            onClick={() => setEditingId(w.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs text-red-400 hover:underline"
                            onClick={() => handleDelete(w)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkoutEditForm({
  workout,
  settings,
  onSave,
  onCancel,
}: {
  workout: Workout;
  settings: { workoutTypes: string[] };
  onSave: (patch: Partial<Omit<Workout, "id">>) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(workout.date);
  const [type, setType] = useState(workout.type);
  const [durationMinutes, setDurationMinutes] = useState(String(workout.durationMinutes));
  const [notes, setNotes] = useState(workout.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dur = Number(durationMinutes);
    if (!date || !type.trim() || !Number.isFinite(dur) || dur <= 0) return;
    onSave({ date, type, durationMinutes: dur, notes: notes.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {[...settings.workoutTypes, workout.type]
              .filter((t, i, a) => a.indexOf(t) === i)
              .map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="label">Duration (min)</label>
          <input
            type="number"
            min={1}
            className="input"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea
          className="input min-h-[60px] resize-y"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
