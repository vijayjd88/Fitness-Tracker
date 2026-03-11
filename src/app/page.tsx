 "use client";

import Link from "next/link";
import { useFitnessData } from "@/hooks/useFitnessData";
import { WorkoutTypeIcon } from "@/components/WorkoutTypeIcon";

export default function Home() {
  const { summary, workouts, settings, isReady } = useFitnessData();

  const latest = workouts[0];
  const topType =
    Object.entries(summary.byType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <div className="flex w-full flex-col gap-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Log workouts, see your streaks, and keep your fitness journey on
          track.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="card-title">Workouts this week</div>
          <div className="card-value">{summary.totalThisWeek}</div>
        </div>
        <div className="card">
          <div className="card-title">Workouts this month</div>
          <div className="card-value">{summary.totalThisMonth}</div>
        </div>
        <div className="card">
          <div className="card-title">Most frequent type</div>
          <div className="card-value">
            {topType ? topType : "Start logging to see this"}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="card flex flex-col justify-between gap-3">
          <div>
            <h2 className="mb-1 text-sm font-medium text-slate-200">
              Quick start
            </h2>
            <p className="text-sm text-slate-400">
              The fastest way to get value is to log your next workout.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/log" className="btn-primary">
              Log a workout
            </Link>
            <Link href="/history" className="btn-secondary">
              View history
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-2 text-sm font-medium text-slate-200">
            Latest workout
          </h2>
          {!isReady || !latest ? (
            <p className="text-sm text-slate-400">
              No workouts yet. Log your first one to start your streak.
            </p>
          ) : (
            <div className="space-y-1 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <WorkoutTypeIcon type={latest.type} />
                <span className="font-medium">{latest.type}</span>{" "}
                <span className="text-slate-400">
                  on{" "}
                  {new Date(latest.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
              <p className="text-slate-400">
                Duration:{" "}
                <span className="font-medium text-slate-200">
                  {settings.unitDuration === "minutes"
                    ? `${latest.durationMinutes} min`
                    : `${(latest.durationMinutes / 60).toFixed(1)} h`}
                </span>
              </p>
              {latest.notes && (
                <p className="text-slate-400">
                  Notes:{" "}
                  <span className="text-slate-200">{latest.notes}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
