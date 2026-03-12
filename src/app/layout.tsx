import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Logo } from "@/components/Logo";
import { MainWithBackground } from "@/components/MainWithBackground";
import { SessionProvider } from "@/components/SessionProvider";
import { AuthGate } from "@/components/AuthGate";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveFit — Train · Track · Thrive",
  description: "Log workouts, track progress, and stay consistent. Your fitness companion.",
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
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Logo />
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
                  <Link href="/resources" className="text-slate-200 hover:text-emerald-400">
                    Resources
                  </Link>
                  <Link href="/settings" className="text-slate-200 hover:text-emerald-400">
                    Settings
                  </Link>
                </nav>
              </div>
            </header>
            <main className="relative mx-auto w-full max-w-5xl flex-1">
              <MainWithBackground>
                <AuthGate>{children}</AuthGate>
              </MainWithBackground>
            </main>
            <footer className="border-t border-slate-800 bg-slate-950/80">
              <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-slate-500">
                LiveFit — Train · Track · Thrive
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
