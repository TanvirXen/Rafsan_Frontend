"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
  TouchEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import apiList from "../../apiList";
import { slugifyTitle } from "../lib/slugifyTitle";

type ShowFromApi = {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  heroImage?: string;
  seasons?: number;
  reels?: number;
  featured?: boolean;
};

type ShowItem = {
  id: string;
  title: string;
  src: string;
  alt: string;
  slug: string;
};

type Dims = {
  CENTER_W: number;
  SIDE_W: number;
  CENTER_H: number;
  SIDE_H: number;
  CONTAINER_H: number;
  GAP: number;
};

function getDims(w: number): Dims {
  // Desktop / laptops (keep EXACT original)
  if (w >= 1280) {
    return {
      CENTER_W: 560,
      SIDE_W: 520,
      CENTER_H: 320, // h-80
      SIDE_H: 300, // h-[300px]
      CONTAINER_H: 360,
      GAP: 24,
    };
  }
  // Tablets
  if (w >= 640) {
    const centerW = Math.min(420, w - 120);
    return {
      CENTER_W: centerW,
      SIDE_W: Math.max(300, centerW - 60),
      CENTER_H: 280,
      SIDE_H: 240,
      CONTAINER_H: 320,
      GAP: 20,
    };
  }
  // Mobiles
  const centerW = Math.max(260, Math.min(300, w - 32));
  return {
    CENTER_W: centerW,
    SIDE_W: Math.max(220, centerW - 60),
    CENTER_H: 220,
    SIDE_H: 190,
    CONTAINER_H: 260,
    GAP: 16,
  };
}

export default function WatchShows() {
  /** ------- data from API ------- */
  const [items, setItems] = useState<ShowItem[]>([]);
  const [loading, setLoading] = useState(true);

  /** ------- autoplay helpers (declared early so we can use in effects) ------- */
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<() => void>(() => {});

  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /** fetch shows from API */
  useEffect(() => {
    let cancelled = false;

    async function fetchShows() {
      try {
        const res = await fetch(apiList.shows.list);
        if (!res.ok) {
          console.error("Failed to fetch shows", res.status);
          return;
        }

        const json = (await res.json()) as
          | ShowFromApi[]
          | { shows?: ShowFromApi[] };
        const arr: ShowFromApi[] = Array.isArray(json)
          ? json
          : json.shows ?? [];

        // Only shows that have thumbnails
        const mapped: ShowItem[] = arr
          .map((s) => {
            const src =
              s.thumbnail && s.thumbnail.trim() !== ""
                ? s.thumbnail
                : s.heroImage;

            if (!src) return null; // skip only if both are missing

            return {
              id: s._id,
              title: s.title,
              src,
              alt: s.title,
              slug: slugifyTitle(s.title),
            };
          })
          .filter((x): x is ShowItem => x !== null);

        if (!cancelled) {
          setItems(mapped);
        }
      } catch (e) {
        console.error("Error fetching watch-shows carousel", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchShows();

    return () => {
      cancelled = true;
      stop(); // clear interval on unmount
    };
  }, []);

  /** ------- geometry / layout (SSR-safe) ------- */
  // initial dims must be the SAME for server & first client render
  const [dims, setDims] = useState<Dims>(() => getDims(1440));

  useEffect(() => {
    const onResize = () => setDims(getDims(window.innerWidth));
    onResize(); // apply real width after mount
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { CENTER_W, SIDE_W, CENTER_H, SIDE_H, CONTAINER_H, GAP } = dims;

  const DEPTH = 100;
  const SWIVEL = 16;
  const SCALE_DROP = 0.08;

  const hasItems = items.length > 0;
  const N = Math.max(items.length, 1); // avoid mod 0
  const CENTER_TO_SIDE = CENTER_W / 2 + GAP + SIDE_W / 2;

  const [active, setActive] = useState(0);

  // if items length shrinks below active index, clamp
  useEffect(() => {
    if (!hasItems) return;
    setActive((prev) => (prev >= items.length ? 0 : prev));
  }, [items.length, hasItems]);

  const wrap = (i: number) => ((i % N) + N) % N;
  const delta = (i: number) => {
    let d = i - active;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    return d;
  };

  /** ------- autoplay ------- */
  startRef.current = () => {
    stop();
    if (items.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setActive((a) => ((a + 1) % items.length));
    }, 3200);
  };

  useEffect(() => {
    if (items.length > 1) startRef.current();
    return stop;
  }, [items.length]);

  /** ------- drag / swipe ------- */
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const handleStart = (clientX: number) => {
    stop();
    dragStartX.current = clientX;
    dragging.current = true;
  };
  const handleMove = (clientX: number) => {
    if (!dragging.current || dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;
    if (Math.abs(diff) > 60) {
      setActive((a) => wrap(a + (diff < 0 ? 1 : -1)));
      dragging.current = false;
      dragStartX.current = null;
    }
  };
  const handleEnd = () => {
    dragging.current = false;
    dragStartX.current = null;
    if (items.length > 1) startRef.current();
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
    handleStart(e.clientX);
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) =>
    handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) =>
    handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) =>
    handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  const dots = useMemo(
    () => Array.from({ length: items.length }, (_, i) => i),
    [items.length]
  );

  // simple tab labels from show titles (fallback to static text if none yet)
  const tabLabels =
    items.length > 0
      ? items.map((i) => i.title.toUpperCase())
      : ["WHAT A SHOW", "PODCAST", "VLOG", "STANDUP COMEDY"];

  return (
    <section className='relative mt-8 overflow-x-hidden pb-14 sm:pb-16'>
      {/* soft background glows */}
      <div className='absolute inset-0 z-0'>
        <div
          className='mx-auto h-full max-w-[1600px]'
          style={{
            background: [
              "radial-gradient(65% 70% at 50% 45%, rgba(45,27,89,0.55) 0%, rgba(45,27,89,0.15) 48%, rgba(0,0,0,0) 72%)",
              "radial-gradient(40% 50% at 82% 40%, rgba(45,27,89,0.28) 0%, rgba(45,27,89,0) 62%)",
              "radial-gradient(40% 50% at 18% 40%, rgba(45,27,89,0.28) 0%, rgba(45,27,89,0) 62%)",
            ].join(","),
          }}
        />
      </div>

      {/* OUTER container matches Navbar/Footer (1600 rail) */}
      <div className='site-shell-wide relative z-10'>
        {/* INNER content rail is exactly 1100 on md+; fluid on small */}
        <div className='mx-auto w-full max-w-[1100px]'>
          <h2 className='recoleta mt-9 mb-3 text-center text-[32px] font-bold leading-tight text-white sm:text-[36px] md:mt-[52px] md:text-[40px]'>
            Watch Shows
          </h2>

          {/* tabs (labels from API titles if present, else fallback) */}
          <nav
            className='mb-6 md:mb-7 flex justify-center select-none font-semibold text-[#00D8FF] tracking-tight'
            aria-label='Show categories'
          >
            <div className='text-[11px] sm:text-[12px] text-center elza'>
              {tabLabels.map((t, i) => (
                <span key={`${t}-${i}`}>
                  {t}
                  {i < tabLabels.length - 1 && (
                    <span className='opacity-60 px-1.5 '> | </span>
                  )}
                </span>
              ))}
            </div>
          </nav>

          {loading && items.length === 0 && (
            <p className='text-center text-sm text-white/70 mb-6'>
              Loading shows…
            </p>
          )}

          {/* carousel (draggable / swipeable) */}
          {items.length > 0 && (
            <>
              <div
                className='relative flex items-center justify-center perspective-[1600px] [transform-style:preserve-3d] select-none'
                style={{ height: CONTAINER_H }}
                onMouseEnter={stop}
                onMouseLeave={items.length > 1 ? () => startRef.current() : undefined}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                aria-roledescription='carousel'
              >
                {items.map((item, i) => {
                  const d = delta(i);
                  const isCenter = d === 0;
                  const isSide = Math.abs(d) === 1;
                  const visible = isCenter || isSide;

                  const x = d * CENTER_TO_SIDE;
                  const z = -Math.abs(d) * DEPTH;
                  const ry = d * -SWIVEL;
                  const sc = 1 - Math.min(Math.abs(d) * SCALE_DROP, 0.24);
                  const href = `/shows/${item.slug}`;

                  const w = isCenter ? CENTER_W : SIDE_W;
                  const h = isCenter ? CENTER_H : SIDE_H;

                  return (
                    <article
                      key={item.id}
                      className={[
                        "absolute overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,.55)] rounded-[18px]",
                        "transition-[transform,opacity,filter,visibility] ease-linear",
                        "before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.04)]",
                      ].join(" ")}
                      style={{
                        width: w,
                        height: h,
                        transform: `translate3d(${x}px,0,${z}px) rotateY(${ry}deg) scale(${sc})`,
                        zIndex: 100 - Math.abs(d),
                        opacity: visible
                          ? 1 - Math.min(Math.abs(d) * 0.25, 0.5)
                          : 0,
                        pointerEvents: visible
                          ? ("auto" as const)
                          : ("none" as const),
                        visibility: visible ? "visible" : "hidden",
                        transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)",
                        transitionDuration: "600ms",
                      }}
                      aria-hidden={!isCenter}
                    >
                      <div className='relative w-full h-full'>
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes='(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 560px'
                          priority={isCenter}
                          className='object-cover'
                        />

                        {isCenter && (
                          <div
                            className='absolute inset-x-0 bottom-0 pointer-events-none'
                            style={{
                              height: Math.max(80, Math.round(h * 0.28)),
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.85) 100%)",
                            }}
                          />
                        )}

                        {isCenter && (
                          <div className='absolute inset-x-0 bottom-0 flex items-end justify-between px-4 sm:px-5 pb-3 sm:pb-4'>
                            <Link
                              href={href}
                              className='flex items-center gap-2 sm:gap-3 hover:-translate-y-px transition-transform duration-200'
                            >
                              <span className='w-1 h-6 bg-[#00D8FF] rounded-full shadow-[0_0_12px_rgba(0,216,255,.7)]' />
                              <span className='text-white font-extrabold text-[16px] sm:text-[20px] md:text-[22px] recoleta'>
                                {item.title}
                              </span>
                            </Link>

                            <Link
                              href={href}
                              aria-label={`Open ${item.title}`}
                              className='
                                font-extrabold elza text-black bg-[#00D8FF]
                                px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[10px]
                                shadow-[0_10px_30px_rgba(0,216,255,.35)]
                                transition-transform duration-200 hover:-translate-y-px
                              '
                            >
                              Watch Now
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* dots */}
              {items.length > 1 && (
                <div
                  className='mt-[18px] md:mt-[22px] flex justify-center gap-2 sm:gap-2.5'
                  role='tablist'
                  aria-label='Slides'
                >
                  {dots.map((d) => (
                    <button
                      key={d}
                      onClick={() => setActive(d)}
                      aria-selected={d === active}
                      role='tab'
                      aria-label={`Go to slide ${d + 1}`}
                      className={[
                        "rounded-full border-0 outline-none cursor-pointer",
                        "w-2 h-2 sm:w-2.5 sm:h-2.5",
                        d === active
                          ? "bg-white shadow-[0_0_10px_rgba(0,216,255,.7)] scale-[1.15]"
                          : "bg-white/35",
                        "transition-[background,transform] duration-200",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className='flex justify-center mt-5 md:mt-6'>
            <Link
              href='/explore-shows'
              className='elza inline-flex h-11 items-center justify-center rounded-full border border-[#00D8FF] px-5 text-sm font-extrabold text-white transition hover:bg-white/6 md:h-12 md:px-6 md:text-base'
            >
              Explore all content!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
