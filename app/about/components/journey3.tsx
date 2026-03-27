"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Card = {
  img: string;
  alt?: string;
  title: string; // e.g. "July\n2021"
  caption: string;
};

export default function Journey3({
  left = {
    img: "/assets/j5.jpg",
    alt: "Stage co-hosting",
    title: "July\n2021",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  topRight = {
    img: "/assets/j6.jpg",
    alt: "Reno launch",
    title: "March\n2019",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  bottomRight = {
    img: "/assets/j7.png",
    alt: "Red carpet portrait",
    title: "March\n2019",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  reverse = false,
}: {
  left?: Card;
  topRight?: Card;
  bottomRight?: Card;
  reverse?: boolean;
}) {
  const gridCols = reverse
    ? "md:grid-cols-[1fr_1.55fr]"
    : "md:grid-cols-[1.55fr_1fr]";
  const tallOrder = reverse ? "md:order-2" : "md:order-1";
  const stackOrder = reverse ? "md:order-1" : "md:order-2";

  return (
    <section className="relative mx-auto max-w-6xl px-4 -mt-5 lg:mt-0">
      <div
        className={`grid grid-cols-1 items-stretch gap-5 lg:gap-10 ${gridCols}`}
      >
        {/* TALL CARD (left by default, right when reversed) */}
        <motion.figure
          initial={{ opacity: 0, x: reverse ? 56 : -56, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 16,
            mass: 0.6,
            delay: 0.05,
          }}
          className={`relative h-[260px] md:h-[520px] overflow-hidden rounded-[22px] md:rounded-r-[26px] ${tallOrder}`}
        >
          <Image
            src={left.img}
            alt={left.alt || "Journey left"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(100vw - 2rem), 60vw"
            priority
          />
          {/* vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(95%_75%_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_55%,rgba(0,0,0,.60)_100%)]" />
          {/* caption: right-aligned */}
          <figcaption className="elza absolute left-5 right-5 bottom-5 text-[12px] md:text-[18px] leading-5 text-white/90 text-right">
            {left.caption}
          </figcaption>
          {/* date: bottom-right */}
          <div className="recoleta absolute right-5 bottom-16 text-right leading-[1.05] text-white">
            {left.title.split("\n").map((t, i) => (
              <div
                key={i}
                className={
                  i === 0
                    ? "text-[28px] md:text-[40px]"
                    : "text-[28px] md:text-[40px]"
                }
              >
                {t}
              </div>
            ))}
          </div>
        </motion.figure>

        {/* STACKED CARDS (right by default, left when reversed) */}
        <div
          className={`grid h-[440px] md:h-[520px] grid-rows-2 gap-5 lg:gap-10 ${stackOrder}`}
        >
          {/* top card */}
          <motion.figure
            initial={{ opacity: 0, x: reverse ? -56 : 56, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
              mass: 0.6,
              delay: 0.12,
            }}
            className="relative overflow-hidden rounded-[22px]"
          >
            <Image
              src={topRight.img}
              alt={topRight.alt || "Journey top right"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,rgba(0,0,0,0)_0%,rgba(0,0,0,.22)_50%,rgba(0,0,0,.70)_100%)]" />
            {/* date bottom-left */}
            <div className="recoleta absolute left-5 bottom-16 text-white leading-[1.05]">
              {topRight.title.split("\n").map((t, i) => (
                <div
                  key={i}
                  className={
                    i === 0
                      ? "text-[28px] md:text-[40px]"
                      : "text-[28px] md:text-[40px]"
                  }
                >
                  {t}
                </div>
              ))}
            </div>
            <figcaption className="elza absolute left-5 right-5 bottom-5 text-[12px] md:text-[18px] leading-5 text-white/90">
              {topRight.caption}
            </figcaption>
          </motion.figure>

          {/* bottom card */}
          <motion.figure
            initial={{ opacity: 0, x: reverse ? -56 : 56, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
              mass: 0.6,
              delay: 0.2,
            }}
            className="relative overflow-hidden rounded-[22px]"
          >
            <Image
              src={bottomRight.img}
              alt={bottomRight.alt || "Journey bottom right"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,rgba(0,0,0,0)_0%,rgba(0,0,0,.22)_50%,rgba(0,0,0,.70)_100%)]" />
            {/* date bottom-left */}
            <div className="recoleta absolute left-5 bottom-16 text-left leading-[1.05] text-white">
              {bottomRight.title.split("\n").map((t, i) => (
                <div
                  key={i}
                  className={
                    i === 0
                      ? "text-[28px] md:text-[40px]"
                      : "text-[28px] md:text-[40px]"
                  }
                >
                  {t}
                </div>
              ))}
            </div>
            <figcaption className="elza absolute left-5 right-5 bottom-5 text-[12px] md:text-[18px] leading-5 text-white/90">
              {bottomRight.caption}
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
