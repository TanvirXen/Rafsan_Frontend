// app/shows/[slug]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import apiList from "@/apiList";
import { slugifyTitle } from "@/app/lib/slugifyTitle";

import ShowBanner from "../base/components/showBanner";
import ShowFeaturedEp from "../base/components/showFeaturedEp";
import SeasonsSection from "../base/components/SeasonsSection";

import PodcastBanner from "../alternate/components/podcastBanner";
import FeaturedShows from "../alternate/components/FeaturedShows";

import Newsletter from "@/app/section/newsletter";
import EnhancedPlayer from "./components/EnhancedPlayer";

export const revalidate = 60;

type Show = {
  _id: string;
  title: string;
  seasons?: number;
  reels?: number;
  featured?: boolean;
  description?: string;
  thumbnail?: string;
  heroImage?: string;
  designVariant?: "cinematic" | "podcast";
};

type Season = {
  _id: string;
  title: string;
  description?: string;
  showId: string;
};

type Episode = {
  _id: string;
  title: string;
  showId: string;
  seasonId: string;
  thumbnail?: string;
  link?: string;
  featured?: boolean;
};

type Reel = {
  _id: string;
  title: string;
  showId: string;
  description?: string;
  thumbnail?: string;
  link?: string;
};

async function fetchShowsList(): Promise<Show[]> {
  const res = await fetch(apiList.shows.list, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = (await res.json()) as Show[] | { shows?: Show[] };
  return Array.isArray(json) ? json : json.shows ?? [];
}

async function fetchShowData(showId: string) {
  const url = apiList.shows.get(showId);
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to load show data (status ${res.status})`);
  }

  const json = (await res.json()) as {
    show: Show;
    seasons: Season[];
    episodes: Episode[];
    reels: Reel[];
  };

  return json;
}

export async function generateStaticParams() {
  const shows = await fetchShowsList();
  return shows.map((s) => ({
    slug: slugifyTitle(s.title),
  }));
}

/* ---------------------- SEO: dynamic episode title ---------------------- */

function getYouTubeId(input: string): string | null {
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) return u.pathname.split("/").filter(Boolean)[0] || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    const m =
      input.match(/v=([a-zA-Z0-9_-]{6,})/) ||
      input.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    return m?.[1] ?? null;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ ep?: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const sp = props.searchParams ? await props.searchParams : {};
  const epId = sp.ep?.trim();

  const shows = await fetchShowsList();
  const match = shows.find((s) => slugifyTitle(s.title) === slug);
  if (!match) return { title: "Show" };

  const data = await fetchShowData(match._id);
  if (!data) return { title: match.title };

  const { show, episodes } = data;
  const ep = epId ? episodes.find((e) => e._id === epId) : null;

  const title = ep ? `${ep.title} | ${show.title}` : show.title;
  const description =
    show.description ||
    (ep ? `Watch "${ep.title}" from ${show.title}.` : `Watch ${show.title}.`);

  const img =
    (ep?.thumbnail && ep.thumbnail.trim()) ||
    (show.heroImage && show.heroImage.trim()) ||
    (show.thumbnail && show.thumbnail.trim()) ||
    undefined;

  const canonical = epId
    ? `/shows/${encodeURIComponent(slug)}?ep=${encodeURIComponent(epId)}`
    : `/shows/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: img ? [{ url: img }] : undefined,
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: img ? [img] : undefined,
    },
  };
}

/* ---------------------- Page ---------------------- */

export default async function ShowPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ ep?: string }>;
}) {
  const { slug } = await props.params;
  const sp = props.searchParams ? await props.searchParams : {};
  const selectedEpId = sp.ep?.trim() || null;

  const playerMode = !!selectedEpId;

  const shows = await fetchShowsList();
  const match = shows.find((s) => slugifyTitle(s.title) === slug);
  if (!match) notFound();

  const data = await fetchShowData(match._id);
  if (!data) notFound();

  const { show, seasons, episodes } = data;

  const selectedEpisode = selectedEpId
    ? episodes.find((e) => e._id === selectedEpId)
    : null;

  // ✅ JSON-LD for SEO when episode is selected
  const videoJsonLd =
    selectedEpisode?.link && selectedEpisode?.thumbnail
      ? (() => {
          const yt = getYouTubeId(selectedEpisode.link);
          const watchUrl = yt ? `https://www.youtube.com/watch?v=${yt}` : selectedEpisode.link;
          const embedUrl = yt
            ? `https://www.youtube-nocookie.com/embed/${yt}`
            : undefined;

          return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: selectedEpisode.title,
            description: show.description || `Watch "${selectedEpisode.title}" from ${show.title}.`,
            thumbnailUrl: [selectedEpisode.thumbnail],
            contentUrl: watchUrl,
            embedUrl,
            publisher: {
              "@type": "Organization",
              name: "WHAT A SHOW!",
              url: "https://www.youtube.com/@WHATASHOW_OFFICIAL",
            },
          };
        })()
      : null;

  const variant: "cinematic" | "podcast" =
    show.designVariant === "podcast" ? "podcast" : "cinematic";

  return (
    <div>
      {playerMode && (
        <>
          {videoJsonLd && (
            <script
              type="application/ld+json"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
            />
          )}

          <EnhancedPlayer
            showSlug={slug}
            showTitle={show.title}
            seasons={seasons}
            episodes={episodes}
            initialEpisodeId={selectedEpId}
          />

          {/* ✅ Player-only mode: no other sections below */}
          <Newsletter />
        </>
      )}

      {!playerMode && (
        <>
          {variant === "podcast" ? (
            <>
              <PodcastBanner show={show} />
              <FeaturedShows episodes={episodes} />
              <SeasonsSection seasons={seasons} episodes={episodes} showSlug={slug} />
            </>
          ) : (
            <>
              <ShowBanner show={show} />
              <ShowFeaturedEp seasons={seasons} episodes={episodes} />
              <SeasonsSection seasons={seasons} episodes={episodes} showSlug={slug} />
            </>
          )}

          <Newsletter />
        </>
      )}
    </div>
  );
}
