"use client";

import { useFitnessData } from "@/hooks/useFitnessData";
import {
  VIDEOS_BY_TYPE,
  ARTICLES_BY_TYPE,
  GENERAL_ARTICLES,
  getVideoThumbUrl,
  getVideoWatchUrl,
  getTopTypesFromSummary,
} from "@/lib/resources";

export default function ResourcesPage() {
  const { summary } = useFitnessData();
  const topTypes = getTopTypesFromSummary(summary.byType, 2);
  const allTypes = ["Run", "Yoga", "Muay Thai", "Lift", "Tennis", "Hike"];

  return (
    <div className="w-full space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Resources & videos
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Curated videos and articles by workout type. Recommendations below are based on what you log most.
        </p>
      </section>

      {topTypes.length > 0 && (
        <section className="card">
          <h2 className="mb-3 text-sm font-medium text-emerald-400">
            Recommended for you
          </h2>
          <p className="mb-4 text-xs text-slate-400">
            Based on your logged workouts: {topTypes.join(", ")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topTypes.map((type) => {
              const videos = VIDEOS_BY_TYPE[type] ?? VIDEOS_BY_TYPE.Other;
              const articles = ARTICLES_BY_TYPE[type] ?? ARTICLES_BY_TYPE.Other;
              return (
                <div key={type} className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-200">{type}</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {videos.slice(0, 3).map((v) => (
                      <a
                        key={v.id}
                        href={getVideoWatchUrl(v.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-40 rounded-lg overflow-hidden border border-slate-700 hover:border-emerald-500 transition-colors"
                      >
                        <img
                          src={getVideoThumbUrl(v.id)}
                          alt=""
                          className="w-full aspect-video object-cover"
                        />
                        <p className="p-2 text-xs text-slate-300 truncate" title={v.title}>
                          {v.title}
                        </p>
                      </a>
                    ))}
                  </div>
                  <ul className="text-xs space-y-1">
                    {articles.slice(0, 2).map((a) => (
                      <li key={a.url}>
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline"
                        >
                          {a.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="mb-4 text-sm font-medium text-slate-200">
          Videos by workout type
        </h2>
        <div className="space-y-6">
          {allTypes.map((type) => {
            const videos = VIDEOS_BY_TYPE[type] ?? VIDEOS_BY_TYPE.Other;
            const articles = ARTICLES_BY_TYPE[type] ?? ARTICLES_BY_TYPE.Other;
            return (
              <div key={type}>
                <h3 className="mb-2 text-sm font-medium text-slate-200">{type}</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {videos.map((v) => (
                    <a
                      key={v.id}
                      href={getVideoWatchUrl(v.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-44 rounded-lg overflow-hidden border border-slate-700 hover:border-emerald-500 transition-colors"
                    >
                      <img
                        src={getVideoThumbUrl(v.id)}
                        alt=""
                        className="w-full aspect-video object-cover"
                      />
                      <p className="p-2 text-xs text-slate-300 truncate" title={v.title}>
                        {v.title}
                      </p>
                    </a>
                  ))}
                </div>
                <ul className="mt-2 text-xs text-slate-400 space-y-1">
                  {articles.map((a) => (
                    <li key={a.url}>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        {a.title}
                      </a>
                      {a.description && ` — ${a.description}`}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 text-sm font-medium text-slate-200">
          Articles & tips
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          General fitness and motivation from trusted sources.
        </p>
        <ul className="space-y-3">
          {GENERAL_ARTICLES.map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-medium"
              >
                {a.title}
              </a>
              {a.description && (
                <p className="mt-0.5 text-xs text-slate-400">{a.description}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card border-dashed border-slate-600">
        <h2 className="mb-2 text-sm font-medium text-slate-400">
          Community blog (coming soon)
        </h2>
        <p className="text-xs text-slate-500">
          A shared blog for tips and stories from the VibeFit community is planned. For now, use the articles and videos above.
        </p>
      </section>
    </div>
  );
}
