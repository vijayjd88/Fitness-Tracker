import { NextRequest, NextResponse } from "next/server";

const YT_SEARCH = "https://www.googleapis.com/youtube/v3/search";

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ videos: [], message: "YouTube API key not configured" });
  }

  const type = request.nextUrl.searchParams.get("type")?.trim() || "workout";
  const query = `${type} workout training`;
  const maxResults = Math.min(Number(request.nextUrl.searchParams.get("max") || "8"), 12);

  try {
    const url = new URL(YT_SEARCH);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("order", "relevance");
    url.searchParams.set("maxResults", String(maxResults));
    url.searchParams.set("safeSearch", "moderate");
    url.searchParams.set("relevanceLanguage", "en");

    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.text();
      console.error("YouTube API error:", res.status, err);
      return NextResponse.json({ videos: [] });
    }

    const data = (await res.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: { title?: string; channelTitle?: string; publishedAt?: string };
      }>;
    };

    const videos = (data.items ?? [])
      .filter((i) => i.id?.videoId && i.snippet?.title)
      .map((i) => ({
        id: i.id!.videoId!,
        title: i.snippet!.title!,
        channelTitle: i.snippet!.channelTitle ?? "",
        publishedAt: i.snippet!.publishedAt ?? "",
      }));

    const response = NextResponse.json({ videos });
    // Cache for 1 hour so we don't hit YouTube quota on every Resources page load (6 types = 6 calls per visit)
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return response;
  } catch (e) {
    console.error("YouTube fetch error:", e);
    return NextResponse.json({ videos: [] });
  }
}
