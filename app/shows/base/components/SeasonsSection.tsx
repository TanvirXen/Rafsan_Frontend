// SeasonsSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";

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
};

type SeasonsSectionProps = {
  seasons: Season[];
  episodes: Episode[];
  /** ✅ pass from page.tsx: slug of the show */
  showSlug: string;
};

function getSeasonNumber(title: string): number {
  const match = title.match(/(\d+)(?!.*\d)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function SeasonsSection({ seasons, episodes, showSlug }: SeasonsSectionProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Episode[]>();
    for (const ep of episodes) {
      if (!map.has(ep.seasonId)) map.set(ep.seasonId, []);
      map.get(ep.seasonId)!.push(ep);
    }

    const sortedSeasons = [...seasons].sort(
      (a, b) => getSeasonNumber(b.title) - getSeasonNumber(a.title)
    );

    return sortedSeasons.map((s) => ({
      season: s,
      episodes: map.get(s._id) ?? [],
    }));
  }, [seasons, episodes]);

  if (!grouped.length) return null;

  return (
    <>
      {grouped.map(({ season, episodes }) =>
        episodes.length ? (
          <SeasonRail
            key={season._id}
            season={season}
            episodes={episodes}
            showSlug={showSlug}
          />
        ) : null
      )}
    </>
  );
}

type SeasonRailProps = {
  season: Season;
  episodes: Episode[];
  showSlug: string;
};

function SeasonRail({ season, episodes, showSlug }: SeasonRailProps) {
  const [showAll, setShowAll] = useState(false);

  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const railRef = useRef<HTMLDivElement | null>(null);
  const [railW, setRailW] = useState(0);

  useEffect(() => {
    if (showAll) return;
    const el = railRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      setRailW(w);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showAll]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(episodes.length / perView)),
    [perView, episodes.length]
  );
  const totalSlots = pages * perView;
  const fillerCount = Math.max(0, totalSlots - episodes.length);

  const [index, setIndex] = useState(0);
  const maxIndex = pages - 1;

  useEffect(() => {
    setIndex((i) => (i > maxIndex ? maxIndex : i));
  }, [maxIndex]);

  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  const timerRef = useRef<number | null>(null);
  const start = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (!showAll && episodes.length > perView) timerRef.current = window.setInterval(next, 3500);
  };
  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, railW, showAll, episodes.length]);

  const GAP = 24;
  const itemW = perView === 1 ? railW : (railW - GAP * (perView - 1)) / perView;
  const trackW = pages * railW;
  const translateX = -index * railW;

  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 pt-10 pb-6 text-white overflow-x-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="recoleta text-[22px] sm:text-[26px] lg:text-[28px] font-extrabold">
          {season.title}
        </h2>

        <button
          onClick={() => {
            setShowAll((v) => !v);
            setIndex(0);
            stop();
          }}
          className="elza rounded-md bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/15 hover:bg-white/20"
          aria-label={showAll ? "See less" : "See all"}
        >
          {showAll ? "See Less" : "See All"}
        </button>
      </div>

      {showAll ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {episodes.map((e) => (
            <EpisodeCard key={e._id} ep={e} showSlug={showSlug} style={{ width: "100%" }} />
          ))}
        </div>
      ) : (
        <>
          <div ref={railRef} className="overflow-hidden" onMouseEnter={stop} onMouseLeave={start}>
            <div
              className="flex will-change-transform transition-transform duration-500"
              style={{
                gap: GAP,
                width: trackW || "100%",
                transform: `translateX(${translateX}px)`,
              }}
            >
              {episodes.map((e) => (
                <EpisodeCard key={e._id} ep={e} showSlug={showSlug} style={{ width: itemW }} />
              ))}
              {Array.from({ length: fillerCount }).map((_, k) => (
                <div key={`filler-${k}`} style={{ width: itemW }} aria-hidden />
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  index === i ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function EpisodeCard({
  ep,
  showSlug,
  style,
}: {
  ep: Episode;
  showSlug: string;
  style: React.CSSProperties;
}) {
  const hasLink = !!ep.link?.trim(); // we only enable play if there is a link
  const watchHref = hasLink ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <article
      className="
        group relative overflow-hidden rounded-2xl ring-1 ring-white/10
        shadow-[0_10px_25px_rgba(0,0,0,.45)]
        h-[240px] sm:h-[260px] md:h-[195px]
      "
      style={style}
    >
      <Image
        src={ep.thumbnail || "/assets/exp1.jpg"}
        alt={ep.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 1024px) calc(100vw - 2rem), 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-end p-3">
        <div className="leading-tight pr-[56px]">
          <p className="elza text-[11px] sm:text-[13px] text-white/85 line-clamp-1 group-hover:line-clamp-2">
            {ep.title}
          </p>
        </div>

        {!hasLink ? (
          <span
            className="
              absolute bottom-3 right-3
              grid h-8 w-8 place-items-center
              rounded-full bg-white/10 ring-1 ring-white/30
              text-[10px] text-white/60 cursor-not-allowed
            "
          >
            N/A
          </span>
        ) : (
          <Link
            href={ep.link || "#"}
            {...watchHref}
            prefetch={false}
            className="
              absolute bottom-3 right-3
              grid h-9 w-9 place-items-center
              rounded-full bg-white/18 ring-1 ring-white/40
              shadow-[0_4px_14px_rgba(0,0,0,0.6)]
              hover:bg-white/25
            "
            aria-label={`Play ${ep.title}`}
            title="Play"
          >
            <FiPlay className="h-4 w-4 text-white" />
          </Link>
        )}
      </div>
    </article>
  );
}
