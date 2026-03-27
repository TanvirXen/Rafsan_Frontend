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
  href: string;
};

type Props = {
  title: string;                 // "Upcoming Events" | "Past Events"
  events: EventItem[];
  divider?: boolean;             // cyan hairline below section (desktop only)
};



// Utility: safe src
const normalizeSrc = (src: string) =>
  src.startsWith("//") ? src.replace(/^\/\//, "/") : src;

export default function EventsSection({ title, events, divider = true }: Props) {
  return (
    <section
      className="
        relative isolate text-white
        mx-auto w-full
        bg-[radial-gradient(50%_50%_at_50%_50%,rgba(18,18,18,0)_0%,#121212_100%),#2D1B59]
        px-[40px] py-[30px] gap-[15px]
        md:px-[170px] md:py-[60px] md:gap-[60px]
      "
    >
      <div className="mx-auto w-full max-w-[1100px] space-y-[24px]">
        {/* Title line */}
        <div className="box-border flex items-center gap-[10px] border-l-4 border-[#00D8FF] pl-[20px] h-[32px] md:h-[48px]">
          <h2 className="recoleta font-bold text-white text-[24px] leading-[24px] md:text-[40px] md:leading-[48px]">
            {title}
          </h2>
        </div>

        {/* ===== Mobile: Carousel ===== */}
        <MobileCarousel events={events} />

        {/* ===== Desktop: Grid ===== */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-[20px]">
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>

        {/* Cyan gradient hairline (desktop spec 520px) */}
        {divider && (
          <div className="mx-auto mt-[60px] hidden w-[520px] md:block">
            <div
              className="h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,216,255,0.8) 50%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>
        )}
      </div>

      {/* bottom 1px hairline (Vector 200) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px border-b border-black/10" />
    </section>
  );
}

/* ---------- Mobile Carousel ---------- */


function MobileCarousel({ events }: { events: EventItem[] }) {
  const [idx, setIdx] = React.useState(0);
  const clamp = (n: number) => Math.max(0, Math.min(n, events.length - 1));
  const prev = () => setIdx((i) => clamp(i - 1));
  const next = () => setIdx((i) => clamp(i + 1));

  if (events.length === 0) return null;

  return (
    <div className="md:hidden">
      <div className="relative">
        {/* Arrows (top-right like mock) */}
        <div className="absolute right-0 top-[-8px] z-20 flex gap-2">
          <button
            aria-label="Previous"
            onClick={prev}
            className="
              h-8 w-8 rounded bg-white/20 text-white
              grid place-items-center
              backdrop-blur-[1px]
              ring-1 ring-white/15
              hover:bg-white/25 active:scale-95
              disabled:opacity-40
            "
            disabled={idx === 0}
          >
            <span className="inline-block -translate-y-[1px] text-lg">{"\u2039"}</span>
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="
              h-8 w-8 rounded bg-white/20 text-white
              grid place-items-center
              backdrop-blur-[1px]
              ring-1 ring-white/15
              hover:bg-white/25 active:scale-95
              disabled:opacity-40
            "
            disabled={idx === events.length - 1}
          >
            <span className="inline-block -translate-y-[1px] text-lg">{"\u203A"}</span>
          </button>
        </div>

        {/* Slider viewport */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {events.map((ev) => (
              <div key={ev.id} className="w-full shrink-0">
                <EventCard ev={ev} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots (centered below card) */}
        <div className="mt-3 flex justify-center gap-2">
          {events.map((_, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`
                  h-1.5 rounded-full transition-all
                  ${active ? "w-6 bg-white" : "w-1.5 bg-white/50"}
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Card (matches Figma sizes) ---------- */

function EventCard({ ev }: { ev: EventItem }) {
  return (
    <article
      className="
        relative overflow-hidden rounded-[16px]
        ring-1 ring-black/10
        w-full h-[375px]
        md:h-[675px]
        
      "
    >
      {/* Image layer with bottom fade */}
      <div className="relative h-full w-full">
        <Image
          src={normalizeSrc(ev.img)}
          alt={ev.title}
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), 540px"
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 90.38%)",
          }}
        />
      </div>

      {/* Content cluster pinned to bottom */}
      <div
        className="
          absolute inset-x-0 bottom-0
          flex items-end justify-between
          px-[20px] pb-[30px]
        "
      >
        {/* Title + date */}
        <div className="flex min-w-0 flex-col items-center md:items-start">
          <p
            className="
              truncate text-white recoleta
              text-[16px] leading-[32px] font-[700]
              md:text-[24px] md:leading-[48px]
              max-w-[260px] md:max-w-[358px]
            "
            title={ev.title}
          >
            {ev.title}
          </p>
          <p
            className="
              elza text-white
              text-[12px] leading-[16px]
              md:text-[16px] md:leading-[20px]
              opacity-90
              max-w-[260px] md:max-w-[358px]
            "
          >
            {ev.date}
          </p>
        </div>

        {/* CTA pill */}
        <Link
          href="/event-reg"
          className="
            inline-flex items-center justify-center
            rounded-full bg-[#00D8FF] text-[#121212]
            h-[28px] w-[107px] md:h-[36px] md:w-[132px]
            shadow-[0_12px_24px_rgba(0,0,0,.35)]
            transition-transform hover:scale-[1.02]
          "
        >
          <span
            className="
              elza inline-flex items-center justify-center
              h-[28px] w-[87px] rounded-full
              text-[12px] font-[700] leading-[16px]
              md:h-[36px] md:w-[112px] md:text-[16px] md:leading-[24px]
            "
          >
            GET TICKETS
          </span>
        </Link>
      </div>
    </article>
  );
}
