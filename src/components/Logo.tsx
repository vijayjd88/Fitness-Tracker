import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M13 2L15 8l6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1L13 2z" />
          <path d="M6 14l-2 2 1 2 2-1 2-2" opacity="0.8" />
        </svg>
      </span>
      <span className="flex flex-col items-baseline gap-0">
        <span className="text-lg font-bold tracking-tight text-slate-50 group-hover:text-emerald-400 transition-colors">
          LiveFit
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Train · Track · Thrive
        </span>
      </span>
    </Link>
  );
}
