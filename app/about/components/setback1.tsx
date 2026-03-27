"use client";

import Image from "next/image";
import { motion, type MotionProps, type Transition } from "framer-motion";

type Card = {
  img: string;
  alt?: string;
  title: string; // "July\n2021"
  caption: string;
};

type ShotsMosaicProps = {
  left?: Card;
  topRight?: Card;
  bottomRight?: Card;
  reverse?: boolean; // 👈 NEW
};

/* ---- typed transition + helper ---- */
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
  left = {
    img: "/assets/set3.jpg",
    alt: "Crowd moment",
    title: "July\n2021",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  topRight = {
    img: "/assets/set4.jpg",
    alt: "Stage lights",
    title: "March\n2019",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  bottomRight = {
    img: "/assets/set5.jpg",
    alt: "Mic and stage",
    title: "Beginning\n2016",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  reverse = false,
}: ShotsMosaicProps) {
  const cols = reverse
    ? "md:grid-cols-[1fr_1.55fr]"
    : "md:grid-cols-[1.55fr_1fr]";
  const bigOrder = reverse ? "md:order-2" : "md:order-1";
  const stackOrder = reverse ? "md:order-1" : "md:order-2";

  const bigFrom: "left" | "right" = reverse ? "right" : "left";
  const stackFrom: "left" | "right" = reverse ? "left" : "right";

  return (
    <section className="mx-auto mt-5 lg:mt-10 max-w-6xl">
      <div
        className={`grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1.55fr_1fr] ${cols}`}
      >
        {/* BIG CARD — left by default, right when reversed */}
        <motion.figure
          {...zig(bigFrom, 0.05)}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`relative h-[540px] sm:h-[640px] md:h-[740px] overflow-hidden rounded-[26px] ${bigOrder}`}
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
          <figcaption className="elza absolute right-5 bottom-5 max-w-sm text-right text-[12px] md:text-[18px] leading-5 text-white/90">
            {left.caption}
          </figcaption>
          <div className="recoleta absolute right-5 bottom-20 text-right leading-[1.05] text-white">
            {left.title.split("\n").map((l, i) => (
              <div
                key={i}
                className={i === 0 ? "text-[32px]" : "text-[40px]"}
              >
                {l}
              </div>
            ))}
          </div>
        </motion.figure>

        {/* STACKED COLUMN — right by default, left when reversed */}
        <div
          className={`grid h-[540px] sm:h-[640px] md:h-[740px] grid-rows-2 gap-6 ${stackOrder}`}
        >
          {/* Top-right */}
          <motion.figure
            {...zig(stackFrom, 0.12)}
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
            <div className="recoleta absolute left-5 lg:top-[60%] top-[46%] text-left leading-[1.05] text-white">
              {topRight.title.split("\n").map((l, i) => (
                <div
                  key={i}
                  className={i === 0 ? "text-[36px]" : "text-[40px]"}
                >
                  {l}
                </div>
              ))}
            </div>
            <figcaption className="elza absolute left-5 right-5 bottom-5 text-[12px] md:text-[18px] leading-5 text-white/90">
              {topRight.caption}
            </figcaption>
          </motion.figure>

          {/* Bottom-right */}
          <motion.figure
            {...zig(stackFrom, 0.18)}
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
            <div className="recoleta absolute left-5 lg:top-[60%] top-[46%] text-left leading-[1.05] text-white">
              {bottomRight.title.split("\n").map((l, i) => (
                <div
                  key={i}
                  className={i === 0 ? "text-[36px]" : "text-[40px]"}
                >
                  {l}
                </div>
              ))}
            </div>
            <figcaption className="elza absolute left-5 right-5 bottom-5 text-[12px] md:text-[18px] leading-5 text-white/90">
              {bottomRight.caption}
            </figcaption>
          </motion.figure>
        </div>
      </div>

      {/* Divider (desktop & mobile) */}
      <div>
        <div className="mx-auto mt-[50px] h-0.5 w-[520px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.9),transparent)] hidden sm:block" />
        <div className="mx-auto mt-[50px] h-0.5 w-[200px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.9),transparent)] sm:hidden" />
      </div>
    </section>
  );
}
