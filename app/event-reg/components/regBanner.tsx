"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  title?: string;
  dates?: string[];
  blurb?: string;
  posterSrc?: string;      // foreground card image
  bgSrc?: string;          // NEW: distinct background image
  ctaHref?: string;
};

export default function RegBanner({
  title = "What A Show",
  dates = ["September 20", "September 27"],
  blurb = "Grab the chances to watch my upcoming shows!",
  posterSrc = "/assets/reg.png",   // card image default
  bgSrc,                           // NEW
  ctaHref,
}: Props) {
  return (
    <section
      className="
        relative isolate overflow-hidden
        py-8 sm:py-10 md:py-14
        bg-[#121212]
      "
    >
      {/* === BG image + overlays (match Figma) === */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgSrc || posterSrc}   // ✅ use bgSrc if provided; fallback to poster
          alt="Registration background"
          fill
          priority
          sizes="(max-width: 768px) calc(100vw - 1px), calc(100vw - 15px)"
          className="
            object-cover
            sm:object-cover
            md:object-cover
          "
          style={{ objectPosition: "50% 42%" }}
        />
        {/* Top-to-bottom fade to #121212 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,18,18,0) 0%, #121212 100%)",
          }}
        />
        {/* Global dark veil (0deg per Figma) */}
        <div
          className="absolute inset-0 "
          style={{
            background:
              "linear-gradient(0deg, rgba(18,18,18,0.6), rgba(18,18,18,0.6))",
          }}
        />
      </div>

      {/* === Left: image card === */}
      <div className="site-shell mx-auto grid w-full max-w-[1100px] items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,.45)] ring-1 ring-white/10">
          <Image
            src={posterSrc}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 768px) calc(100vw - 2rem), 520px"
            className="object-cover"
          />
        </div>

        {/* === Right: content block === */}
        <div className="flex flex-col gap-3 md:gap-6">
          <h2 className="recoleta w-full text-[28px] leading-tight text-white md:text-[40px]">
            {title}
          </h2>

        {/* Two separate pills: date + S/E */}
          <div className="flex flex-wrap items-center gap-3">
            {dates.map((d, i) => (
              <span
                key={`${d}-${i}`}
                className={`
                  elza inline-flex min-h-9 items-center justify-center rounded-md px-3 text-sm
                  ${i === 0 ? "bg-[#D9D9D9]" : "bg-[rgba(217,217,217,0.5)]"}
                  text-black
                `}
              >
                {d}
              </span>
            ))}
          </div>

          <p className="elza max-w-[34rem] text-[14px] leading-6 text-white md:text-[16px]">
            {blurb}
          </p>

          {ctaHref && (
            <div className="pt-1">
              <Link
                href={ctaHref}
                className="elza inline-flex h-11 items-center rounded-[999px] bg-[#D9D9D9] px-5 text-sm font-semibold text-black transition hover:brightness-95"
              >
                Get Tickets
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px border-b border-black/10" />
    </section>
  );
}
