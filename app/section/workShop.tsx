"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Workshop = {
  src: string;
  alt: string;
  title: string;
  date: string;
  href?: string;
};

const WORKSHOPS: Workshop[] = [
  {
    src: "/assets/show.jpg",
    alt: "Talk on stage",
    title: "Leadership Training",
    date: "September 20, 2025",
    href: "/workshops/leadership-training",
  },
  {
    src: "/assets/works1.jpg",
    alt: "Office session",
    title: "Team Collaboration Workshop",
    date: "October 10, 2025",
    href: "/workshops/team-collaboration",
  },
  {
    src: "/assets/works2.jpg",
    alt: "Studio floor",
    title: "Creative Thinking Session",
    date: "November 15, 2025",
    href: "/workshops/creative-thinking",
  },
];

/* ---------- responsive sizes ---------- */
type Dims = {
  CW: number;
  CH: number;
  SW: number;
  SH: number;
  GAP: number;
  CONTAINER_H: number;
  hideSides: boolean;
};

function getDims(w: number): Dims {
  if (w >= 1024)
    return {
      CW: 400,
      CH: 500,
      SW: 330,
      SH: 412,
      GAP: 20,
      CONTAINER_H: 500,
      hideSides: false,
    };
  if (w >= 640)
    return {
      CW: 360,
      CH: 450,
      SW: 300,
      SH: 375,
      GAP: 18,
      CONTAINER_H: 450,
      hideSides: false,
    };
  const CW = 300,
    CH = 375;
  return { CW, CH, SW: CW, SH: CH, GAP: 16, CONTAINER_H: CH, hideSides: true };
}

export default function WorkshopsSection() {
  const n = WORKSHOPS.length;
  const [i, setI] = useState(1);
  const wrap = (x: number) => ((x % n) + n) % n;

  const [dims, setDims] = useState<Dims>(() =>
    typeof window === "undefined" ? getDims(1440) : getDims(window.innerWidth)
  );
  useEffect(() => {
    const onResize = () => setDims(getDims(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------- autoplay ---------- */
  const tRef = useRef<number | null>(null);
  const start = () => {
    stop();
    tRef.current = window.setInterval(() => setI((v) => wrap(v + 1)), 3200);
  };
  const stop = () => {
    if (tRef.current) window.clearInterval(tRef.current);
    tRef.current = null;
  };
  useEffect(() => {
    start();
    return stop;
  }, []); // eslint-disable-line

  /* ---------- drag / swipe ---------- */
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
      setI((v) => wrap(v + (diff < 0 ? 1 : -1)));
      dragging.current = false;
      dragStartX.current = null;
    }
  };
  const handleEnd = () => {
    dragging.current = false;
    dragStartX.current = null;
    start();
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
  const DEPTH = 100,
    SWIVEL = 16,
    SCALE_DROP = 0.08;
  const centerToSide = CW / 2 + GAP + SW / 2;

  return (
    <section className='relative'>
      <div className='pointer-events-none absolute left-0 right-0 top-20 h-[660px] -z-10 hidden sm:block'>
        <div className='mx-auto h-full max-w-[1600px]'>
          <div className='h-full bg-[radial-gradient(60%_70%_at_50%_40%,rgba(76,25,122,0.45),rgba(0,0,0,0)_70%)]' />
        </div>
      </div>

      <div
        className='
          mx-auto sm:mx-0
          w-full max-w-[440px] sm:max-w-none
          bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0)_27.4%,#121212_100%),#2D1B59]
          rounded-[28px] sm:bg-transparent sm:rounded-none
          px-10 py-[30px] sm:px-0 sm:py-0 gap-[15px]
        '
        style={{ isolation: "isolate" }}
      >
        <h2 className=' recoleta font-bold text-center text-white text-[24px] leading-[24px] sm:text-[40px] sm:leading-[48px]'>
          Workshops
        </h2>
        <p className='elza pb-4 text-center text-[#00D8FF] text-[12px] leading-4 sm:text-[16px] sm:leading-6 sm:mt-2'>
          Grab the chances to join my upcoming workshops!
        </p>

        <div
          className='
            relative mx-auto
            w-full max-w-[360px] sm:max-w-[1100px]
            flex items-center justify-center
            perspective-[1400px] [transform-style:preserve-3d]
            overflow-hidden sm:overflow-visible select-none
          '
          style={{ height: CONTAINER_H }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-roledescription='carousel'
        >
          {WORKSHOPS.map((w, idx) => {
            let d = idx - i;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;

            const isCenter = d === 0;
            const isSide = Math.abs(d) === 1;
            if (hideSides && !isCenter) return null;

            const x = d * centerToSide;
            const z = -Math.abs(d) * DEPTH;
            const ry = d * -SWIVEL;
            const sc = 1 - Math.min(Math.abs(d) * SCALE_DROP, 0.24);

            const wpx = isCenter ? CW : SW;
            const hpx = isCenter ? CH : SH;

            return (
              <article
                key={w.src + idx}
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
                  pointerEvents: isCenter || isSide ? "auto" : "none",
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
                  {!isCenter && !hideSides && (
                    <div className='absolute inset-0 bg-black/45' />
                  )}
                  {isCenter && (
                    <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,.55)_55%,rgba(0,0,0,.85)_100%)]' />
                  )}

                  {isCenter && (
                    <div className='absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:p-4'>
                      <div className='leading-none'>
                        <p className='text-[14px] sm:text-[16px] font-bold text-white recoleta'>
                          {w.title}
                        </p>
                        <p className='mt-1 text-[12px] sm:text-[16px] font-normal text-white/85 elza'>
                          {w.date}
                        </p>
                      </div>
                      <Link
                        href={w.href ?? "#"}
                        className='elza rounded-full bg-[#FFD928] text-black font-extrabold
                          h-[28px] w-[88px] text-[12px] leading-[16px]
                          sm:h-[36px] sm:w-[112px] sm:text-[16px]
                          grid place-items-center shadow-[0_10px_26px_rgba(0,0,0,.35)]
                          hover:brightness-105'
                      >
                        Join Now
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className='mt-4 sm:mt-5 flex justify-center gap-2'>
          {dots.map((d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              className={[
                "h-2 w-2 rounded-full transition",
                d === i ? "bg-white" : "bg-white/40 hover:bg-white/70",
              ].join(" ")}
            />
          ))}
        </div>

        <div className='mt-3 sm:mt-6 flex justify-center'>
          <Link
            href='/workshops'
            className='elza inline-flex items-center justify-center
              h-[48px] w-[159px] rounded-full
              border border-[#00D8FF] px-6 text-[16px] font-normal text-white
              shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] hover:bg-white/10'
          >
            Explore more!
          </Link>
        </div>
      </div>
    </section>
  );
}
