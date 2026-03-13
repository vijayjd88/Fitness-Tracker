"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFitnessData } from "@/hooks/useFitnessData";
import { useDisplayName } from "@/hooks/useDisplayName";
import { WorkoutTypeIcon } from "@/components/WorkoutTypeIcon";
import { getTopTypesFromSummary } from "@/lib/resources";
import { bmi, dailyCaloriesRequired } from "@/lib/calories";

function getWeekKey(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  x.setDate(diff);
  return x.toISOString().slice(0, 10);
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return getWeekKey(d) === getWeekKey(now);
}

export default function Home() {
  const displayName = useDisplayName();
  const { summary, workouts, settings, bodyProfile, weightHistory, isReady } = useFitnessData();

  const { thisWeekCalories, thisWeekMinutes, caloriesPerWeekLast8, byWeekday } = useMemo(() => {
    const now = new Date();
    let thisWeekCal = 0;
    let thisWeekMin = 0;
    const weekKeys: string[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - 7 * i);
      weekKeys.push(getWeekKey(d));
    }
    const calPerWeek: number[] = weekKeys.map(() => 0);
    const byDay = [0, 0, 0, 0, 0, 0, 0];

    workouts.forEach((w) => {
      const d = new Date(w.date);
      const cal = w.caloriesBurned ?? 0;
      const min = w.durationMinutes ?? 0;
      if (isThisWeek(w.date)) {
        thisWeekCal += cal;
        thisWeekMin += min;
      }
      const wk = getWeekKey(d);
      const idx = weekKeys.indexOf(wk);
      if (idx >= 0) calPerWeek[idx] += cal;
      byDay[d.getDay()] += 1;
    });

    return {
      thisWeekCalories: thisWeekCal,
      thisWeekMinutes: thisWeekMin,
      caloriesPerWeekLast8: calPerWeek,
      byWeekday: byDay,
    };
  }, [workouts]);

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
  const hasBodyStats = bmiValue !== null || dailyCal !== null;

  const latest = workouts[0];
  const topType =
    Object.entries(summary.byType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const weeklyGoal = settings.weeklyGoal ?? 0;
  const targetWeight = settings.targetWeightKg;
  const weeklyCalGoal = settings.weeklyCaloriesBurnedGoal ?? 0;
  const weeklyMinGoal = settings.weeklyMinutesGoal ?? 0;
  const maxChart = Math.max(1, ...summary.workoutsPerWeekLast8);
  const maxCalChart = Math.max(1, ...caloriesPerWeekLast8);
  const maxDayChart = Math.max(1, ...byWeekday);
  const topTypesForYou = getTopTypesFromSummary(summary.byType, 2);
  const weightChartData = weightHistory.slice(0, 14).reverse();
  const typeEntries = Object.entries(summary.byType).sort((a, b) => b[1] - a[1]);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex w-full flex-col gap-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Hello, {displayName}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Log workouts, see your streaks, and keep your fitness journey on track.
        </p>
      </section>

      {hasBodyStats && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bodyProfile.weightKg != null && (
            <div className="card">
              <div className="card-title">Weight</div>
              <div className="card-value">{bodyProfile.weightKg} kg</div>
            </div>
          )}
          {bmiValue != null && (
            <div className="card">
              <div className="card-title">BMI</div>
              <div className="card-value">{bmiValue}</div>
            </div>
          )}
          {dailyCal != null && (
            <div className="card">
              <div className="card-title">Daily calories (est.)</div>
              <div className="card-value">{dailyCal}</div>
              <p className="mt-1 text-xs text-slate-400">kcal maintenance</p>
            </div>
          )}
        </section>
      )}

      {(targetWeight != null && bodyProfile.weightKg != null) ||
       weeklyCalGoal > 0 ||
       weeklyMinGoal > 0 ? (
        <section className="card space-y-4">
          <h2 className="text-sm font-medium text-slate-200">Goal progress</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {targetWeight != null && bodyProfile.weightKg != null && (
              <div>
                <p className="card-title">
                  Weight: {bodyProfile.weightKg} → {targetWeight} kg
                </p>
                <div className="progress-bar-bg mt-1 h-2 w-full overflow-hidden">
                  <div
                    className="progress-bar-fill h-full"
                    style={{
                      width: `${
                        bodyProfile.weightKg >= targetWeight
                          ? 100
                          : Math.max(
                              0,
                              (bodyProfile.weightKg / targetWeight) * 100,
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
            {weeklyCalGoal > 0 && (
              <div>
                <p className="card-title">
                  Calories this week: {thisWeekCalories} / {weeklyCalGoal} kcal
                </p>
                <div className="progress-bar-bg mt-1 h-2 w-full overflow-hidden">
                  <div
                    className="progress-bar-fill h-full"
                    style={{
                      width: `${Math.min(100, (thisWeekCalories / weeklyCalGoal) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {weeklyMinGoal > 0 && (
              <div>
                <p className="card-title">
                  Minutes this week: {thisWeekMinutes} / {weeklyMinGoal} min
                </p>
                <div className="progress-bar-bg mt-1 h-2 w-full overflow-hidden">
                  <div
                    className="progress-bar-fill h-full"
                    style={{
                      width: `${Math.min(100, (thisWeekMinutes / weeklyMinGoal) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-title">Workouts this week</div>
          <div className="card-value">{summary.totalThisWeek}</div>
          {weeklyGoal > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              Goal: {summary.totalThisWeek}/{weeklyGoal}
            </p>
          )}
        </div>
        <div className="card">
          <div className="card-title">Workouts this month</div>
          <div className="card-value">{summary.totalThisMonth}</div>
        </div>
        <div className="card">
          <div className="card-title">Current streak</div>
          <div className="card-value">
            {summary.currentStreakWeeks} {summary.currentStreakWeeks === 1 ? "week" : "weeks"}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Most frequent type</div>
          <div className="card-value">
            {topType ? topType : "—"}
          </div>
        </div>
      </section>

      {(summary.longestStreakWeeks > 0 || summary.mostActiveWeekday) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {summary.longestStreakWeeks > 0 && (
            <div className="card">
              <div className="card-title">Longest streak</div>
              <div className="text-xl font-semibold text-accent">
                {summary.longestStreakWeeks} {summary.longestStreakWeeks === 1 ? "week" : "weeks"}
              </div>
            </div>
          )}
          {summary.mostActiveWeekday && (
            <div className="card">
              <div className="card-title">Most active day</div>
              <div className="text-xl font-semibold text-accent">
                {summary.mostActiveWeekday}
              </div>
            </div>
          )}
        </section>
      )}

      {summary.workoutsPerWeekLast8.some((n) => n > 0) && (
        <section className="card">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Workouts per week (last 8 weeks)
          </h2>
          <div className="flex items-end gap-1 h-24">
            {summary.workoutsPerWeekLast8.map((count, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
                title={`Week ${i + 1}: ${count} workout${count !== 1 ? "s" : ""}`}
              >
                <div
                  className="progress-bar-fill w-full min-h-[4px] rounded-t transition-all"
                  style={{
                    height: `${(count / maxChart) * 80}%`,
                    backgroundColor: "rgb(var(--accent-500) / 0.8)",
                  }}
                />
                <span className="text-[10px] text-slate-500">{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(weightChartData.length > 0 || caloriesPerWeekLast8.some((n) => n > 0) || typeEntries.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-slate-200">Charts & insights</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {weightChartData.length > 0 && (
              <div className="card">
                <h3 className="card-title mb-2">Weight over time</h3>
                <div className="flex items-end gap-0.5 h-20">
                  {weightChartData.map((e, i) => (
                    <div
                      key={e.date}
                      className="flex-1 flex flex-col items-center gap-0.5 min-w-0"
                      title={`${e.weightKg} kg on ${new Date(e.date).toLocaleDateString()}`}
                    >
                      <div
                        className="progress-bar-fill w-full min-h-[2px] rounded-t transition-all"
                        style={{
                          height: `${Math.max(8, (e.weightKg / Math.max(...weightChartData.map((x) => x.weightKg))) * 60)}%`,
                          backgroundColor: "rgb(var(--accent-500))",
                        }}
                      />
                      <span className="text-[9px] text-slate-500 truncate w-full text-center">
                        {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {caloriesPerWeekLast8.some((n) => n > 0) && (
              <div className="card">
                <h3 className="card-title mb-2">Calories burned per week</h3>
                <div className="flex items-end gap-1 h-20">
                  {caloriesPerWeekLast8.map((cal, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-0.5"
                      title={`${cal} kcal`}
                    >
                      <div
                        className="progress-bar-fill w-full min-h-[4px] rounded-t transition-all"
                        style={{
                          height: `${(cal / maxCalChart) * 80}%`,
                          backgroundColor: "rgb(var(--accent-500))",
                        }}
                      />
                      <span className="text-[9px] text-slate-500">{cal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {typeEntries.length > 0 && (
              <div className="card">
                <h3 className="card-title mb-2">Workouts by type</h3>
                <div className="space-y-2">
                  {typeEntries.slice(0, 8).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <WorkoutTypeIcon type={type} />
                      <span className="text-sm text-slate-200 flex-1">{type}</span>
                      <span className="text-sm text-accent font-medium">{count}</span>
                      <div className="w-16 progress-bar-bg h-2 rounded-full overflow-hidden">
                        <div
                          className="progress-bar-fill h-full"
                          style={{
                            width: `${(count / Math.max(1, typeEntries[0]?.[1] ?? 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {byWeekday.some((n) => n > 0) && (
              <div className="card">
                <h3 className="card-title mb-2">Workouts by day</h3>
                <div className="flex items-end gap-1 h-20">
                  {weekdays.map((label, i) => (
                    <div
                      key={label}
                      className="flex-1 flex flex-col items-center gap-0.5"
                      title={`${label}: ${byWeekday[i]} workout${byWeekday[i] !== 1 ? "s" : ""}`}
                    >
                      <div
                        className="progress-bar-fill w-full min-h-[4px] rounded-t transition-all"
                        style={{
                          height: `${(byWeekday[i] / maxDayChart) * 80}%`,
                          backgroundColor: "rgb(var(--accent-500))",
                        }}
                      />
                      <span className="text-[9px] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="card flex flex-col justify-between gap-3">
          <div>
            <h2 className="mb-1 text-sm font-medium text-slate-200">Quick start</h2>
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

        <div className="card flex flex-col justify-between gap-3">
          <div>
            <h2 className="mb-1 text-sm font-medium text-slate-200">Videos & articles</h2>
            <p className="text-sm text-slate-400">
              {topTypesForYou.length > 0
                ? `Curated resources for ${topTypesForYou.join(", ")} and more.`
                : "Find videos and articles by workout type."}
            </p>
          </div>
          <Link href="/resources" className="btn-secondary self-start">
            Browse resources
          </Link>
        </div>

        <div className="card">
          <h2 className="mb-2 text-sm font-medium text-slate-200">Latest workout</h2>
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
                  Notes: <span className="text-slate-200">{latest.notes}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
