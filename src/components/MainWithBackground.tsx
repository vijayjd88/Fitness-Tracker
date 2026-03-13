"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { RegisterSW } from "@/components/RegisterSW";
import { ReminderEffect } from "@/components/ReminderEffect";
import { getQuoteForPath, MOTIVATIONAL_QUOTES } from "@/lib/quotes";

const BACKGROUNDS: Record<string, string> = {
  "/": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  "/log": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80",
  "/history": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80",
  "/resources": "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1920&q=80",
  "/settings": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1920&q=80",
};

const DEFAULT_BG = BACKGROUNDS["/"];

export function MainWithBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bg = BACKGROUNDS[pathname ?? "/"] ?? DEFAULT_BG;
  const quote = useMemo(
    () => getQuoteForPath(pathname ?? "/"),
    [pathname],
  );

  return (
    <div className="absolute inset-0 flex flex-col">
      <RegisterSW />
      <ReminderEffect />
      <div className="absolute inset-0 -z-10">
        <Image
          src={bg}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/85" aria-hidden />
      </div>
      <div className="relative z-0 flex flex-1 flex-col px-4 py-6">
        <blockquote className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm italic text-slate-100 shadow-xl shadow-black/20 backdrop-blur-xl sm:py-5 sm:text-base">
          &ldquo;{quote.text}&rdquo;
          <footer className="mt-2 not-italic text-slate-400">
            — {quote.author}
          </footer>
        </blockquote>
        <div className="relative z-10 flex-1">{children}</div>
      </div>
    </div>
  );
}
