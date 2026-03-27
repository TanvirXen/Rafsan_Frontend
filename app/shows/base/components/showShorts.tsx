/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/** data */
type ShortItem = { src: string; alt: string; href?: string };

const ITEMS: ShortItem[] = [
  { src: "/assets/sh3.jpg", alt: "Short 1" },
  { src: "/assets/exp1.jpg", alt: "Short 2" },
  { src: "/assets/show.jpg", alt: "Short 3" },
];

/** helpers */
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export default function ShowShorts() {
  const [i, setI] = useState(1);
  const n = ITEMS.length;

  // measure the actual rail width (inside max-w-6xl) so the three cards always fit
  const railRef = useRef<HTMLDivElement | null>(null);
  const [railW, setRailW] = useState(0);

  useEffect(() => {
    if (!railRef.current) return;
    const ro = new ResizeObserver(([entry]) =>
      setRailW(Math.floor(entry.contentRect.width))
    );
    ro.observe(railRef.current);
    return () => ro.disconnect();
  }, []);

  /** responsive card geometry (fits 3-up and scales nicely on lg) */
  const [{ baseW, baseH, sideScale, gap }, setGeom] = useState(() => ({
    baseW: 300, // will be recalculated
    baseH: 415,
    sideScale: 0.78,
    gap: 20,
  }));

  useEffect(() => {
    const compute = () => {
      // fall back to window width until rail measure appears
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const w = railW || (vw >= 1024 ? 960 : vw >= 640 ? vw - 48 : vw - 32);

      // gaps tighter on tiny, wider on lg
      const g =
        vw < 360 ? 12 : vw < 420 ? 14 : vw < 640 ? 16 : vw < 1024 ? 18 : 24;

      // make side cards a bit larger on desktop to match the reference
      const s = vw >= 1024 ? 0.85 : 0.78;

      // ensure: base + 2*gap + 2*(base*s) <= w   -> base <= (w - 2*gap)/(1 + 2*s)
      const fitBase = (w - 2 * g) / (1 + 2 * s);

      // allow larger hero on lg, but clamp so it never overflows
      const minB = vw >= 1024 ? 280 : 220;
      const maxB = vw >= 1024 ? 360 : 290; // bigger card on desktop
      const nextBaseW = clamp(Math.floor(fitBase), minB, maxB);

      // keep original aspect ~ 360/260
      const ratio = 360 / 260;
      const nextBaseH = Math.round(nextBaseW * ratio);

      setGeom({ baseW: nextBaseW, baseH: nextBaseH, sideScale: s, gap: g });
    };

    compute();
  }, [railW]);

  /** carousel logic */
  const wrap = (x: number) => ((x % n) + n) % n;
  const next = () => setI((v) => wrap(v + 1));
  const prev = () => setI((v) => wrap(v - 1));

  /** autoplay (pause on hover/focus/touch) */
  const timerRef = useRef<number | null>(null);
  const start = () => {
    stop();
    timerRef.current = window.setInterval(() => setI((v) => wrap(v + 1)), 3500);
  };
  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => {
    start();
    return stop;
  }, []);

  /** swipe on mobile */
  const touchX = useRef<number | null>(null);
  const onTouchStart: React.TouchEventHandler = (e) => {
    stop();
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    const startX = touchX.current;
    touchX.current = null;
    if (startX == null) {
      start();
      return;
    }
    const dx = e.changedTouches[0].clientX - startX;
    const THRESH = 40;
    if (dx > THRESH) prev();
    else if (dx < -THRESH) next();
    start();
  };

  /** --- NEW: mouse hold & drag to move --- */
  const mouseDownX = useRef<number | null>(null);
  const dragging = useRef(false);
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    stop();
    dragging.current = true;
    mouseDownX.current = e.clientX;
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current || mouseDownX.current == null) return;
    const dx = e.clientX - mouseDownX.current;
    const THRESH = 40; // same feel as touch
    if (dx > THRESH) {
      prev();
      mouseDownX.current = e.clientX; // allow continuous drag pagination
    } else if (dx < -THRESH) {
      next();
      mouseDownX.current = e.clientX;
    }
  };
  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    dragging.current = false;
    mouseDownX.current = null;
    start();
  };
  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    // if user drags out, end drag and resume autoplay
    dragging.current = false;
    mouseDownX.current = null;
    start();
  };

  /** spacing/translation */
  const sideW = baseW * sideScale;
  const centerToSide = baseW / 2 + gap + sideW / 2;

  return (
    <section className="relative isolate mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 text-white overflow-x-hidden">
      {/* HEADER */}
      <div className="relative mb-2 sm:mb-4 flex items-center">
        <h2 className="recoleta my-9 sm:my-14 text-[22px] sm:text-3xl lg:text-4xl font-bold">
          Watch Shorts
        </h2>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ===== STRONGER, LARGER GLOW (desktop + mobile) ===== */}
      {/* Desktop: big pill + inner spot, stronger opacity & blur */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        {/* big pill */}
        <div
          className="
            absolute left-1/2 -translate-x-1/2
            top-[210px]
            h-60 w-[min(1180px,92%)]
            rounded-[260px]
          "
          style={{
            background:
              "radial-gradient(65% 130% at 50% 50%, rgba(100,50,160,0.55) 0%, rgba(100,50,160,0.22) 42%, rgba(0,0,0,0) 70%)",
            filter: "blur(8px)",
          }}
        />
        {/* inner spot */}
        <div
          className="
            absolute left-1/2 -translate-x-1/2
            top-[250px]
            h-[140px] w-[48%]
            rounded-[200px]
          "
          style={{
            background:
              "radial-gradient(60% 90% at 50% 50%, rgba(100,50,160,0.50) 0%, rgba(100,50,160,0.12) 55%, rgba(0,0,0,0) 78%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Mobile/tablet: slightly narrower pill */}
      <div className="pointer-events-none absolute inset-0 -z-10 lg:hidden">
        <div
          className="
            absolute left-1/2 -translate-x-1/2
            top-[170px]
            h-[220px] w-[96%] sm:w-[90%]
            rounded-[180px]
          "
          style={{
            background:
              "radial-gradient(60% 110% at 50% 50%, rgba(124,58,237,0.38) 0%, rgba(124,58,237,0.16) 42%, rgba(0,0,0,0) 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
      {/* ===== /GLOW ===== */}

      {/* CAROUSEL (measured rail to size cards) */}
      <div
        ref={railRef}
        className="relative mx-auto select-none overflow-hidden"
        style={{ height: baseH + 28 }}
        onMouseEnter={stop}
        onMouseLeave={onMouseLeave}
        onFocusCapture={stop}
        onBlurCapture={start}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <div
          className="relative mx-auto flex h-full items-center justify-center"
          aria-roledescription="carousel"
          style={{ width: "100%" }}
        >
          {ITEMS.map((item, idx) => {
            let d = idx - i;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;

            const isCenter = d === 0;
            const x = d * centerToSide;
            const scale = isCenter ? 1 : sideScale;
            const opacity = isCenter ? 1 : 0.45;
            const blur = isCenter ? 0 : 0.4;

            return (
              <figure
                key={item.src}
                className="absolute will-change-transform"
                style={{
                  transform: `translateX(${x}px) scale(${scale})`,
                  transition:
                    "transform .55s cubic-bezier(.22,.61,.36,1), opacity .45s ease, filter .45s ease",
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: 100 - Math.abs(d),
                  width: baseW,
                  height: baseH,
                }}
                aria-hidden={!isCenter}
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/12 shadow-[0_24px_60px_rgba(0,0,0,.55)]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 85vw, (max-width:1024px) 520px, 360px"
                    priority={isCenter}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                  {isCenter && (
                    <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex justify-center">
                      <a
                        href="#"
                        className="rounded-full border border-[#FFD928] px-4 py-1.5 text-[14px] font-bold text-[#FFD928] shadow-[0_8px_18px_rgba(0,0,0,.35)] hover:brightness-105"
                      >
                        <span className="elza inline lg:hidden">Watch</span>
                        <span className="elza hidden lg:inline">Watch Full Episode</span>
                      </a>
                    </div>
                  )}
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      {/* DOTS */}
      <div className="mt-7 flex items-center justify-center gap-2">
        {ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 w-2 rounded-full transition ${
              i === idx ? "bg-white" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* DIVIDER GLOW */}
      <div className="mx-auto mt-10 w-full max-w-[520px] px-6 lg:px-0">
        <div className="h-0.5 rounded-full bg-linear-to-r from-transparent via-[#00D8FF]/80 to-transparent" />
      </div>
    </section>
  );
}
