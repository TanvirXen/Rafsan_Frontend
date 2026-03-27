/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiPlay, FiYoutube } from "react-icons/fi";

type PodcastBannerProps = {
  show?: {
    title: string;
    description?: string;
    heroImage?: string;
    thumbnail?: string;
  };
};

export default function PodcastBanner({ show }: PodcastBannerProps) {
  const title = show?.title ?? "Next Level Podcast";
  const description = (show?.description ?? "Adda, Game, Entertainment").trim();
  const heroSrc =
    show?.heroImage || show?.thumbnail || "/assets/podcastBanner.png";

  const [expanded, setExpanded] = React.useState(false);
  const isLong = description.length > 120;

  const clampStyle = (lines: number): React.CSSProperties => ({
    display: "-webkit-box",
    WebkitLineClamp: lines as any,
    WebkitBoxOrient: "vertical" as any,
    overflow: "hidden",
  });

  return (
    <section className="w-full bg-black text-white">
      {/* ================= MOBILE (image + content separate) ================= */}
      <div className="md:hidden">
        {/* Image block */}
        <div className="relative w-full aspect-video min-h-[240px] overflow-hidden">
          <Image
            src={heroSrc}
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) calc(100vw - 1px), calc(100vw - 15px)"
          />

          {/* small bottom fade only (doesn't block the whole image) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(18,18,18,0.92)_100%)]" />
        </div>

        {/* Content block (separate, no overlay) */}
        <div className="mx-auto w-full max-w-6xl px-5 pb-5 pt-4">
          <div className="rounded-2xl bg-[#121212] ring-1 ring-white/10 px-4 py-4">
            <h1 className="recoleta font-bold text-[24px] leading-[28px]">
              {title}
            </h1>

            <p
              className="mt-2 text-[13px] leading-[19px] text-white/90"
              style={expanded ? undefined : clampStyle(4)}
            >
              {description}
            </p>

            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="
                  mt-2 inline-flex items-center gap-1
                  elza text-[13px] font-bold text-[#00D8FF]
                  underline underline-offset-4
                  active:scale-[0.99]
                "
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* Watch */}
              <Link
                href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
                className="
                  elza inline-flex h-9 items-center justify-center gap-2 rounded-full
                  border border-white/70 px-4 text-[14px] font-bold text-white
                  bg-white/5
                  whitespace-nowrap hover:bg-white/10 active:scale-[0.99]
                "
              >
                <span className="grid h-4 w-4 place-items-center ">
                  <FiPlay className="h-3 w-3" />
                </span>
                PLAY ALL
              </Link>

              {/* Channel / CTA */}
              <Link
                href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
                className="
                  elza inline-flex h-9 items-center justify-center gap-2 rounded-full
                  bg-[#00D8FF] px-4 text-[14px] font-bold text-[#121212]
                  whitespace-nowrap hover:brightness-95 active:scale-[0.99]
                "
              >
                <FiYoutube className="h-5 w-5 text-[#121212]" />
                GET TICKETS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP (keep your overlay style) ================= */}
      <div
        className="
          relative isolate hidden md:block w-full overflow-hidden text-white
          aspect-video min-h-[300px]
        "
      >
        <Image
          src={heroSrc}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) calc(100vw - 1px), calc(100vw - 15px)"
        />

        {/* Hero-style overlays (desktop only) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,27,89,0)_0%,#121212_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,.12)_45%,rgba(0,0,0,0)_70%)]" />

        <div className="absolute inset-0 flex">
          <div className="mx-auto h-full w-full max-w-6xl px-6 lg:px-0 flex flex-col justify-center">
            <div className="flex flex-col items-start max-w-[720px]">
              <h1 className="mb-4 font-bold recoleta text-[40px] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,.75)]">
                {title}
              </h1>

              <p
                className="elza mb-5 text-[16px] leading-6 text-white/88"
                style={clampStyle(4)}
                title={description}
              >
                {description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
                  className="
                    elza inline-flex items-center justify-center rounded-full
                    border border-white/70 bg-black/20 backdrop-blur-[2px]
                    px-8 py-3 text-[16px] font-bold text-white hover:bg-white/10
                  "
                >
                  Watch Now
                </Link>

                <Link
                  href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
                  className="
                    elza inline-flex items-center justify-center gap-2 rounded-full
                    bg-[#00D8FF] px-8 py-3 text-[16px] font-bold text-[#00131b]
                    hover:brightness-95
                  "
                >
                  <FiYoutube className="h-6 w-6 text-[#121212]" />
                  Channel
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
      </div>
    </section>
  );
}
