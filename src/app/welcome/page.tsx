"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { setGuest } from "@/lib/guest";

export default function WelcomePage() {
  const router = useRouter();

  const handleGuest = () => {
    setGuest();
    router.replace("/");
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Logo />
      <p className="mt-6 text-slate-400">
        Log workouts, track progress, and stay consistent.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
        >
          Sign in with Google
        </button>
        <button
          type="button"
          onClick={handleGuest}
          className="rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-700/80"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}
