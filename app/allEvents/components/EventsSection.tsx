// app/allEvents/components/EventsSection.tsx
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
  ended?: boolean;
};

type Props = {
  title: string;
  events: EventItem[];
  divider?: boolean;
  variant?: "default" | "small";
};

const normalizeSrc = (src: string) =>
  src.startsWith("//") ? src.replace(/^\/\//, "/") : src;

export default function EventsSection({
  title,
  events,
  divider = true,
  variant = "default",
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
        <MobileCarousel events={events} variant={variant} />

        {/* Desktop: Grid */}
        <div className={`hidden md:grid gap-[20px] ${
          variant === "small"
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-2 lg:grid-cols-3"
        }`}>
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} variant={variant} />
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

/* ---------- Mobile Carousel (swipe + mouse drag + snap) ---------- */
function MobileCarousel({ events, variant = "default" }: { events: EventItem[]; variant?: "default" | "small" }) {
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
                <EventCard ev={ev} variant={variant} />
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
function EventCard({ ev, variant = "default" }: { ev: EventItem; variant?: "default" | "small" }) {
  // Build a safe, per-card href:
  const href =
    ev.href ??
    (ev.slug
      ? `/event-reg/${encodeURIComponent(ev.slug)}`
      : `/event-reg/${encodeURIComponent(ev.id)}`);

  const isSmall = variant === "small";

  const content = (
    <>
      {/* Image layer */}
      <div className='relative z-0 h-full w-full overflow-hidden'>
        <Image
          src={normalizeSrc(ev.img)}
          alt={ev.title}
          fill
          sizes={isSmall ? '(max-width: 640px) 200px, 300px' : '(max-width: 768px) calc(100vw - 2rem), 540px'}
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          priority={false}
        />
        <div className='absolute inset-0 bg-black/35 transition-opacity duration-300 group-hover:bg-black/20' />
        <div
          className='absolute inset-0 transition-opacity duration-300'
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 95%)",
          }}
        />
      </div>

      {/* Content cluster */}
      <div className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 ${
        isSmall ? "p-3 pb-4" : "px-5 pb-5 md:pb-7"
      }`}>
        <div className='flex min-w-0 flex-col items-start'>
          <p
            className={`recoleta font-[700] text-white truncate w-full ${
              isSmall
                ? "text-[14px] leading-tight md:text-[18px]"
                : "text-[16px] leading-7 md:text-[24px] md:leading-10"
            }`}
            title={ev.title}
          >
            {ev.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {(ev as any).timeText && (
              <span className="inline-flex items-center rounded-full bg-[#00D8FF] px-2 py-0.5 text-[9px] sm:text-[11px] font-bold text-[#121212]">
                {(ev as any).timeText}
              </span>
            )}
            {(ev as any).venue && (
              <span className="inline-flex items-center justify-center rounded-full bg-[#00D8FF] h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] text-[#121212]" title={(ev as any).venue}>
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2 h-2.5 sm:w-2.5 sm:h-3">
                  <path d="M5 0C2.23858 0 0 2.23858 0 5C0 8.75 5 12 5 12C5 12 10 8.75 10 5C10 2.23858 7.76142 0 5 0ZM5 6.5C4.17157 6.5 3.5 5.82843 3.5 5C3.5 4.17157 4.17157 3.5 5 3.5C5.82843 3.5 6.5 4.17157 6.5 5C6.5 5.82843 5.82843 6.5 5 6.5Z" fill="currentColor"/>
                </svg>
              </span>
            )}
          </div>
          <p className={`elza text-white/90 ${
            isSmall
              ? "text-[10px] leading-snug md:text-[12px] mt-1"
              : "text-[12px] leading-5 md:text-[16px] mt-1"
          }`}>
            {ev.date}
          </p>
        </div>

        {/* CTA pill */}
        {ev.ended ? (
          <button
            disabled
            className={`relative z-20 shrink-0 inline-flex items-center justify-center rounded-full bg-white/20 text-white/50 border border-white/10 cursor-not-allowed ${
              isSmall ? "h-7 px-2.5 text-[10px]" : "h-9 px-4 text-[12px] md:h-10 md:px-5 md:text-[15px]"
            }`}
          >
            <span className='elza font-[700] uppercase'>
              ENDED
            </span>
          </button>
        ) : (
          <span
            className={`relative z-20 shrink-0 inline-flex items-center justify-center rounded-full bg-[#00D8FF] text-[#121212] shadow-[0_12px_24px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:scale-105 ${
              isSmall ? "h-7 px-2.5 text-[10px]" : "h-9 px-4 text-[12px] md:h-10 md:px-5 md:text-[15px]"
            }`}
          >
            <span className='elza font-[700] uppercase'>
              GET TICKETS
            </span>
          </span>
        )}
      </div>
    </>
  );

  if (ev.ended) {
    return (
      <div
        className={`relative z-0 w-full overflow-hidden rounded-[16px] ring-1 ring-white/10 shadow-[0_10px_25px_rgba(0,0,0,.45)] block ${
          isSmall ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={`group relative z-0 w-full overflow-hidden rounded-[16px] ring-1 ring-white/10 shadow-[0_10px_25px_rgba(0,0,0,.45)] block transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${
        isSmall ? "aspect-[3/4]" : "aspect-[4/5]"
      }`}
    >
      {content}
    </Link>
  );
}
