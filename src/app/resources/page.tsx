"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFitnessData } from "@/hooks/useFitnessData";
import {
  ARTICLES_BY_TYPE,
  GENERAL_ARTICLES,
  getVideoThumbUrl,
  getVideoWatchUrl,
  getTopTypesFromSummary,
  type ArticleResource,
} from "@/lib/resources";

interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle?: string;
}

const WORKOUT_TYPES = ["Walk", "Run", "Yoga", "Muay Thai", "Lift", "Tennis", "Hike"];

function VideoCard({ v }: { v: YouTubeVideo }) {
  return (
    <a
      href={getVideoWatchUrl(v.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="min-w-0 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all block"
    >
      <div className="relative w-full aspect-video bg-slate-800">
        <Image
          src={getVideoThumbUrl(v.id)}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <p className="p-2 text-xs text-slate-300 line-clamp-2" title={v.title}>
        {v.title}
      </p>
    </a>
  );
}

function ArticlesList({ articles, title }: { articles: ArticleResource[]; title?: string }) {
  if (!articles.length) return null;
  return (
    <div className="space-y-2">
      {title && (
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h4>
      )}
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.url}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              {a.title}
            </a>
            {a.description && (
              <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideosAndArticlesRow({
  type,
  videos,
  articles,
  loading,
}: {
  type: string;
  videos: YouTubeVideo[];
  articles: ArticleResource[];
  loading?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),280px] min-w-0">
      <div className="min-w-0 overflow-hidden">
        <h3 className="mb-2 text-sm font-medium text-slate-200">{type}</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 min-w-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video min-w-0 rounded-xl bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 min-w-0">
            {videos.length ? videos.map((v) => <VideoCard key={v.id} v={v} />) : (
              <p className="col-span-full text-xs text-slate-500 py-2">
                No videos available for this type right now.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="lg:border-l lg:border-slate-700 lg:pl-6 min-w-0">
        <ArticlesList articles={articles} title="Articles" />
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { summary } = useFitnessData();
  const topTypes = getTopTypesFromSummary(summary.byType, 2);
  const [videosByType, setVideosByType] = useState<Record<string, YouTubeVideo[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const fetchVideos = async (type: string) => {
    setLoading((l) => ({ ...l, [type]: true }));
    try {
      const res = await fetch(`/api/videos?type=${encodeURIComponent(type)}&max=8`);
      const data = (await res.json()) as { videos?: YouTubeVideo[]; message?: string };
      if (data.message === "YouTube API key not configured") setApiKeyMissing(true);
      setVideosByType((v) => ({ ...v, [type]: data.videos ?? [] }));
    } finally {
      setLoading((l) => ({ ...l, [type]: false }));
    }
  };

  useEffect(() => {
    WORKOUT_TYPES.forEach(fetchVideos);
  }, []);

  return (
    <div className="w-full min-w-0 max-w-full space-y-8 overflow-x-hidden">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Resources & videos
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Live YouTube results and trusted articles by workout type.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px] min-w-0">
        <section className="card min-w-0">
          <h2 className="mb-3 text-sm font-medium text-emerald-400">
            Recommended for you
          </h2>
          <p className="mb-4 text-xs text-slate-400">
            {topTypes.length > 0
              ? `Based on your logs: ${topTypes.join(", ")}`
              : "Log workouts to see personalized picks."}
          </p>
          {topTypes.length > 0 ? (
            topTypes.map((type) => (
              <div key={type} className="mb-6 last:mb-0">
                <VideosAndArticlesRow
                  type={type}
                  videos={videosByType[type] ?? []}
                  articles={ARTICLES_BY_TYPE[type] ?? ARTICLES_BY_TYPE.Other ?? []}
                  loading={loading[type]}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Log some workouts to get recommendations.</p>
          )}
        </section>

        <section className="card lg:order-first min-w-0">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Articles & tips
          </h2>
          <p className="mb-4 text-xs text-slate-400">
            Trusted sources for motivation and basics.
          </p>
          <ArticlesList articles={GENERAL_ARTICLES} />
        </section>
      </div>

      <section className="card min-w-0 overflow-hidden">
        <h2 className="mb-4 text-sm font-medium text-slate-200">
          Videos & articles by workout type
        </h2>
        {apiKeyMissing && (
          <p className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm p-3">
            Video recommendations need a YouTube API key. Add <code className="text-amber-100">YOUTUBE_API_KEY</code> in Vercel → Settings → Environment Variables, then redeploy.
          </p>
        )}
        <div className="space-y-8">
          {WORKOUT_TYPES.map((type) => (
            <VideosAndArticlesRow
              key={type}
              type={type}
              videos={videosByType[type] ?? []}
              articles={ARTICLES_BY_TYPE[type] ?? []}
              loading={loading[type]}
            />
          ))}
        </div>
      </section>

      <section className="card border-dashed border-slate-600">
        <h2 className="mb-2 text-sm font-medium text-slate-400">
          Community blog (coming soon)
        </h2>
        <p className="text-xs text-slate-500">
          A shared blog for tips and stories from the LiveFit community is planned.
        </p>
      </section>
    </div>
  );
}
