"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";

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
};

const GAP = 24;

export default function ShowFeaturedEp({ seasons, episodes }: ShowFeaturedEpProps) {
  const seasonMap = useMemo(() => {
    const m = new Map<string, Season>();
    seasons.forEach((s) => m.set(s._id, s));
    return m;
  }, [seasons]);

  const cards = useMemo(() => {
    if (!episodes?.length) return [];
    const featured = episodes.filter((e) => e.featured);
    if (!featured.length) return [];

    return featured.map((ep) => ({
      id: ep._id,
      season: seasonMap.get(ep.seasonId)?.title ?? "Season",
      episode: ep.title,
      img: ep.thumbnail || "/assets/exp1.jpg",
      href: ep.link || "#",
      disabled: !ep.link,
    }));
  }, [episodes, seasonMap]);

  const [perView, setPerView] = useState(4);
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 4 : w >= 768 ? 2 : 1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const railRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(cards.length / perView));

  const scrollToPage = (pageIndex: number) => {
    const el = railRef.current;
    if (!el || !cards.length) return;

    const target = Math.max(0, Math.min(pageIndex, totalPages - 1));
    const firstCard = el.querySelector(".featured-card") as HTMLElement | null;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    el.scrollTo({
      left: target * perView * (cardWidth + GAP),
      behavior: "smooth",
    });
    setActivePage(target);
  };

  const next = () => scrollToPage(activePage >= totalPages - 1 ? 0 : activePage + 1);
  const prev = () => scrollToPage(activePage <= 0 ? totalPages - 1 : activePage - 1);

  // update active page on scroll
  useEffect(() => {
    const el = railRef.current;
    if (!el || !cards.length) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const firstCard = el.querySelector(".featured-card") as HTMLElement | null;
        if (!firstCard) return (ticking = false);

        const full = firstCard.offsetWidth + GAP;
        const page = Math.round(el.scrollLeft / (full * perView));
        setActivePage(Math.max(0, Math.min(page, totalPages - 1)));
        ticking = false;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cards.length, perView, totalPages]);

  // drag-to-scroll + click-blocking
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = railRef.current;
    if (!el) return;
    draggingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragScrollLeftRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;
    el.style.cursor = "grabbing";
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = railRef.current;
    if (!el || !draggingRef.current) return;
    const dist = e.pageX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(dist);
    el.scrollLeft = dragScrollLeftRef.current - dist;
  };

  const endDrag = () => {
    const el = railRef.current;
    if (!el) return;
    draggingRef.current = false;
    el.style.cursor = "grab";
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
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 text-white overflow-x-hidden">
      {/* header */}
      <div className="mb-4 mt-10 flex items-center justify-between">
        <h2 className="recoleta text-2xl sm:text-3xl lg:text-4xl font-extrabold">
          Featured Episodes
        </h2>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={prev}
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 ring-1 ring-white/10 hover:bg-white/20 transition"
          >
            <FiChevronLeft className="h-4 w-4 text-white/70" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 ring-1 ring-white/10 hover:bg-white/20 transition"
          >
            <FiChevronRight className="h-4 w-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* rail */}
      <div
        ref={railRef}
        className="
          overflow-x-auto snap-x snap-mandatory
          [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          cursor-grab
        "
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div className="flex" style={{ gap: GAP }}>
          {cards.map((c) => (
            <FeaturedCard
              key={c.id}
              card={c}
              basis={cardBasis}
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activePage === i ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
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

type CardData = {
  id: string;
  season: string;
  episode: string;
  img: string;
  href: string;
  disabled?: boolean;
};

function FeaturedCard({
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
        featured-card group snap-start
        relative overflow-hidden rounded-2xl ring-1 ring-white/10
        shadow-[0_10px_25px_rgba(0,0,0,.45)]
        h-[180px] sm:h-[200px] md:h-[180px]
        select-none
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

      {/* softer overlay like your banners */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.10)_0%,rgba(0,0,0,.22)_45%,rgba(0,0,0,.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,.15)_55%,rgba(0,0,0,0)_100%)]" />

      {/* bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="relative pr-[52px]">
          <p className="recoleta text-[15px] sm:text-[16px] font-bold text-white drop-shadow-sm truncate">
            {season}
          </p>
          <p className="elza text-[12px] sm:text-[13px] text-white/85 line-clamp-2">
            {episode}
          </p>
        </div>

        {/* play icon pinned */}
        <div className="absolute bottom-4 right-4">
          {disabled ? (
            <span
              className="
                grid h-10 w-10 place-items-center rounded-full
                bg-white/10 ring-1 ring-white/25 text-white/60 text-[10px]
              "
            >
              N/A
            </span>
          ) : (
            <div
              className="
                grid h-10 w-10 place-items-center rounded-full
                bg-white/18 ring-1 ring-white/35 backdrop-blur-[4px]
                shadow-[0_6px_16px_rgba(0,0,0,.55)]
                transition hover:bg-white/25
              "
            >
              <FiPlay className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </article>
  );

  if (disabled || href === "#") return <div style={{ flex: `0 0 ${basis}` }}>{inner}</div>;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      style={{ flex: `0 0 ${basis}` }}
      onClick={onLinkClick}
      draggable={false}
    >
      {inner}
    </Link>
  );
}
