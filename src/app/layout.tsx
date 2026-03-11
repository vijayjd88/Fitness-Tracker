import type { Metadata } from "next";
import Link from "next/link";
import { MainWithBackground } from "@/components/MainWithBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fitness Tracker",
  description: "Log workouts, track progress, and stay consistent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-50 font-sans antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-tight">
                  VibeFit
                </span>
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  Fitness Tracker
                </span>
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link href="/" className="text-slate-200 hover:text-emerald-400">
                  Dashboard
                </Link>
                <Link href="/log" className="text-slate-200 hover:text-emerald-400">
                  Log workout
                </Link>
                <Link href="/history" className="text-slate-200 hover:text-emerald-400">
                  History
                </Link>
                <Link href="/settings" className="text-slate-200 hover:text-emerald-400">
                  Settings
                </Link>
              </nav>
            </div>
          </header>
          <main className="relative mx-auto w-full max-w-5xl flex-1">
            <MainWithBackground>{children}</MainWithBackground>
          </main>
          <footer className="border-t border-slate-800 bg-slate-950/80">
            <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-slate-500">
              Built to kick off your fitness coding journey.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
