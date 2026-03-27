"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

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

export default function ShowFeaturedEp({
  seasons,
  episodes,
}: ShowFeaturedEpProps) {
  // Build seasons map
  const seasonMap = useMemo(() => {
    const m = new Map<string, Season>();
    seasons.forEach((s) => m.set(s._id, s));
    return m;
  }, [seasons]);

  // Derive cards from episodes
const cards = useMemo(() => {
  if (!episodes?.length) return [];

  // ✅ only keep featured === true
  const featured = episodes.filter((e) => e.featured);

  if (!featured.length) return []; // or show a message instead

  return featured.map((ep) => {
    const seasonTitle = seasonMap.get(ep.seasonId)?.title ?? "Season";
    return {
      id: ep._id,
      season: seasonTitle,
      episode: ep.title,
      img: ep.thumbnail || "/assets/exp1.jpg",
      href: ep.link || "#",
      disabled: !ep.link,
    };
  });
}, [episodes, seasonMap]);


  /** responsive cards per view */
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

  /** Calculate total pages (groups of cards) */
  const totalPages = Math.ceil(cards.length / perView);

  /** scroll-snap carousel state */
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);

  /** Scroll to a specific PAGE */
  const scrollToPage = (pageIndex: number) => {
    const el = railRef.current;
    if (!el || !cards.length) return;

    const targetPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
    const cardIndex = targetPage * perView;
    const cardElement = el.querySelector(".featured-card") as HTMLElement;
    
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth;
    const targetScrollLeft = cardIndex * (cardWidth + GAP);

    el.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
    setActivePage(targetPage);
  };

  /** Controls */
  const next = () => {
    const nextPage = activePage >= totalPages - 1 ? 0 : activePage + 1;
    scrollToPage(nextPage);
  };

  const prev = () => {
    const prevPage = activePage <= 0 ? totalPages - 1 : activePage - 1;
    scrollToPage(prevPage);
  };
  const GAP = 24;

  /** Update active page on scroll */
  useEffect(() => {
    const el = railRef.current;
    if (!el || !cards.length) return;

    const updatePageOnScroll = () => {
      const cardElement = el.querySelector(".featured-card") as HTMLElement;
      if (!cardElement) return;

      const fullCardWidth = cardElement.offsetWidth + GAP;
      if (fullCardWidth === 0) return;

      const newPageIndex = Math.round(el.scrollLeft / (fullCardWidth * perView));
      const clampedIndex = Math.max(0, Math.min(newPageIndex, totalPages - 1));
      setActivePage(clampedIndex);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePageOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cards.length, perView, totalPages]);

  /** --- mouse hold & drag to scroll + CLICK BLOCKING --- */
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
    const currentX = e.pageX;
    const dist = currentX - dragStartXRef.current;
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
    <section className='relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 text-white overflow-x-hidden'>
      {/* header */}
      <div className='mb-4 mt-10 flex items-center justify-between'>
        <h2 className='recoleta text-2xl sm:text-3xl lg:text-4xl font-extrabold'>
          Featured Episodes
        </h2>

        <div className='flex items-center gap-2'>
          <button
            aria-label='Previous'
            onClick={prev}
            className='grid h-8 w-8 place-items-center rounded-md bg-white/10 p-1 ring-1 ring-white/10 hover:bg-white/20 transition'
          >
            <FiChevronLeft className='h-4 w-4 text-white/70' />
          </button>
          <button
            aria-label='Next'
            onClick={next}
            className='grid h-8 w-8 place-items-center rounded-md bg-white/10 p-1 ring-1 ring-white/10 hover:bg-white/20 transition'
          >
            <FiChevronRight className='h-4 w-4 text-white/70' />
          </button>
        </div>
      </div>

      {/* scroll-snap rail */}
      <div
        ref={railRef}
        className='
          relative
          overflow-x-auto overflow-y-visible
          snap-x snap-mandatory
          [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          cursor-grab
        '
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div className='flex' style={{ gap: GAP }}>
          {cards.map((c) => (
            <Card 
              key={c.id} 
              card={c} 
              basis={cardBasis} 
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className='mt-6 flex items-center justify-center gap-3'>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activePage === i
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className='mx-auto mt-10 w-full max-w-[520px] px-6 lg:px-0'>
        <div className='h-0.5 rounded-full bg-linear-to-r from-transparent via-[#00D8FF]/80 to-transparent' />
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

function Card({ 
  card, 
  basis, 
  onLinkClick 
}: { 
  card: CardData; 
  basis: string;
  onLinkClick: (e: React.MouseEvent) => void; 
}) {
  const { season, episode, img, href, disabled } = card;

  const inner = (
    <article
      className='
      featured-card
  group 
  snap-start 
  relative overflow-hidden rounded-2xl ring-1 ring-white/10
  shadow-[0_10px_25px_rgba(0,0,0,.45)]
  h-[240px] sm:h-[260px] md:h-[180px]
  select-none
      '
      style={{ flex: `0 0 ${basis}` }}
    >
      {/* Background Image with Zoom Effect */}
      <Image
        src={img}
        alt={`${season} ${episode}`}
        fill
        className='
          object-fill pointer-events-none 
          transition-transform duration-700 ease-in-out 
          group-hover:scale-110
        '
        sizes='(max-width:1024px) 50vw, 25vw'
      />
      
      {/* Dark overlay that gets stronger on hover */}
      <div className='absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/40 pointer-events-none' />
      
      {/* Bottom Gradient - Taller to support text expansion */}
      <div className='absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none opacity-90' />

      {/* Content Container */}
      <div className='absolute inset-x-0 bottom-0 p-4 pointer-events-none'>
        
        {/* 
           Wrapper handles the Layout. 
           pr-[48px] creates a safe zone on the right for the Play button,
           so text wraps before hitting it.
        */}
        <div className='relative pr-[48px]'>
          
          <p className='recoleta text-[15px] sm:text-[16px] font-bold text-white drop-shadow-sm truncate mb-0.5'>
            {season}
          </p>
          
          {/* 
             Title Logic: 
             Default: line-clamp-1 (shows ...)
             Hover: line-clamp-none (expands upwards to show full text)
          */}
          <p className='
            elza text-[12px] sm:text-[13px] text-white/85 
            line-clamp-1 group-hover:line-clamp-none
            transition-all duration-300
          '>
            {episode}
          </p>

        </div>

        {/* Play Button - Positioned Absolute Bottom Right */}
        <div className='absolute bottom-4 right-4 z-20'>
          <div 
            className='
              flex items-center justify-center 
              h-10 w-10 rounded-full 
              bg-white/20 backdrop-blur-md 
              shadow-[0_4px_12px_rgba(0,0,0,0.5)]
              ring-1 ring-white/50
              opacity-0 translate-y-2 scale-90
              transition-all duration-300 ease-out
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
            '
          >
            <FaPlay className="text-white ml-0.5 text-xs sm:text-sm" />
          </div>
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
      target='_blank'
      rel='noopener noreferrer'
      className='block'
      style={{ flex: `0 0 ${basis}` }}
      onClick={onLinkClick} 
      draggable={false}
    >
      {inner}
    </Link>
  );
}