/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slideIn } from "@/app/motionPresets";

export type FeaturedEvent = {
  date: string;
  title: string;
  blurb: string;
  img: string;
  alt?: string;
};

const DEFAULT_EVENT: FeaturedEvent = {
  date: "September 12, 2025",
  title: "Summer Music Festival",
  blurb:
    "From a passionate presenter to a professional host, my journey has been filled with excitement and learning. Discover how I reached this stage.",
  img: "/assets/s1.jpg",
  alt: "Stage photo",
};

type Props = {
  events?: FeaturedEvent[];
  /** ✅ pass openModal from parent so every card can open the same modal */
  onReadMore?: (ev: FeaturedEvent) => void;
  /** optional: show read more only after this many chars */
  previewLimit?: number;
};

function needsReadMore(text: string, limit: number) {
  return (text || "").trim().length > limit;
}

function truncateText(text: string, limit: number) {
  const t = (text || "").trim();
  if (t.length <= limit) return t;
  const cut = t.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export default function Section1({
  events = [],
  onReadMore,
  previewLimit = 140,
}: Props) {
  const list = events.length ? events : [DEFAULT_EVENT];

  return (
    <section className="mx-auto max-w-6xl lg:mt-[60px] mt-[30px] space-y-[30px] lg:space-y-[60px]">
      {list.map((event, index) => {
        const [firstWord, ...restWords] = (event.title || "").split(" ");
        const restTitle = restWords.join(" ");
        const isEven = index % 2 === 0;

        // alternate cyan / yellow
        const panelBg = isEven ? "#00D8FF" : "#FFD928";

        // ✅ mobile read more logic
        const long = needsReadMore(event.blurb || "", previewLimit);
        const preview = long ? truncateText(event.blurb || "", previewLimit) : event.blurb;

        return (
          <div key={event.title + index}>
            {/* ----------------------- MOBILE (zig-zag) ----------------------- */}
            <div className="lg:hidden">
              <div className="mx-auto w-full max-w-[28rem]">
                <div className="relative flex h-[244px] overflow-hidden rounded-[16px] shadow-[0_14px_28px_rgba(0,0,0,.35)] ring-1 ring-white/10">
                  {isEven ? (
                    <>
                      {/* ✅ PANEL LEFT (on top + clickable) */}
                      <motion.aside
                        initial={{ opacity: 0, x: -32, y: 12 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 16,
                          mass: 0.6,
                        }}
                        className="relative z-10 pointer-events-auto flex h-[244px] w-[115px] items-center px-4"
                        style={{ backgroundColor: panelBg }}
                      >
                        <div className="flex h-[212px] w-[83px] flex-col items-start justify-center gap-[6px]">
                          <p className="elza w-[83px] text-[10px] leading-3 text-[#0B0F1A]/80">
                            {event.date}
                          </p>

                          <h3 className="recoleta w-[83px] text-[12px] font-extrabold leading-4 text-[#0B0F1A]">
                            {firstWord}
                            {restTitle ? (
                              <>
                                <br />
                                {restTitle}
                              </>
                            ) : null}
                          </h3>

                          <p className="elza w-[83px] text-[10px] leading-3 text-[#0B0F1A]/90">
                            {preview}
                          </p>

                          {long && onReadMore && (
                            <button
                              type="button"
                              onClick={() => onReadMore(event)}
                              className="relative z-20 elza text-[10px] leading-3 font-bold underline underline-offset-2 text-[#0B0F1A] hover:opacity-80"
                              aria-label="Read more"
                            >
                              Read more
                            </button>
                          )}
                        </div>
                      </motion.aside>

                      {/* ✅ IMAGE RIGHT (cannot block clicks) */}
                      <motion.div
                        initial={{ opacity: 0, x: 32, y: 12 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 16,
                          mass: 0.6,
                          delay: 0.05,
                        }}
                        className="relative z-0 pointer-events-none h-[244px] w-[245px]"
                      >
                        <Image
                          src={event.img}
                          alt={event.alt || event.title}
                          fill
                          className="object-cover"
                          sizes="360px"
                          priority={index === 0}
                        />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* ✅ IMAGE LEFT (cannot block clicks) */}
                      <motion.div
                        initial={{ opacity: 0, x: -32, y: 12 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 16,
                          mass: 0.6,
                        }}
                        className="relative z-0 pointer-events-none h-[244px] w-[245px]"
                      >
                        <Image
                          src={event.img}
                          alt={event.alt || event.title}
                          fill
                          className="object-cover"
                          sizes="360px"
                          priority={index === 0}
                        />
                      </motion.div>

                      {/* ✅ PANEL RIGHT (on top + clickable) */}
                      <motion.aside
                        initial={{ opacity: 0, x: 32, y: 12 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 16,
                          mass: 0.6,
                          delay: 0.05,
                        }}
                        className="relative z-10 pointer-events-auto flex h-[244px] w-[115px] items-center px-4"
                        style={{ backgroundColor: panelBg }}
                      >
                        <div className="flex h-[212px] w-[83px] flex-col items-start justify-center gap-[6px]">
                          <p className="elza w-[83px] text-[10px] leading-3 text-[#0B0F1A]/80">
                            {event.date}
                          </p>

                          <h3 className="recoleta w-[83px] text-[12px] font-extrabold leading-4 text-[#0B0F1A]">
                            {firstWord}
                            {restTitle ? (
                              <>
                                <br />
                                {restTitle}
                              </>
                            ) : null}
                          </h3>

                          <p className="elza w-[83px] text-[10px] leading-3 text-[#0B0F1A]/90">
                            {preview}
                          </p>

                          {long && onReadMore && (
                            <button
                              type="button"
                              onClick={() => onReadMore(event)}
                              className="relative z-20 elza text-[10px] leading-3 font-bold underline underline-offset-2 text-[#0B0F1A] hover:opacity-80"
                              aria-label="Read more"
                            >
                              Read more
                            </button>
                          )}
                        </div>
                      </motion.aside>
                    </>
                  )}

                  {/* soft bottom fade */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,.35)_80%,rgba(0,0,0,.55)_100%)]" />
                </div>
              </div>
            </div>

            {/* ----------------------- DESKTOP / LG ----------------------- */}
            <div className="hidden lg:block">
              {isEven ? (
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[380px_minmax(0,1fr)]">
                  {/* panel LEFT */}
                  <motion.aside
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={slideIn("left")}
                    className="relative rounded-[28px] ring-1 ring-black/10 shadow-[0_14px_32px_rgba(0,0,0,.25)] items-center justify-center flex"
                    style={{ backgroundColor: panelBg }}
                  >
                    <div className="px-6 md:px-7 py-7 min-h-[360px] sm:min-h-[420px] grid place-items-center">
                      <div className="max-w-[260px] space-y-3">
                        <p className="elza text-[14px] font-medium leading-none text-[#0B0F1A]/80">
                          {event.date}
                        </p>
                        <h3 className="recoleta text-[24px] leading-[1.15] font-extrabold text-[#0B0F1A]">
                          {event.title}
                        </h3>
                        <p className="elza text-[16px] leading-6 text-[#0B0F1A]/90">
                          {event.blurb}
                        </p>
                      </div>
                    </div>
                  </motion.aside>

                  {/* image RIGHT */}
                  <motion.article
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={slideIn("right")}
                    transition={{ delay: 0.05 }}
                    className="relative min-h-[22rem] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 lg:min-h-[33.75rem]"
                  >
                    <Image
                      src={event.img}
                      alt={event.alt || event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) calc(100vw - 2rem), 740px"
                    />
                  </motion.article>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_380px]">
                  {/* image LEFT */}
                  <motion.article
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={slideIn("left")}
                    className="relative min-h-[22rem] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 lg:min-h-[33.75rem]"
                  >
                    <Image
                      src={event.img}
                      alt={event.alt || event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) calc(100vw - 2rem), 740px"
                    />
                  </motion.article>

                  {/* panel RIGHT */}
                  <motion.aside
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={slideIn("right")}
                    transition={{ delay: 0.05 }}
                    className="relative rounded-[28px] ring-1 ring-black/10 shadow-[0_14px_32px_rgba(0,0,0,.25)] items-center justify-center flex"
                    style={{ backgroundColor: panelBg }}
                  >
                    <div className="px-6 md:px-7 py-7 min-h-[360px] sm:min-h-[420px] grid place-items-center">
                      <div className="max-w-[260px] space-y-3">
                        <p className="elza text-[14px] font-medium leading-none text-[#0B0F1A]/80">
                          {event.date}
                        </p>
                        <h3 className="recoleta text-[24px] leading-[1.15] font-extrabold text-[#0B0F1A]">
                          {event.title}
                        </h3>
                        <p className="elza text-[16px] leading-6 text-[#0B0F1A]/90">
                          {event.blurb}
                        </p>
                      </div>
                    </div>
                  </motion.aside>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
