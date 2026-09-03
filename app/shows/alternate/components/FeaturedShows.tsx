"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import { resolveMediaUrl } from "@/app/lib/mediaUrl";

type ShowCard = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  href: string;
};

type Episode = {
  _id: string;
  title: string;
  thumbnail?: string;
  link?: string;
  featured?: boolean;
};

const STATIC_SHOWS: ShowCard[] = [
  { id: "1", title: "Title", subtitle: "Episode", img: "/assets/exp2.png", href: "/shows/1" },
  { id: "2", title: "Title", subtitle: "Episode", img: "/assets/exp2.png", href: "/shows/2" },
  { id: "3", title: "Title", subtitle: "Episode", img: "/assets/exp2.png", href: "/shows/3" },
];

type Props = {
  episodes?: Episode[];
  reels?: {
    _id: string;
    title: string;
    thumbnail?: string;
    link?: string;
  }[];
  /** slug of the show, used to open the in-site player */
  showSlug?: string;
};

export default function FeaturedShows({ episodes, reels = [], showSlug }: Props) {
  const cards: ShowCard[] = useMemo(() => {
    const featuredEpisodes = episodes?.filter((ep) => ep.featured) ?? [];
    const episodeSource = featuredEpisodes.length
      ? featuredEpisodes
      : episodes?.length
        ? episodes
        : [];

    const episodeCards = episodeSource.slice(0, 6).map((ep) => ({
      id: ep._id,
      title: ep.title,
      subtitle: "Episode",
      img: resolveMediaUrl(ep.thumbnail, "/assets/exp2.jpg"),
      href:
        ep.link && showSlug
          ? `/shows/${encodeURIComponent(showSlug)}?ep=${encodeURIComponent(ep._id)}`
          : "#",
    }));

    if (episodeCards.length) return episodeCards;

    const reelCards = reels.slice(0, 6).map((reel) => ({
      id: reel._id,
      title: reel.title,
      subtitle: "Vlog",
      img: resolveMediaUrl(reel.thumbnail, "/assets/exp2.jpg"),
      href: reel.link
        ? reel.link.startsWith("http")
          ? reel.link
          : showSlug
            ? `/shows/${encodeURIComponent(showSlug)}`
            : "#"
        : "#",
    }));

    return reelCards.length ? reelCards : STATIC_SHOWS;
  }, [episodes, reels, showSlug]);

  const railRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, cards.length - 1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const stop = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const scrollToIndex = (nextIndex: number) => {
    const el = railRef.current;
    if (!el || !cards.length) return;
    const target = Math.max(0, Math.min(nextIndex, cards.length - 1));
    const card = el.querySelector<HTMLElement>("[data-featured-card]");
    if (!card) return;
    const gap = 20;
    const step = card.getBoundingClientRect().width + gap;
    el.scrollTo({ left: target * step, behavior: "smooth" });
    setIndex(target);
  };

  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-featured-card]");
    if (!card) return;
    const gap = 20;
    const step = card.getBoundingClientRect().width + gap;
    if (!step) return;
    const next = Math.round(el.scrollLeft / step);
    setIndex(Math.max(0, Math.min(next, maxIndex)));
  };

  const timerRef = useRef<number | null>(null);

  const start = () => {
    stop();
    if (cards.length > 1 && isMobile) {
      timerRef.current = window.setInterval(() => {
        setIndex((i) => (i >= maxIndex ? 0 : i + 1));
      }, 2600);
    }
  };

  useEffect(() => {
    if (isMobile) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, maxIndex, cards.length]);

  if (!cards.length) return null;

  return (
    <>
      <section
        className="relative mx-auto max-w-6xl px-6 text-white lg:px-0"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {/* header */}
        <div className="mb-3 mt-[60px] flex items-center justify-between">
          <h2 className="recoleta font-bold text-2xl sm:text-[28px]">Featured Episodes</h2>

          <div className="flex gap-2">
          <button
            aria-label="Previous"
            onClick={() => scrollToIndex(index - 1)}
            className="rounded-md bg-white/10 p-1 ring-1 ring-white/10 hover:bg-white/20 transition"
          >
            <FiChevronLeft className="h-4 w-4 text-white/70" />
          </button>

          <button
            aria-label="Next"
            onClick={() => scrollToIndex(index + 1)}
            className="rounded-md bg-white/10 p-1 ring-1 ring-white/10 hover:bg-white/20 transition"
          >
            <FiChevronRight className="h-4 w-4 text-white/70" />
          </button>
          </div>
        </div>

        {/* carousel */}
        <div
          ref={railRef}
          onScroll={onScroll}
          className="
            overflow-x-auto overflow-y-hidden select-none cursor-grab active:cursor-grabbing touch-pan-x
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          <div className="flex gap-5 pr-1">
            {cards.map((s) => (
              <div
                key={s.id}
                data-featured-card
                className="shrink-0 basis-[84%] sm:basis-[58%] lg:basis-[31%]"
              >
                <FeaturedCard show={s} />
              </div>
            ))}
          </div>
        </div>

        {/* dots (mobile) */}
        {isMobile && cards.length > 1 && (
          <div className="mt-3 flex flex-col items-center">
            <div className="flex justify-center gap-2">
              {cards.map((_, d) => (
                <button
                  key={d}
                  onClick={() => scrollToIndex(d)}
                  aria-label={`Go to slide ${d + 1}`}
                  className={[
                    "h-2 w-2 rounded-full transition",
                    d === index ? "bg-white" : "bg-white/40",
                  ].join(" ")}
                />
              ))}
            </div>
            <div className="mt-2 w-[180px]">
              <div className="h-0.5 rounded-full bg-[linear-gradient(90deg,rgba(0,0,0,0),#00D8FF,rgba(0,0,0,0))]" />
            </div>
          </div>
        )}
      </section>

      {/* progress bar (desktop) */}
      {!isMobile && (
        <div className="mx-auto mt-10 w-full max-w-[1020px] px-6 lg:px-0 flex justify-center">
          <div
            className="h-0.5 rounded-full bg-linear-to-r from-transparent via-[#00D8FF]/80 to-transparent"
            style={{ width: `${Math.max(12, ((index + 1) / cards.length) * 100)}%` }}
          />
        </div>
      )}
    </>
  );
}

function FeaturedCard({ show }: { show: ShowCard }) {
  const isDisabled = !show.href || show.href === "#";
  const isExternal = show.href.startsWith("http");

  const inner = (
    <article
      className="
        group relative h-[200px] sm:h-[299px] overflow-hidden rounded-2xl
        ring-1 ring-white/10
        shadow-[0_10px_25px_rgba(0,0,0,.45)]
        bg-black/20
      "
    >
        <Image
          src={show.img}
          alt={show.title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width:768px) 88vw, 560px"
        />

      {/* Softer overlays (your banner vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08)_0%,rgba(0,0,0,.18)_45%,rgba(0,0,0,.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.34)_0%,rgba(0,0,0,.12)_58%,rgba(0,0,0,0)_100%)]" />

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        {/* safe zone for play button */}
        <div className="relative pr-[56px]">
          <p className="elza text-[13px] sm:text-[13px] leading-[1.1] drop-shadow-sm truncate">
            {show.title}
          </p>
          <p className="elza mt-1 text-[12px] sm:text-[13px] text-white/80 leading-[1.15]">
          </p>
        </div>

        {/* play (pinned) */}
        <div className="absolute bottom-4 right-4">
          {isDisabled ? (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/25 text-[10px] text-white/60">
              N/A
            </span>
          ) : (
            <div
              className="
                grid h-10 w-10 place-items-center rounded-full
                bg-white/18 ring-1 ring-white/40 backdrop-blur-[4px]
                shadow-[0_6px_16px_rgba(0,0,0,.55)]
                transition group-hover:bg-white/25
              "
              aria-hidden
            >
              <FiPlay className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Optional “Watch Now” pill on desktop hover (nice touch) */}
      {!isDisabled && (
        <div className="hidden sm:block absolute top-4 right-4">
          <div
            className="
              opacity-0 translate-y-1
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300
              elza rounded-full bg-[#00D8FF] px-3 py-1.5 text-[13px] font-extrabold text-[#121212]
              shadow-[0_10px_24px_rgba(0,216,255,.25)]
            "
          >
            Watch
          </div>
        </div>
      )}
    </article>
  );

  if (isDisabled) return inner;

  return isExternal ? (
    <a href={show.href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    <Link href={show.href} className="block">
      {inner}
    </Link>
  );
}
