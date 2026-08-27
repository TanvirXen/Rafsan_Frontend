"use client";

import Image from "next/image";
import { motion, type MotionProps, type Transition } from "framer-motion";

type Card = {
  img: string;
  alt?: string;
  title: string;
  caption: string;
};

type ShotsMosaicProps = {
  left?: Card;
  topRight?: Card;
  bottomRight?: Card;
  reverse?: boolean;
};

const spring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 16,
  mass: 0.6,
};

const zig = (from: "left" | "right", delay = 0): MotionProps => ({
  initial: { opacity: 0, x: from === "left" ? -64 : 64, y: 12 },
  whileInView: { opacity: 1, x: 0, y: 0 },
  transition: { ...spring, delay },
  viewport: { once: true, amount: 0.35 },
});

export default function Setback1({
  left,
  topRight,
  bottomRight,
  reverse = false,
}: ShotsMosaicProps) {
  if (!left && !topRight && !bottomRight) return null;

  return (
    <section className="mx-auto mt-5 max-w-6xl lg:mt-10">
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1.55fr_1fr]">
        {left && (
          <motion.figure
            {...zig(reverse ? "right" : "left", 0.05)}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative h-[540px] overflow-hidden rounded-[26px] sm:h-[640px] md:h-[740px]"
          >
            <Image
              src={left.img}
              alt={left.alt || "Left shot"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 2rem), 60vw"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(95%_75%_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_55%,rgba(0,0,0,.55)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
              <figcaption className="elza max-w-[70%] text-right text-[12px] leading-5 text-white/90 md:text-[18px]">
                {left.caption}
              </figcaption>
              <div className="recoleta w-[8.5rem] shrink-0 text-right leading-[1.05] text-white">
                {left.title.split("\n").map((l, i) => (
                  <div key={i} className={i === 0 ? "text-[32px]" : "text-[40px]"}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </motion.figure>
        )}

        {(topRight || bottomRight) && (
          <div
            className={`grid h-[540px] grid-rows-2 gap-6 sm:h-[640px] md:h-[740px] ${
              reverse ? "md:order-1" : "md:order-2"
            }`}
          >
            {topRight && (
              <motion.figure
                {...zig(reverse ? "left" : "right", 0.12)}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative overflow-hidden rounded-[22px]"
              >
                <Image
                  src={topRight.img}
                  alt={topRight.alt || "Top right shot"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                />
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,rgba(0,0,0,0)_0%,rgba(0,0,0,.22)_50%,rgba(0,0,0,.65)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
                  <div className="recoleta w-[8.5rem] shrink-0 text-left leading-[1.05] text-white">
                    {topRight.title.split("\n").map((l, i) => (
                      <div key={i} className={i === 0 ? "text-[36px]" : "text-[40px]"}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <figcaption className="elza max-w-[70%] text-left text-[12px] leading-5 text-white/90 md:text-[18px]">
                    {topRight.caption}
                  </figcaption>
                </div>
              </motion.figure>
            )}

            {bottomRight && (
              <motion.figure
                {...zig(reverse ? "left" : "right", 0.18)}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative overflow-hidden rounded-[22px]"
              >
                <Image
                  src={bottomRight.img}
                  alt={bottomRight.alt || "Bottom right shot"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                />
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,rgba(0,0,0,0)_0%,rgba(0,0,0,.22)_50%,rgba(0,0,0,.65)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
                  <div className="recoleta w-[8.5rem] shrink-0 text-left leading-[1.05] text-white">
                    {bottomRight.title.split("\n").map((l, i) => (
                      <div key={i} className={i === 0 ? "text-[36px]" : "text-[40px]"}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <figcaption className="elza max-w-[70%] text-left text-[12px] leading-5 text-white/90 md:text-[18px]">
                    {bottomRight.caption}
                  </figcaption>
                </div>
              </motion.figure>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="mx-auto mt-[50px] hidden h-0.5 w-[520px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.9),transparent)] sm:block" />
        <div className="mx-auto mt-[50px] h-0.5 w-[200px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.9),transparent)] sm:hidden" />
      </div>
    </section>
  );
}
