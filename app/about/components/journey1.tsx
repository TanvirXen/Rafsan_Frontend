"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type StoryCard = {
  img: string;
  alt?: string;
  month: string;
  year: string;
  caption: string;
};

export default function Journey1({
  left = {
    img: "/assets/exp4.jpg",
    alt: "Talk show sofa",
    month: "December",
    year: "2023",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  right = {
    img: "/assets/exp2.png",
    alt: "Mic in studio",
    month: "May",
    year: "2024",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
}: {
  left?: StoryCard;
  right?: StoryCard;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 gap-5 lg:gap-10 md:grid-cols-[minmax(0,1fr)_380px]">
        {/* LEFT / Top card (zig from left) */}
        <motion.figure
          initial={{ opacity: 0, x: -56, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6, delay: 0.05 }}
          className="
            relative overflow-hidden w-full
            h-[260px] rounded-[22px]
            md:h-[540px] md:rounded-r-[26px] md:rounded-l-none
          "
        >
          <Image
            src={left.img}
            alt={left.alt || "Story"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(100vw - 2rem), 62vw"
            priority
          />

          {/* bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(0,0,0,.70),rgba(0,0,0,0))]" />

          {/* Bottom-right on ALL breakpoints */}
          <div
            className="
              absolute text-white leading-[1.05]
              right-6 bottom-16 text-right recoleta
            "
          >
            <div className="recoleta text-[28px] md:text-[40px]">{left.month}</div>
            <div className="recoleta text-[28px] md:text-[40px]">{left.year}</div>
          </div>

          <figcaption className="elza absolute left-5 right-6 bottom-5 text-right text-[12px] md:text-[18px] leading-5 text-white/90">
            {left.caption}
          </figcaption>
        </motion.figure>

        {/* RIGHT / Bottom card (zig from right) */}
        <motion.figure
          initial={{ opacity: 0, x: 56, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6, delay: 0.12 }}
          className="
            relative overflow-hidden
            h-[300px] rounded-[22px]
            md:h-80 md:self-end
          "
        >
          <Image
            src={right.img}
            alt={right.alt || "Story"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(100vw - 2rem), 360px"
          />

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(0,0,0,.70),rgba(0,0,0,0))]" />

          {/* Bottom-left on ALL breakpoints */}
          <div
            className="
              absolute text-white leading-[1.05]
              left-6 bottom-16
            "
          >
            <div className="recoleta text-[28px] md:text-[40px]">{right.month}</div>
            <div className="recoleta text-[24px] md:text-[32px]">{right.year}</div>
          </div>

          <figcaption className="elza absolute left-6 right-6 bottom-4 text-left text-[12px] md:text-[18px] leading-5 text-white/90">
            {right.caption}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
