/**
 * BMI and calorie helpers for body profile.
 * Daily need: Mifflin–St Jeor (simplified). Workout burn: rough MET-based estimate.
 */

export function bmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Daily calorie need (maintenance) in kcal. Uses Mifflin–St Jeor; age estimated if not set. */
export function dailyCaloriesRequired(
  weightKg: number,
  heightCm: number,
  gender?: "male" | "female" | "other",
  birthYear?: number,
): number | null {
  if (!weightKg || !heightCm) return null;
  const age = birthYear ? new Date().getFullYear() - birthYear : 30;
  const male = gender === "male";
  // BMR then * activity factor (1.2 = sedentary baseline)
  let bmr: number;
  if (male) {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return Math.round(bmr * 1.2);
}

/** Rough calories burned per minute by activity type (MET-based, 70 kg reference). */
const MET_BY_TYPE: Record<string, number> = {
  Walk: 3,
  Run: 9,
  Lift: 5,
  Yoga: 2.5,
  "Muay Thai": 8,
  Tennis: 7,
  Hike: 6,
  Swimming: 8,
  Other: 4,
};

/** Estimate calories burned for a workout (kcal). weightKg optional for better estimate. */
export function caloriesBurnedForWorkout(
  type: string,
  durationMinutes: number,
  weightKg?: number,
): number {
  const met = MET_BY_TYPE[type] ?? MET_BY_TYPE.Other;
  const kg = weightKg ?? 70;
  // calories = MET * weight(kg) * hours
  const hours = durationMinutes / 60;
  return Math.round(met * kg * hours);
}
