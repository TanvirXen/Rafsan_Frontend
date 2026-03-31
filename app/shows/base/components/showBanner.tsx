/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PipeText } from "@/app/components/PipeText";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiPlay } from "react-icons/fi";

type ShowBannerProps = {
  show?: {
    title: string;
    description?: string;
    heroImage?: string;
    thumbnail?: string;
    slug?: string;
  };
};

export default function ShowBanner({ show }: ShowBannerProps) {
  const title = show?.title || "What a Show!";
  const description = (show?.description || "Adda. Game. Entertainment").trim();
  const heroSrc = show?.heroImage || show?.thumbnail || "/assets/showBanner.jpg";

  const showKey = show?.slug || title;
  const filterHref = `/allEvents?show=${encodeURIComponent(showKey)}`;

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
      {/* ================= MOBILE (separate image + text) ================= */}
      <div className="md:hidden">
        {/* Image block */}
        <div className="relative isolate w-full overflow-hidden bg-black aspect-video">
          <Image
            src={heroSrc}
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) calc(100vw - 1px), calc(100vw - 15px)"
          />

          {/* keep your overlays but only on the image area */}
          {/* Hero-style overlays (desktop only) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,27,89,0)_0%,#121212_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,.12)_45%,rgba(0,0,0,0)_70%)]" />
        </div>

        {/* Text block */}
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 pb-4 pt-4">
          <div
            className="
              rounded-2xl bg-black/55 backdrop-blur-[4px]
              ring-1 ring-white/10
              px-4 py-4
            "
          >
            <h1 className="recoleta font-bold text-[24px] leading-[28px] drop-shadow-[0_2px_10px_rgba(0,0,0,.75)]">
<PipeText text={title} pipeClassName="recoleta" />
            </h1>

            <div className="mt-2">
              <p
                className="text-[13px] leading-[19px] text-white/92"
                style={expanded ? undefined : clampStyle(4)}
              >
<PipeText text={description} pipeClassName="recoleta" />
              </p>

              {/* ✅ keep your existing “expanded” spacer behavior */}
              {expanded && isLong && (
                <div className="mt-2 max-h-[120px] overflow-auto pr-1 text-[13px] leading-[19px] text-white/92">
                  {/* This invisible divider forces a scroll area for long text */}
                </div>
              )}

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
                <Link
                  href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
                  className="
                    elza inline-flex h-9 items-center justify-center gap-2 rounded-full
                    border border-white/80 px-4 text-[14px] font-bold text-white
                    bg-black/20 backdrop-blur-[2px]
                    whitespace-nowrap hover:bg-white/10 active:scale-[0.99]
                  "
                >
                  <span className="grid h-4 w-4 place-items-center rounded-full border border-white/80">
                    <FiPlay className="h-3 w-3" />
                  </span>
                  PLAY ALL
                </Link>

                <Link
                  href={filterHref}
                  className="
                    elza inline-flex h-9 items-center justify-center rounded-full
                    bg-[#00D8FF] px-4 text-[14px] font-bold text-black
                    whitespace-nowrap hover:brightness-95 active:scale-[0.99]
                  "
                >
                  GET TICKETS
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* hairline */}
        <div className="pointer-events-none h-px w-full bg-black/10" />
      </div>

      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div
        className="
          relative isolate hidden md:block w-full overflow-hidden text-white bg-black
          aspect-video
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

        {/* Content */}
        <div className="absolute inset-0 flex">
          <div className="mx-auto h-full w-full max-w-6xl px-5 sm:px-6 lg:px-0 flex flex-col justify-end pb-4 md:justify-center md:pb-0">
            <div className="hidden md:flex flex-col items-start max-w-[720px]">
              <h1 className="mb-4 font-bold recoleta text-[40px] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,.75)]">

<PipeText text={title} pipeClassName="recoleta" />
              </h1>

              <p
                className="elza mb-5 text-[16px] leading-6 text-white/88"
                style={clampStyle(4)}
                title={description}
              >
<PipeText text={description} pipeClassName="recoleta" />
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
                  Play All
                </Link>

                <Link
                  href={filterHref}
                  className="
                    elza rounded-full bg-[#00D8FF]
                    px-6 py-3 text-[16px] font-bold text-black hover:brightness-95
                  "
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* hairline */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
      </div>
    </section>
  );
}
