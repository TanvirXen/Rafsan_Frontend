/* eslint-disable @typescript-eslint/no-explicit-any */
// app/event-reg/components/EventRegClient.tsx
"use client";

import Image from "next/image";
import React from "react";
import Collaboration from "./collaboration";
import Newsletter from "@/app/section/newsletter";
import EventDetailsSection from "./eventDetails";

type Occurrence = {
  id: string; // `${eventId}:${dateISO}`
  eventId: string;
  slug?: string;
  title: string;
  dateISO: string;
  img: string;
  blurb: string;
  venue?: string;
  city?: string;
  country?: string;
  brands: any[];
};

type Props = { occurrences: Occurrence[] };

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function fmtTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
function venueLine(o?: Pick<Occurrence, "venue" | "city" | "country">) {
  return [o?.venue, o?.city, o?.country].filter(Boolean).join(", ");
}

export default function EventRegClient({ occurrences }: Props) {
  const [idx, setIdx] = React.useState(0);
  const sel = occurrences[idx];

  const railRef = React.useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    if (!railRef.current) return;
    const card =
      railRef.current.querySelector<HTMLElement>("[data-card='true']");
    const cardW = card ? card.offsetWidth + 12 : 220;
    railRef.current.scrollBy({ left: dir * cardW * 1.2, behavior: "smooth" });
    setIdx((i) => {
      const next = Math.min(occurrences.length - 1, Math.max(0, i + dir));
      return next;
    });
  };

  return (
    <div className='bg-[#121212] text-white'>
      {/* ======= Banner with poster (left) + title/rail (right) ======= */}
      <section
        className='
          relative isolate overflow-hidden
          py-8 sm:py-10 md:py-14
        '
      >
        {/* BG image + overlays */}
        <div className='absolute inset-0 -z-10'>
          <Image
            src={sel?.img || "/assets/reg.png"}
            alt='Background'
            fill
            priority
            sizes='(max-width: 768px) calc(100vw - 1px), calc(100vw - 15px)'
            className='object-cover'
            style={{ objectPosition: "50% 42%" }}
          />
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0)_0%,#121212_100%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(0deg,rgba(18,18,18,.6),rgba(18,18,18,.6))]' />
        </div>

        {/* Left: Poster */}
        <div className='site-shell mx-auto grid w-full max-w-[1100px] items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8'>
          <div className='relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,.45)] ring-1 ring-white/10'>
            <Image
              src={sel?.img || "/assets/reg.png"}
              alt={`${sel?.title ?? "Event"} poster`}
              fill
              sizes='(max-width: 768px) calc(100vw - 2rem), 520px'
              className='object-cover'
            />
          </div>

          {/* Right: Title + rail */}
          <div className='flex w-full max-w-[34rem] flex-col gap-3 md:gap-5'>
            <h2 className='recoleta w-full text-[28px] leading-tight sm:text-[34px] md:text-[40px]'>
              {sel?.title ?? "Upcoming Events"}
            </h2>

            {/* Controls */}
            <div className='flex w-full items-center justify-between'>
              <span className='text-sm text-white/80'>
                {occurrences.length} upcoming{" "}
                {occurrences.length === 1 ? "date" : "dates"}
              </span>
              <div className='flex gap-2'>
                <button
                  onClick={() => scrollByCards(-1)}
                  className='grid h-9 w-9 place-items-center rounded bg-white/15 ring-1 ring-white/15 hover:bg-white/25 disabled:opacity-40'
                  disabled={idx === 0}
                  aria-label='Previous'
                >
                  {"\u2039"}
                </button>
                <button
                  onClick={() => scrollByCards(1)}
                  className='grid h-9 w-9 place-items-center rounded bg-white/15 ring-1 ring-white/15 hover:bg-white/25 disabled:opacity-40'
                  disabled={idx === occurrences.length - 1}
                  aria-label='Next'
                >
                  {"\u203A"}
                </button>
              </div>
            </div>

            {/* Rail: responsive, snap, hidden scrollbar */}
            <div className='relative w-full'>
              <div className='pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#121212] to-transparent' />
              <div className='pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#121212] to-transparent' />

              <div
                ref={railRef}
                className='
                  overflow-x-auto scroll-smooth snap-x snap-mandatory
                  [-ms-overflow-style:none] [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                '
              >
                <div className='flex gap-3 pr-4'>
                  {occurrences.map((o, i) => {
                    const active = i === idx;
                    return (
                      <button
                        key={o.id}
                        data-card='true'
                        onClick={() => setIdx(i)}
                        className={[
                          "snap-start shrink-0 rounded-xl ring-1 p-2 text-left transition",
                          "w-[220px] md:w-[240px]",
                          active
                            ? "ring-[#00D8FF] bg-white/10"
                            : "ring-white/10 bg-black/20 hover:bg-black/25",
                        ].join(" ")}
                        aria-label={`Select ${o.title} on ${fmtDate(o.dateISO)}`}
                      >
                        <div className='relative h-[110px] w-full overflow-hidden rounded-md'>
                          <Image
                            src={o.img}
                            alt={o.title}
                            fill
                            sizes='240px'
                            className='object-cover'
                          />
                        </div>
                        <div className='mt-2 line-clamp-1 text-[13px] leading-4'>
                          {o.title}
                        </div>
                        <div className='text-[12px] opacity-80'>
                          {fmtDate(o.dateISO)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Blurb */}
            <p className='w-full text-[14px] leading-6 sm:text-[15px] md:text-[16px]'>
              {sel?.blurb ?? "Pick a date to see details and register."}
            </p>
          </div>
        </div>

        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px border-b border-black/10' />
      </section>

      {/* ======= Details + Registration for SELECTED OCCURRENCE ======= */}
      {sel && (
        <EventDetailsSection
          eventId={sel.eventId}
          eventDateISO={sel.dateISO}
          primaryDate={fmtDate(sel.dateISO)}
          timeText={fmtTime(sel.dateISO)}
          venue={venueLine(sel) || undefined}
        />
      )}

      <Collaboration />
      <Newsletter />
    </div>
  );
}
