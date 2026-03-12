"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getGuestName, isGuest } from "@/lib/guest";

export function useDisplayName(): string {
  const { data: session, status } = useSession();
  const [guestName, setGuestName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted) setGuestName(getGuestName());
  }, [mounted]);

  if (status === "authenticated" && session?.user?.name) {
    return session.user.name;
  }
  if (status === "authenticated" && session?.user?.email) {
    return session.user.email;
  }
  if (mounted && isGuest() && guestName) return guestName;
  return "Guest";
}
