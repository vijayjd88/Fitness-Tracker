"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isGuest } from "@/lib/guest";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || pathname === "/welcome") return;
    if (status === "authenticated") return;
    if (status === "loading") return;
    if (status === "unauthenticated") {
      if (isGuest()) return;
      router.replace("/welcome");
    }
  }, [mounted, pathname, status, router]);

  if (pathname === "/welcome") return <>{children}</>;
  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }
  if (status === "unauthenticated" && !isGuest()) {
    return null;
  }
  return <>{children}</>;
}
