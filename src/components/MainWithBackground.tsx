"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { RegisterSW } from "@/components/RegisterSW";
import { ReminderEffect } from "@/components/ReminderEffect";
import { getRandomQuote, MOTIVATIONAL_QUOTES } from "@/lib/quotes";

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1920&q=80",
];

export function MainWithBackground({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = useState(() => MOTIVATIONAL_QUOTES[0]);
  const [bg, setBg] = useState(() => BACKGROUNDS[0]);
  useEffect(() => {
    setQuote(getRandomQuote());
    setBg(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]);
  }, []);

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
        <blockquote className="mb-6 rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm italic text-slate-200 backdrop-blur sm:py-4 sm:text-base">
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
