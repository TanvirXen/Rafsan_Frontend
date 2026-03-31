"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useEffectEvent, useState } from "react";
import type { PortfolioNotableEvent } from "@/app/lib/portfolioNotableEvents";

type PortfolioTone = "yellow" | "cyan";

type Props = {
  label: string;
  tone: PortfolioTone;
  events: PortfolioNotableEvent[];
  compact?: boolean;
};

const AUTO_SLIDE_MS = 4800;

function truncateText(text: string, limit: number) {
  const value = text.trim();
  if (value.length <= limit) return value;

  const trimmed = value.slice(0, limit);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${(lastSpace > 48 ? trimmed.slice(0, lastSpace) : trimmed).trim()}...`;
}

function getWrappedIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export default function PortfolioEventShowcase({
  label,
  tone,
  events,
  compact = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advanceSlide = useEffectEvent(() => {
    setActiveIndex((current) => getWrappedIndex(current + 1, events.length));
  });

  useEffect(() => {
    if (events.length < 2 || isPaused) return;

    const timer = window.setInterval(() => {
      advanceSlide();
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [events.length, isPaused]);

  if (!events.length) {
    return null;
  }

  const visibleIndex = events[activeIndex] ? activeIndex : 0;
  const activeEvent = events[visibleIndex] ?? events[0];
  const accent = tone === "yellow" ? "#FFD928" : "#00D8FF";
  const frameClass =
    tone === "yellow"
      ? "border border-[#FFD928]/65 bg-[#1B1505]"
      : "border border-[#00D8FF]/55 bg-[#05151B]";
  const badgeClass =
    tone === "yellow"
      ? "border border-[#FFD928]/35 bg-[#FFD928]/10 text-[#FFD928]"
      : "border border-[#00D8FF]/35 bg-[#00D8FF]/10 text-[#00D8FF]";
  const description = truncateText(activeEvent.description, compact ? 96 : 170);

  return (
    <div
      className={[
        "relative isolate overflow-hidden",
        compact
          ? "min-h-[15.5rem]"
          : "min-h-[20rem] rounded-[28px] md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[33rem]",
        frameClass,
      ].join(" ")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeEvent.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Image
            src={activeEvent.image}
            alt={activeEvent.alt}
            fill
            className="object-cover"
            sizes={
              compact
                ? "(max-width: 768px) calc(100vw - 2rem), 420px"
                : "(max-width: 1279px) calc(100vw - 2rem), 820px"
            }
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.04)_0%,rgba(8,8,8,0.28)_36%,rgba(8,8,8,0.92)_100%)]" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at top, ${accent}2e 0%, transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/18" />

      <div
        className={[
          "relative flex h-full flex-col justify-between",
          compact ? "gap-5 p-4" : "gap-8 p-7 lg:p-10",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "elza inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]",
                badgeClass,
              ].join(" ")}
            >
              {label}
            </span>
          </div>

          <span className="elza rounded-full border border-white/12 bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
            {visibleIndex + 1}/{events.length}
          </span>
        </div>

        <div className={compact ? "max-w-[13rem]" : "max-w-[32rem]"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeEvent.id}-content`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <p className="elza text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 lg:text-[13px]">
                {activeEvent.dateLabel}
              </p>
              <h3
                className={[
                  "recoleta mt-2 font-bold leading-[1.02] text-white",
                  compact ? "text-[20px]" : "text-[30px] lg:text-[42px]",
                ].join(" ")}
              >
                {activeEvent.title}
              </h3>
              <p
                className={[
                  "elza mt-3 text-white/84",
                  compact ? "text-[11px] leading-4" : "max-w-[26rem] text-[15px] leading-7 lg:text-[16px]",
                ].join(" ")}
              >
                {description}
              </p>
            </motion.div>
          </AnimatePresence>

          {events.length > 1 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2">
                {events.map((event, index) => {
                  const isActive = index === visibleIndex;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={[
                        "h-2 rounded-full transition-all",
                        isActive ? "w-7 bg-white" : "w-2 bg-white/45 hover:bg-white/65",
                      ].join(" ")}
                      aria-label={`Show ${event.title}`}
                      aria-pressed={isActive}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
