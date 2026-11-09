// SeasonsSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";
import { resolveMediaUrl } from "@/app/lib/mediaUrl";

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

  // Native horizontal scroll with snap points, so the rail can be swiped on
  // touch screens (same behaviour as the Featured Episodes slider).
  const railRef = useRef<HTMLDivElement | null>(null);
  const pages = Math.max(1, Math.ceil(episodes.length / perView));
  const [index, setIndex] = useState(0);

  const pageWidth = () => {
    const el = railRef.current;
    const card = el?.querySelector<HTMLElement>(".season-card");
    if (!el || !card) return 0;
    return (card.offsetWidth + GAP) * perView;
  };

  const scrollToPage = (page: number, smooth = true) => {
    const el = railRef.current;
    if (!el) return;
    const target = ((page % pages) + pages) % pages;
    el.scrollTo({ left: target * pageWidth(), behavior: smooth ? "smooth" : "auto" });
    setIndex(target);
  };

  // Keep the dots in sync while the user swipes.
  useEffect(() => {
    const el = railRef.current;
    if (!el || showAll) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const w = pageWidth();
        if (!w) return;
        setIndex(Math.max(0, Math.min(pages - 1, Math.round(el.scrollLeft / w))));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, perView, showAll]);

  const activeIndex = Math.min(index, pages - 1);

  // Auto-advance, paused while the user is touching / hovering the rail and
  // for a few seconds after they swipe.
  const pausedRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const indexRef = useRef(activeIndex);
  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  };
  const resumeSoon = (delay = 4000) => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  };

  useEffect(() => {
    if (showAll || pages <= 1) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) scrollToPage(indexRef.current + 1);
    }, 3500);
    return () => {
      window.clearInterval(id);
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, perView, showAll]);

  // Mouse drag for desktop (touch uses native scrolling).
  const dragRef = useRef({ active: false, startX: 0, startLeft: 0, dist: 0 });
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = railRef.current;
    if (!el) return;
    e.preventDefault();
    dragRef.current = { active: true, startX: e.pageX, startLeft: el.scrollLeft, dist: 0 };
    el.style.scrollSnapType = "none";
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = railRef.current;
    const d = dragRef.current;
    if (!el || !d.active) return;
    const dist = e.pageX - d.startX;
    d.dist = Math.abs(dist);
    el.scrollLeft = d.startLeft - dist;
  };
  const endDrag = () => {
    const el = railRef.current;
    if (!el || !dragRef.current.active) return;
    dragRef.current.active = false;
    el.style.scrollSnapType = "";
  };
  const onClickCapture: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (dragRef.current.dist > 10) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.dist = 0;
    }
  };

  const cardBasis = `calc((100% - ${GAP * (perView - 1)}px) / ${perView})`;

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
          <div
            ref={railRef}
            className="
              overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain overscroll-y-none cursor-grab
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            "
            onMouseEnter={pause}
            onMouseLeave={() => {
              endDrag();
              resumeSoon(0);
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onTouchStart={pause}
            onTouchEnd={() => resumeSoon()}
            onClickCapture={onClickCapture}
          >
            <div className="flex" style={{ gap: GAP }}>
              {episodes.map((e) => (
                <EpisodeCard
                  key={e._id}
                  ep={e}
                  showSlug={showSlug}
                  className="season-card snap-start"
                  style={{ flex: `0 0 ${cardBasis}` }}
                />
              ))}
            </div>
          </div>

          {pages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    pause();
                    scrollToPage(i);
                    resumeSoon();
                  }}
                  aria-label={`Go to page ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition ${
                    activeIndex === i ? "bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const GAP = 24;

function EpisodeCard({
  ep,
  showSlug,
  style,
  className = "",
}: {
  ep: Episode;
  showSlug: string;
  style: React.CSSProperties;
  className?: string;
}) {
  const hasLink = !!ep.link?.trim(); // we only enable play if there is a link
  const playerHref = `/shows/${encodeURIComponent(showSlug)}?ep=${encodeURIComponent(
    ep._id
  )}`;

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl ring-1 ring-white/10
        shadow-[0_10px_25px_rgba(0,0,0,.45)] select-none
        h-[240px] sm:h-[260px] md:h-[195px] ${className}
      `}
      style={style}
    >
      <Image
        src={resolveMediaUrl(ep.thumbnail, "/assets/exp1.jpg")}
        alt={ep.title}
        fill
        draggable={false}
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
            href={playerHref}
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
