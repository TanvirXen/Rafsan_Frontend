"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { resolveMediaUrl } from "@/app/lib/mediaUrl";

type Season = {
  _id: string;
  title: string;
};

type Episode = {
  _id: string;
  title: string;
  seasonId: string;
  thumbnail?: string;
  link?: string;
  featured?: boolean;
};

type ShowFeaturedEpProps = {
  seasons: Season[];
  episodes: Episode[];
  showSlug: string;
};

type CardData = {
  id: string;
  season: string;
  episode: string;
  img: string;
  href: string;
  disabled?: boolean;
};

const GAP = 24;

export default function ShowFeaturedEp({
  seasons,
  episodes,
  showSlug,
}: ShowFeaturedEpProps) {
  const seasonMap = useMemo(() => {
    const map = new Map<string, Season>();
    seasons.forEach((season) => map.set(season._id, season));
    return map;
  }, [seasons]);

  const cards: CardData[] = useMemo(() => {
    if (!episodes?.length) return [];

    const featured = episodes.filter((episode) => episode.featured);
    const source = featured.length ? featured : episodes.slice(0, 6);

    return source.map((episode) => ({
      id: episode._id,
      season: seasonMap.get(episode.seasonId)?.title ?? "Season",
      episode: episode.title,
      img: resolveMediaUrl(episode.thumbnail, "/assets/exp1.jpg"),
      href: episode.link
        ? `/shows/${encodeURIComponent(showSlug)}?ep=${encodeURIComponent(episode._id)}`
        : "#",
      disabled: !episode.link,
    }));
  }, [episodes, seasonMap, showSlug]);

  const [perView, setPerView] = useState(4);
  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      setPerView(width >= 1024 ? 4 : width >= 768 ? 2 : 1);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const totalPages = Math.ceil(cards.length / perView);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);

  const scrollToPage = (pageIndex: number) => {
    const el = railRef.current;
    if (!el || !cards.length) return;

    const targetPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
    const cardElement = el.querySelector(".featured-card") as HTMLElement | null;
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth;
    const targetScrollLeft = targetPage * perView * (cardWidth + GAP);

    el.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
    setActivePage(targetPage);
  };

  const next = () => {
    const nextPage = activePage >= totalPages - 1 ? 0 : activePage + 1;
    scrollToPage(nextPage);
  };

  const prev = () => {
    const prevPage = activePage <= 0 ? totalPages - 1 : activePage - 1;
    scrollToPage(prevPage);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el || !cards.length) return;

    const updatePageOnScroll = () => {
      const cardElement = el.querySelector(".featured-card") as HTMLElement | null;
      if (!cardElement) return;

      const fullCardWidth = cardElement.offsetWidth + GAP;
      if (!fullCardWidth) return;

      const newPageIndex = Math.round(el.scrollLeft / (fullCardWidth * perView));
      const clampedIndex = Math.max(0, Math.min(newPageIndex, totalPages - 1));
      setActivePage(clampedIndex);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updatePageOnScroll();
        ticking = false;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cards.length, perView, totalPages]);

  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = railRef.current;
    if (!el) return;
    e.preventDefault();
    draggingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragScrollLeftRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    const el = railRef.current;
    if (!el) return;
    e.preventDefault();
    const dist = e.pageX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(dist);
    el.scrollLeft = dragScrollLeftRef.current - dist;
  };

  const endDrag = () => {
    const el = railRef.current;
    if (!el) return;
    if (draggingRef.current) {
      draggingRef.current = false;
      el.style.scrollSnapType = "x mandatory";
      el.style.cursor = "grab";
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (dragDistanceRef.current > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const cardBasis = `calc((100% - ${GAP * (perView - 1)}px) / ${perView})`;

  if (!cards.length) return null;

  return (
    <section className="relative mx-auto max-w-6xl overflow-x-hidden px-4 text-white sm:px-6 lg:px-0">
      <div className="mb-4 mt-10 flex items-center justify-between">
        <h2 className="recoleta text-2xl font-extrabold sm:text-3xl lg:text-4xl">
          Featured Episodes
        </h2>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={prev}
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 p-1 ring-1 ring-white/10 transition hover:bg-white/20"
          >
            <FiChevronLeft className="h-4 w-4 text-white/70" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 p-1 ring-1 ring-white/10 transition hover:bg-white/20"
          >
            <FiChevronRight className="h-4 w-4 text-white/70" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="
          relative overflow-x-auto overflow-y-visible cursor-grab
          snap-x snap-mandatory
          [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div className="flex" style={{ gap: GAP }}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              basis={cardBasis}
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activePage === i ? "scale-125 bg-white" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto mt-10 w-full max-w-[520px] px-6 lg:px-0">
        <div className="h-0.5 rounded-full bg-linear-to-r from-transparent via-[#00D8FF]/80 to-transparent" />
      </div>
    </section>
  );
}

function Card({
  card,
  basis,
  onLinkClick,
}: {
  card: CardData;
  basis: string;
  onLinkClick: (e: React.MouseEvent) => void;
}) {
  const { season, episode, img, href, disabled } = card;

  const inner = (
    <article
      className="
        featured-card group relative h-[180px] select-none overflow-hidden rounded-2xl
        ring-1 ring-white/10 shadow-[0_10px_25px_rgba(0,0,0,.45)]
        sm:h-[200px] md:h-[180px]
      "
      style={{ flex: `0 0 ${basis}` }}
    >
      <Image
        src={img}
        alt={episode}
        fill
        sizes="(max-width:1024px) 60vw, 25vw"
        className="
          object-cover object-center
          transition-transform duration-700 ease-in-out
          group-hover:scale-110
        "
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.10)_0%,rgba(0,0,0,.22)_45%,rgba(0,0,0,.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,.15)_55%,rgba(0,0,0,0)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="relative pr-[52px]">
          <p className="recoleta mb-0.5 truncate text-[15px] font-bold text-white drop-shadow-sm sm:text-[16px]">
            {season}
          </p>
          <p className="elza line-clamp-2 text-[12px] leading-[1.15] text-white/85 sm:text-[13px]">
            {episode}
          </p>
        </div>

        <div className="absolute bottom-4 right-4">
          {disabled ? (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[10px] text-white/60 ring-1 ring-white/25">
              N/A
            </span>
          ) : (
            <div
              className="
                grid h-10 w-10 place-items-center rounded-full
                bg-white/18 ring-1 ring-white/35 backdrop-blur-[4px]
                shadow-[0_6px_16px_rgba(0,0,0,.55)]
                transition group-hover:bg-white/25
              "
            >
              <FaPlay className="text-sm text-white" />
            </div>
          )}
        </div>
      </div>
    </article>
  );

  if (disabled || href === "#") {
    return <div style={{ flex: `0 0 ${basis}` }}>{inner}</div>;
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="block"
      style={{ flex: `0 0 ${basis}` }}
      onClick={onLinkClick}
      draggable={false}
    >
      {inner}
    </Link>
  );
}
