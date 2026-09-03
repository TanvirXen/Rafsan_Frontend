/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import apiList from "@/apiList";
import { resolveMediaUrl } from "@/app/lib/mediaUrl";

type Workshop = {
  src: string;
  alt: string;
  title: string;
  date: string; // human readable (for UI)
  dateISO: string; // stable ISO (for sorting/link)
  timeText?: string;
  venue?: string;
  href?: string; // /event-reg/<slugOrId>--YYYY-MM-DD
  ended?: boolean;
};

const TZ = "Asia/Dhaka";

function dateOnlyInTz(iso: string, tz = TZ) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  // en-CA gives YYYY-MM-DD, stable for URLs
  return d.toLocaleDateString("en-CA", { timeZone: tz });
}

const WORKSHOPS: Omit<Workshop, "dateISO">[] = [
  {
    src: "/assets/show.jpg",
    alt: "Talk on stage",
    title: "What a Show",
    date: "September 20, 2025",
    href: "/events",
  },
  {
    src: "/assets/exp1.jpg",
    alt: "Office session",
    title: "What a Show",
    date: "September 20, 2025",
    href: "/events",
  },
  {
    src: "/assets/works2.jpg",
    alt: "Studio floor",
    title: "What a Show",
    date: "September 20, 2025",
    href: "/events",
  },
];

/* ---------- sizes (DESKTOP UNCHANGED, MOBILE NOW HAS SIDE CARDS) ---------- */
type Dims = {
  CW: number;
  CH: number; // center (w,h)
  SW: number;
  SH: number; // side   (w,h)
  GAP: number;
  CONTAINER_H: number;
  hideSides: boolean; // if true: render center only
};

function getDims(w: number): Dims {
  // Desktop: your exact geometry
  if (w >= 1280) {
    return {
      CW: 400,
      CH: 500,
      SW: 330,
      SH: 412,
      GAP: 20,
      CONTAINER_H: 500,
      hideSides: false,
    };
  }
  // Tablet: smaller, keep side cards
  if (w >= 640) {
    const CW = Math.min(360, w - 180);
    const CH = 450;
    const SW = 300;
    const SH = 375;
    return { CW, CH, SW, SH, GAP: 18, CONTAINER_H: CH, hideSides: false };
  }
  // Mobile: center + smaller side cards for same 3D effect
  const CW = 300;
  const CH = 375;
  const SW = 260;
  const SH = 330;
  return {
    CW,
    CH,
    SW,
    SH,
    GAP: 16,
    CONTAINER_H: CH,
    hideSides: false, // show side cards on mobile too
  };
}

/* ---------------- API shapes + helpers ---------------- */
type Occurrence = { date: string; season?: number; episode?: number; image?: string; };
type ApiEvent = {
  _id: string;
  slug?: string;
  title: string;
  occurrences?: Occurrence[];
  date?: string[]; // legacy
  rangeDays?: { date: string; enabled: boolean; startTime: string; endTime: string; image?: string; }[];
  venue?: string;
  bannerImage?: string;
  cardImage?: string;
  imageLinkBg?: string;
  imageLinkOverlay?: string;
};

const isNE = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

function pickFirst<T>(...vals: Array<T | undefined | null>): T | undefined {
  for (const v of vals) {
    if (typeof v === "string" && (v as string).trim().length) return v as any;
    if (v) return v as any;
  }
  return undefined;
}

function normalizeOccurrences(ev: ApiEvent): Occurrence[] {
  if (Array.isArray(ev.occurrences) && ev.occurrences.length) {
    return ev.occurrences.filter((o): o is Occurrence => !!o && isNE(o.date));
  }
  const dates = Array.isArray(ev.date) ? ev.date.filter(isNE) : [];
  return dates.map((d) => ({ date: d }));
}

function toDateText(iso: string, tz = TZ) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: tz, // ✅ pin to Dhaka
  });
}

function hrefFor(ev: ApiEvent, iso: string, tz = TZ) {
  const key = isNE(ev.slug) ? ev.slug : ev._id;
  const token = dateOnlyInTz(iso, tz); // ✅ URL token is local BD date
  return `/event-reg/${encodeURIComponent(key)}--${token}`;
}

export default function UpcomingEventsHome() {
  const [apiItems, setApiItems] = useState<Workshop[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  // Fetch next three upcoming occurrences from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiList.events.list, { cache: "no-store" });
        const json = await res.json();
        const events: ApiEvent[] = Array.isArray(json?.events)
          ? json.events
          : [];
        const nowISO = new Date().toISOString();

        const flattened: Workshop[] = events
          .flatMap((ev) => {
            return normalizeOccurrences(ev)
              .filter((o) => isNE(o.date)) // keep all occurrences
              .map<Workshop>((o) => {
                const img = pickFirst(
                  o.image,
                  ev.imageLinkOverlay,
                  ev.cardImage,
                  ev.bannerImage,
                  ev.imageLinkBg
                ) || "/assets/exp1.jpg";
                
                let timeText = "";
                if (ev.rangeDays) {
                  const localDateStr = new Date(o.date).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
                  // try matching exactly by image too if available, but matching by date is most important
                  const rd = ev.rangeDays.find(r => r.enabled && r.date === localDateStr && (!r.image || r.image === o.image || !o.image));
                  if (rd) {
                    const formatTime = (t: string) => {
                      if (!t) return "";
                      const [h, m] = t.split(":");
                      let hr = parseInt(h, 10);
                      const ampm = hr >= 12 ? "PM" : "AM";
                      hr = hr % 12 || 12;
                      return `${hr}:${m} ${ampm}`;
                    };
                    const startStr = formatTime(rd.startTime);
                    const endStr = formatTime(rd.endTime);
                    timeText = endStr ? `${startStr} - ${endStr}` : startStr;
                  } else {
                    const timeStr = new Date(o.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Dhaka" });
                    if (timeStr && timeStr !== "12:00 AM") timeText = timeStr;
                  }
                } else {
                  const timeStr = new Date(o.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Dhaka" });
                  if (timeStr && timeStr !== "12:00 AM") timeText = timeStr;
                }

                return {
                  src: resolveMediaUrl(img),
                  alt: ev.title || "Event",
                  title: ev.title || "Event",
                  date: toDateText(o.date),
                  timeText,
                  venue: ev.venue,
                  dateISO: o.date,
                  href: hrefFor(ev, o.date),
                  ended: o.date < nowISO,
                };
              });
          })
          .sort((a, b) => {
            const aUpcoming = a.dateISO >= nowISO;
            const bUpcoming = b.dateISO >= nowISO;
            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;
            if (aUpcoming && bUpcoming) {
              return a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0;
            } else {
              return a.dateISO > b.dateISO ? -1 : a.dateISO < b.dateISO ? 1 : 0;
            }
          })
          .slice(0, 3);

        if (!cancelled) {
          setApiItems(flattened);
          setEventsLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setApiItems(
            WORKSHOPS.map((w, idx) => ({
              ...w,
              dateISO: `2099-01-0${idx + 1}T00:00:00.000Z`,
              ended: false,
            }))
          );
          setEventsLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Use API data when present, else fall back to your static list
  const DATA: Workshop[] = apiItems.length
    ? apiItems
    : eventsLoaded
      ? []
      : WORKSHOPS.map((w, idx) => ({
        ...w,
        dateISO: `2099-01-0${idx + 1}T00:00:00.000Z`,
        ended: false,
      }));
  const hasEvents = DATA.length > 0;

  /** ---------- responsive dims (SSR-safe) ---------- */
  const [dims, setDims] = useState<Dims>(() => getDims(1440));
  useEffect(() => {
    const onResize = () => setDims(getDims(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const n = DATA.length;
  const [i, setI] = useState(0);
  const wrap = (x: number) => ((x % (n || 1)) + (n || 1)) % (n || 1);

  /** ---------- drag / swipe (no autoplay; same anim everywhere) ---------- */
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const handleStart = (clientX: number) => {
    dragStartX.current = clientX;
    dragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!dragging.current || dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;
    if (Math.abs(diff) > 60) {
      setI((v) => wrap(v + (diff < 0 ? 1 : -1)));
      dragging.current = false;
      dragStartX.current = null;
    }
  };

  const handleEnd = () => {
    dragging.current = false;
    dragStartX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = handleEnd;
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX);
  const handleTouchEnd = handleEnd;

  const dots = useMemo(() => Array.from({ length: n }, (_, k) => k), [n]);

  const { CW, CH, SW, SH, GAP, CONTAINER_H, hideSides } = dims;
  const DEPTH = 100;
  const SWIVEL = 16;
  const SCALE_DROP = 0.08;
  const centerToSide = CW / 2 + GAP + SW / 2;

  return (
    <section className='relative'>
      {/* Confined background glow; mobile gets rounded container like Figma */}
      <div className='pointer-events-none absolute left-0 right-0 top-20 h-[660px] -z-10 hidden sm:block'>
        <div className='mx-auto h-full max-w-[1600px]'>
          <div className='h-full bg-[radial-gradient(60%_70%_at_50%_40%,rgba(76,25,122,0.45),rgba(0,0,0,0)_70%)]' />
        </div>
      </div>

      {/* Section rail */}
      <div className='site-shell text-white'>
        <div
          className='
            mx-auto
            w-full max-w-[32rem] sm:max-w-none
            bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0)_27.4%,#121212_100%),#2D1B59]
            rounded-[28px]
            px-5 py-8 gap-[15px] sm:px-0
            sm:bg-transparent sm:rounded-none sm:px-0 sm:py-0
          '
        >
          {/* Header */}
          <h2 className='recoleta text-center text-[28px] font-bold leading-[30px] sm:text-[40px] sm:leading-[48px]'>
            Events
          </h2>
          <p className='elza mt-2 mb-4 text-center text-[13px] leading-5 text-[#00D8FF] sm:mb-5 sm:text-[16px] sm:leading-6'>
            Grab the chance to join my events!
          </p>

          {/* Carousel */}
          <div
            className={hasEvents
              ? "relative mx-auto flex h-[375px] w-full max-w-[22rem] items-center justify-center select-none overflow-hidden perspective-[1400px] [transform-style:preserve-3d] sm:h-[450px] sm:max-w-[1100px] sm:overflow-visible md:h-[500px]"
              : "relative mx-auto flex min-h-[148px] w-full max-w-[32rem] items-center justify-center select-none sm:min-h-[132px]"}
            style={hasEvents ? { height: CONTAINER_H } : undefined}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-roledescription='carousel'
          >
            {/* 🔦 Mobile-only left shadow to emphasize card change */}
            <div className='pointer-events-none absolute inset-y-6 left-0 w-14 bg-gradient-to-r from-black/45 via-black/15 to-transparent rounded-l-[20px] sm:hidden' />

            {!hasEvents ? (
              <div className='relative flex w-full max-w-[34rem] items-center gap-4 overflow-hidden rounded-2xl border border-[#00D8FF]/25 bg-[#00D8FF]/[0.06] px-5 py-4 text-left shadow-[0_14px_40px_rgba(0,216,255,.08)] sm:px-6'>
                <div className='pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full border border-[#00D8FF]/15 animate-[spin_10s_linear_infinite]' />
                <div className='relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#00D8FF]/40 bg-[#00D8FF]/10 text-[#00D8FF] shadow-[0_0_22px_rgba(0,216,255,.16)] animate-[pulse_2.8s_ease-in-out_infinite]'>
                  <svg width='25' height='25' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                    <rect x='3' y='5' width='18' height='16' rx='3' stroke='currentColor' strokeWidth='1.5' />
                    <path d='M7 3V7M17 3V7M3 10H21' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                    <path d='M8 14H8.01M12 14H12.01M16 14H16.01M8 17H8.01M12 17H12.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                  </svg>
                </div>
                <div className='relative min-w-0'>
                  <p className='elza text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D8FF]/75'>
                    Calendar status: suspiciously peaceful
                  </p>
                  <p className='recoleta mt-1 text-base font-bold leading-tight text-white sm:text-lg'>
                    No upcoming events are published right now. Contact the team to discuss a private booking or upcoming program.
                  </p>
                </div>
              </div>
            ) : DATA.map((w, idx) => {
              let d = idx - i;
              if (d > n / 2) d -= n;
              if (d < -n / 2) d += n;

              const isCenter = d === 0;
              const isSide = Math.abs(d) === 1;

              // if hideSides ever true, only render center
              if (hideSides && !isCenter) return null;

              const x = d * centerToSide;
              const z = -Math.abs(d) * DEPTH;
              const ry = d * -SWIVEL;
              const sc = 1 - Math.min(Math.abs(d) * SCALE_DROP, 0.24);

              const wpx = isCenter ? CW : SW;
              const hpx = isCenter ? CH : SH;

              return (
                <article
                  key={`${w.src}|${w.dateISO}|${w.href ?? ""}`}
                  className='absolute overflow-hidden transition-[transform,opacity,filter,visibility] duration-500 rounded-[16px] before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                  style={{
                    width: wpx,
                    height: hpx,
                    transform: `translate3d(${x}px,0,${z}px) rotateY(${ry}deg) scale(${sc})`,
                    zIndex: 100 - Math.abs(d),
                    opacity:
                      isCenter || isSide
                        ? 1 - Math.min(Math.abs(d) * 0.3, 0.55)
                        : 0,
                    visibility: isCenter || isSide ? "visible" : "hidden",
                    pointerEvents:
                      isCenter || isSide
                        ? ("auto" as const)
                        : ("none" as const),
                    willChange: "transform",
                  }}
                  aria-hidden={!isCenter}
                >
                  <div className='relative h-full w-full'>
                    <Image
                      src={w.src}
                      alt={w.alt}
                      fill
                      className='object-cover'
                      sizes='(max-width: 640px) 300px, (max-width: 1024px) 360px, 400px'
                      priority={isCenter}
                    />

                    {/* Dim sides on larger screens; center gets gradient */}
                    {!isCenter && !hideSides && (
                      <div className='absolute inset-0 bg-black/45' />
                    )}
                    {/*
                      Overlay content. The scrim lives on this container rather
                      than a fixed-height sibling so it always grows with the
                      text — event posters are busy, and a short scrim left the
                      title sitting on artwork. Below sm the card is only 300px
                      wide, which is not enough for the title and the button
                      side by side, so they stack.
                    */}
                    {isCenter && (
                      <div className='absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,.4)_22%,rgba(0,0,0,.82)_52%,rgba(0,0,0,.96)_100%)] p-3 pt-16 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:p-4 sm:pt-16'>
                        <div className='min-w-0 leading-none'>
                          <p className='text-[14px] sm:text-[16px] font-bold recoleta text-white line-clamp-2 break-words'>
                            {w.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-1">
                            {w.timeText && (
                              <span className="inline-flex items-center rounded-full bg-[#00D8FF] px-2 py-0.5 text-[9px] sm:text-[11px] font-bold text-[#121212]">
                                {w.timeText}
                              </span>
                            )}
                            {w.venue && (
                              <span className="inline-flex items-center justify-center rounded-full bg-[#00D8FF] h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] text-[#121212]" title={w.venue}>
                                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2 h-2.5 sm:w-2.5 sm:h-3">
                                  <path d="M5 0C2.23858 0 0 2.23858 0 5C0 8.75 5 12 5 12C5 12 10 8.75 10 5C10 2.23858 7.76142 0 5 0ZM5 6.5C4.17157 6.5 3.5 5.82843 3.5 5C3.5 4.17157 4.17157 3.5 5 3.5C5.82843 3.5 6.5 4.17157 6.5 5C6.5 5.82843 5.82843 6.5 5 6.5Z" fill="currentColor"/>
                                </svg>
                              </span>
                            )}
                          </div>
                          <p className='text-[12px] sm:text-[16px] font-normal text-white/85 elza'>
                            {w.date}
                          </p>
                        </div>

                        {w.ended ? (
                          <button
                            disabled
                            className='elza grid h-9 w-full shrink-0 place-items-center whitespace-nowrap rounded-full bg-white/20 px-4 text-sm font-extrabold text-white/50 border border-white/10 shadow-[0_10px_26px_rgba(0,0,0,.35)] cursor-not-allowed sm:h-10 sm:w-auto sm:min-w-[7rem]'
                            aria-label='Ended'
                          >
                            Ended
                          </button>
                        ) : (
                          <Link
                            href={w.href ?? "#"}
                            className='elza grid h-9 w-full shrink-0 place-items-center whitespace-nowrap rounded-full bg-[#00D8FF] px-4 text-sm font-extrabold text-[#121212] shadow-[0_10px_26px_rgba(0,0,0,.35)] transition hover:brightness-105 sm:h-10 sm:w-auto sm:min-w-[7rem]'
                            aria-label='Get tickets'
                          >
                            Get Tickets
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Dots */}
          {n > 0 && <div
            className='mt-4 sm:mt-5 flex justify-center gap-2'
            role='tablist'
            aria-label='Slides'
          >
            {dots.map((d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                aria-selected={d === i}
                role='tab'
                aria-label={`Go to slide ${d + 1}`}
                className={[
                  "h-2 w-2 rounded-full transition",
                  d === i ? "bg-white" : "bg-white/40 hover:bg-white/70",
                ].join(" ")}
              />
            ))}
          </div>}

          {/* CTA */}
          <div className='mt-4 flex justify-center sm:mt-5'>
            <Link
              href='/events'
              className='elza inline-flex h-11 items-center justify-center rounded-full border border-[#40D7FF] px-6 text-sm font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] transition hover:bg-white/10 sm:h-12 sm:text-base'
            >
              Explore more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
