import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Logo } from "@/components/Logo";
import { MainWithBackground } from "@/components/MainWithBackground";
import { SessionProvider } from "@/components/SessionProvider";
import { AuthGate } from "@/components/AuthGate";
import { ThemeInit } from "@/components/ThemeInit";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveFit — Train · Track · Thrive",
  description: "Log workouts, track progress, and stay consistent. Your fitness companion.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "LiveFit" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='fitness-tracker.settings';try{var s=localStorage.getItem(k);if(s){var j=JSON.parse(s);if(j.theme)document.documentElement.dataset.theme=j.theme;if(j.accent)document.documentElement.dataset.accent=j.accent;}else{document.documentElement.dataset.theme='dark';document.documentElement.dataset.accent='emerald';}}catch(e){}})();`,
          }}
        />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-page text-page antialiased`}>
        <ThemeInit />
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <header
              className="border-b backdrop-blur"
              style={{
                backgroundColor: "rgb(var(--header-bg) / 0.9)",
                borderColor: "rgb(var(--header-border))",
              }}
            >
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Logo />
                <nav className="flex flex-wrap gap-3 text-sm">
                  <Link href="/" className="link-accent min-h-[44px] min-w-[44px] inline-flex items-center">
                    Dashboard
                  </Link>
                  <Link href="/log" className="link-accent min-h-[44px] min-w-[44px] inline-flex items-center">
                    Log workout
                  </Link>
                  <Link href="/history" className="link-accent min-h-[44px] min-w-[44px] inline-flex items-center">
                    History
                  </Link>
                  <Link href="/resources" className="link-accent min-h-[44px] min-w-[44px] inline-flex items-center">
                    Resources
                  </Link>
                  <Link href="/settings#body" className="link-accent min-h-[44px] min-w-[44px] inline-flex items-center">
                    Body
                  </Link>
                  <Link href="/settings" className="link-accent min-h-[44px] min-w-[44px] inline-flex items-center">
                    Settings
                  </Link>
                </nav>
              </div>
            </header>
            <main className="relative mx-auto w-full max-w-6xl flex-1">
              <MainWithBackground>
                <AuthGate>{children}</AuthGate>
              </MainWithBackground>
            </main>
            <footer
              className="border-t"
              style={{
                backgroundColor: "rgb(var(--page-bg) / 0.9)",
                borderColor: "rgb(var(--header-border))",
                color: "rgb(var(--muted))",
              }}
            >
              <div className="mx-auto max-w-6xl px-4 py-3 text-xs">
                LiveFit — Train · Track · Thrive
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
