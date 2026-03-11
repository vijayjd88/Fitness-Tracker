"use client";

import { useFitnessData } from "@/hooks/useFitnessData";
import { WorkoutTypeIcon } from "@/components/WorkoutTypeIcon";

export default function HistoryPage() {
  const { workouts } = useFitnessData();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Workout history
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        See your recent workouts in reverse chronological order.
      </p>

      <div className="mt-6 card">
        {workouts.length === 0 ? (
          <p className="text-sm text-slate-400">
            You have not logged any workouts yet. Your first one will appear
            here.
          </p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {workouts.map((w) => (
              <li key={w.id} className="py-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <WorkoutTypeIcon type={w.type} />
                    <div>
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
                  <div className="text-right text-slate-300">
                    <p className="font-medium">{w.durationMinutes} min</p>
                    {w.notes && (
                      <p className="mt-1 max-w-xs text-xs text-slate-400">
                        {w.notes}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

