"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";

type Ep = { id: string; season: string; ep: string; img: string; href: string };

const EPS: Ep[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  season: "Season 2",
  ep: "E02",
  img: "/assets/exp1.jpg",
  href: `/episodes/${i + 1}`,
}));

export default function Season3() {
  /* NEW: show all toggle */
  const [showAll, setShowAll] = useState(false);

  /* cards per view */
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* rail width in px for exact paging */
  const railRef = useRef<HTMLDivElement | null>(null);
  const [railW, setRailW] = useState(0);

  /* ✅ FIX: re-measure when carousel (showAll === false) is visible */
  useEffect(() => {
    if (showAll) return; // grid view: no need to observe
    const el = railRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w !== railW) setRailW(w);
    };
    measure(); // initial

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // include showAll so it re-attaches when toggling back to carousel
  }, [showAll]); // eslint-disable-line react-hooks/exhaustive-deps

  /* pages + fillers */
  const pages = useMemo(() => Math.max(1, Math.ceil(EPS.length / perView)), [perView]);
  const totalSlots = pages * perView;
  const fillerCount = Math.max(0, totalSlots - EPS.length);

  const [index, setIndex] = useState(0);
  const maxIndex = pages - 1;
  useEffect(() => {
    setIndex((i) => (i > maxIndex ? maxIndex : i));
  }, [maxIndex]);

  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  /* autoplay with pause */
  const timerRef = useRef<number | null>(null);
  const start = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (!showAll) {
      timerRef.current = window.setInterval(next, 3500);
    }
  };
  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, railW, showAll]);

  /* touch swipe */
  const touchX = useRef<number | null>(null);
  const onTouchStart: React.TouchEventHandler = (e) => {
    stop();
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    const sx = touchX.current;
    touchX.current = null;
    if (sx == null) return start();
    const dx = e.changedTouches[0].clientX - sx;
    const THRESH = Math.max(40, railW * 0.12);
    if (dx > THRESH) prev();
    else if (dx < -THRESH) next();
    start();
  };

  /* mouse hold & drag (desktop) */
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
    const THRESH = Math.max(40, railW * 0.12);
    if (dx > THRESH) {
      prev();
      mouseDownX.current = e.clientX;
    } else if (dx < -THRESH) {
      next();
      mouseDownX.current = e.clientX;
    }
  };
  const endDrag = () => {
    dragging.current = false;
    mouseDownX.current = null;
    start();
  };
  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = endDrag;
  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = endDrag;

  /* geometry in px */
  const GAP = 24;
  const itemW = perView === 1 ? railW : (railW - GAP * (perView - 1)) / perView;
  const trackW = pages * railW;
  const translateX = -index * railW;

  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 pt-10 pb-6 text-white overflow-x-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="recoleta text-[22px] sm:text-[26px] lg:text-[28px] font-extrabold">Season 2</h2>

        {/* toggle */}
        <button
          onClick={() => {
            setShowAll((v) => !v);
            setIndex(0);
            stop();
          }}
          className="elza rounded-md bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/15 hover:bg-white/20"
          aria-label={showAll ? "See less" : "See all"}
        >
          {showAll ? "See Less" : "See All"}
        </button>
      </div>

      {/* background glow (unchanged) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="
            absolute left-1/2 -translate-x-1/2
            top-[155px] sm:top-[150px] md:top-[140px]
            h-[160px] w-[95%] sm:w-[88%] md:w-[82%]
            rounded-[220px] blur-[6px]
          "
          style={{
            background:
              "radial-gradient(60% 120% at 50% 50%, rgba(86,42,125,0.42) 0%, rgba(86,42,125,0.18) 40%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          className="
            absolute left-1/2 -translate-x-1/2
            top-[185px] sm:top-[178px] md:top-[170px]
            h-[110px] w-[58%] sm:w-[46%] md:w-[40%]
            rounded-[160px]
          "
          style={{
            background:
              "radial-gradient(60% 90% at 50% 50%, rgba(86,42,125,0.35) 0%, rgba(86,42,125,0.08) 55%, rgba(0,0,0,0) 75%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* content */}
      {showAll ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {EPS.map((e) => (
            <Card key={e.id} ep={e} style={{ width: "100%" }} />
          ))}
        </div>
      ) : (
        <>
          <div
            ref={railRef}
            className="overflow-hidden"
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
              className="flex will-change-transform transition-transform duration-500"
              style={{
                gap: GAP,
                width: trackW || "100%",
                transform: `translateX(${translateX}px)`,
              }}
            >
              {EPS.map((e) => (
                <Card key={e.id} ep={e} style={{ width: itemW }} />
              ))}
              {Array.from({ length: fillerCount }).map((_, k) => (
                <div key={`filler-${k}`} style={{ width: itemW }} aria-hidden />
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  index === i ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="mx-auto mt-10 w-full max-w-[520px] px-6 lg:px-0">
        <div className="h-0.5 rounded-full bg-linear-to-r from-transparent via-[#00D8FF]/80 to-transparent" />
      </div>
    </section>
  );
}

function Card({ ep, style }: { ep: Ep; style: React.CSSProperties }) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_10px_25px_rgba(0,0,0,.45)] h-[180px] md:h-[193px]"
      style={style}
    >
      <Image
        src={ep.img}
        alt={`${ep.season} ${ep.ep}`}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) calc(100vw - 2rem), 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
        <div className="leading-[1.05] [&>p]:m-0 [&>p+ p]:mt-0.5">
          <p className="recoleta text-[12px] sm:text-[12.5px] font-semibold">{ep.season}</p>
          <p className="elza text-[11px] text-white/85">{ep.ep}</p>
        </div>
        <Link
          href={ep.href}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 hover:bg-white/25"
        >
          <FiPlay className="h-4 w-4 text-white" />
        </Link>
      </div>
    </article>
  );
}
