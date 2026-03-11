import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { MainWithBackground } from "@/components/MainWithBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeFit Fitness Tracker",
  description: "Log workouts, track progress, and stay consistent.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
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
