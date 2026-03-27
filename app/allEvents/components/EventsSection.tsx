// app/components/EventsSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type EventItem = {
  id: string;
  title: string;
  date: string;
  img: string;
  slug?: string;
  href?: string; // if provided, this wins
};

type Props = {
  title: string;
  events: EventItem[];
  divider?: boolean;
};

const normalizeSrc = (src: string) =>
  src.startsWith("//") ? src.replace(/^\/\//, "/") : src;

export default function EventsSection({
  title,
  events,
  divider = true,
}: Props) {
  return (
    <section
      className='
        relative isolate w-full text-white
        bg-[radial-gradient(50%_50%_at_50%_50%,rgba(18,18,18,0)_0%,#121212_100%),#2D1B59]
        py-8 sm:py-10 md:py-14
      '
    >
      <div className='site-shell mx-auto w-full max-w-[1100px] space-y-6'>
        {/* Title line */}
        <div className='box-border flex min-h-8 items-center gap-[10px] border-l-4 border-[#00D8FF] pl-5 md:min-h-12'>
          <h2 className='recoleta text-[28px] font-bold leading-none text-white md:text-[40px]'>
            {title}
          </h2>
        </div>

        {/* Mobile: Carousel */}
        <MobileCarousel events={events} />

        {/* Desktop: Grid */}
        <div className='hidden md:grid md:grid-cols-2 md:gap-[20px]'>
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>

        {divider && (
          <div className='mx-auto mt-10 hidden w-full max-w-[520px] md:block'>
            <div
              className='h-[2px] rounded-full'
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,216,255,0.8) 50%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>
        )}
      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px border-b border-black/10' />
    </section>
  );
}

/* ---------- Mobile Carousel ---------- */
/* ---------- Mobile Carousel (swipe + mouse drag + snap) ---------- */
function MobileCarousel({ events }: { events: EventItem[] }) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = React.useState(0);

  // mouse-drag state (desktop)
  const draggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);

  const clamp = React.useCallback(
    (n: number) => Math.max(0, Math.min(n, events.length - 1)),
    [events.length]
  );

  const scrollToIndex = React.useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const target = clamp(i);
      el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
      setIdx(target);
    },
    [clamp]
  );

  // keep idx synced when user swipes/scrolls
  const onScroll = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    const next = clamp(Math.round(el.scrollLeft / w));
    setIdx(next);
  }, [clamp]);

  // snap to nearest slide after mouse drag ends
  const snapToNearest = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    const next = clamp(Math.round(el.scrollLeft / w));
    el.scrollTo({ left: next * w, behavior: "smooth" });
    setIdx(next);
  }, [clamp]);

  // mouse drag handlers (doesn't interfere with touch swipe)
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    draggingRef.current = true;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    e.preventDefault(); // prevents text selection while dragging
    const dx = e.pageX - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - dx;
  };

  const stopDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    snapToNearest();
  };

  if (events.length === 0) return null;

  return (
    <div className="md:hidden">
      <div className="relative">
        {/* Arrows */}
        <div className="absolute right-0 top-[-8px] z-20 flex gap-2">
          <button
            aria-label="Previous"
            onClick={() => scrollToIndex(idx - 1)}
            className="h-8 w-8 rounded bg-white/20 text-white grid place-items-center backdrop-blur-[1px] ring-1 ring-white/15 hover:bg-white/25 active:scale-95 disabled:opacity-40"
            disabled={idx === 0}
          >
            <span className="-translate-y-[1px] text-lg">{"\u2039"}</span>
          </button>
          <button
            aria-label="Next"
            onClick={() => scrollToIndex(idx + 1)}
            className="h-8 w-8 rounded bg-white/20 text-white grid place-items-center backdrop-blur-[1px] ring-1 ring-white/15 hover:bg-white/25 active:scale-95 disabled:opacity-40"
            disabled={idx === events.length - 1}
          >
            <span className="-translate-y-[1px] text-lg">{"\u203A"}</span>
          </button>
        </div>

        {/* Scroll + Snap viewport */}
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className={[
            "overflow-x-auto",
            "scroll-smooth",
            "snap-x snap-mandatory",
            "select-none",
            "cursor-grab active:cursor-grabbing",
            // hide scrollbar
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          <div className="flex w-full">
            {events.map((ev) => (
              <div key={ev.id} className="w-full shrink-0 snap-start">
                <EventCard ev={ev} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-3 flex justify-center gap-2">
          {events.map((_, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  active ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* ---------- Card ---------- */
function EventCard({ ev }: { ev: EventItem }) {
  // Build a safe, per-card href:
  const href =
    ev.href ??
    (ev.slug
      ? `/event-reg/${encodeURIComponent(ev.slug)}`
      : `/event-reg/${encodeURIComponent(ev.id)}`);

  return (
    // Create a new stacking context per-card so nothing bleeds over neighbors
    <article className='relative z-0 aspect-[4/5] w-full overflow-hidden rounded-[16px] ring-1 ring-black/10 md:aspect-[5/6]'>
      {/* Image layer (kept below content) */}
      <div className='relative z-0 h-full w-full'>
        <Image
          src={normalizeSrc(ev.img)}
          alt={ev.title}
          fill
          sizes='(max-width: 768px) calc(100vw - 2rem), 540px'
          className='object-cover'
          priority={false}
        />
        <div className='absolute inset-0 bg-black/25' />
        <div
          className='absolute inset-0'
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 90.38%)",
          }}
        />
      </div>

      {/* Content cluster pinned to bottom, above image layers */}
      <div className='absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-5 pb-5 md:pb-7'>
        <div className='flex min-w-0 flex-col items-center md:items-start'>
          <p
            className='recoleta max-w-[14rem] truncate text-[16px] font-[700] leading-7 text-white md:max-w-[20rem] md:text-[24px] md:leading-10'
            title={ev.title}
          >
            {ev.title}
          </p>
          <p className='elza max-w-[14rem] text-[12px] leading-5 text-white/90 md:max-w-[20rem] md:text-[16px]'>
            {ev.date}
          </p>
        </div>

        {/* CTA pill — highest inside the card */}
        <Link
          href={href}
          prefetch={false}
          data-href={href}
          aria-label={`Get tickets for ${ev.title}`}
          className='relative z-20 inline-flex h-9 items-center justify-center rounded-full bg-[#00D8FF] px-4 text-[#121212] shadow-[0_12px_24px_rgba(0,0,0,.35)] transition-transform hover:scale-[1.02] md:h-10 md:px-5'
        >
          <span className='elza inline-flex items-center justify-center text-[12px] font-[700] leading-4 md:text-[15px]'>
            GET TICKETS
          </span>
        </Link>
      </div>
    </article>
  );
}
