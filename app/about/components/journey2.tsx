"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Story = {
  img: string;
  alt?: string;
  month: string;
  year: string;
  caption: string;
};

export default function Journey2({
  left = {
    img: "/assets/j3.jpg",
    alt: "Award moment",
    month: "May",
    year: "2024",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
  right = {
    img: "/assets/j4.jpg",
    alt: "Backstage profile",
    month: "December",
    year: "2023",
    caption:
      "From the classrooms of IBA to the bright lights of the stage and screen",
  },
}: {
  left?: Story;
  right?: Story;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 -mt-5 lg:mt-0">
      <div className="grid grid-cols-1 gap-5 lg:gap-10 md:grid-cols-2">
        {/* LEFT card (zig from left) */}
        <motion.figure
          initial={{ opacity: 0, x: -56, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6, delay: 0.05 }}
          className="relative h-[260px] sm:h-[420px] md:h-[540px] overflow-hidden rounded-[22px]"
        >
          <Image
            src={left.img}
            alt={left.alt || "Story"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
            priority
          />
          {/* bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(0,0,0,.70),rgba(0,0,0,0))]" />

          {/* bottom-right on ALL breakpoints */}
          <div className="absolute right-6 bottom-16 text-right leading-[1.05] text-white recoleta">
            <div className="text-[28px] sm:text-[40px]">{left.month}</div>
            <div className="text-[28px] sm:text-[40px]">{left.year}</div>
          </div>

          <figcaption className="elza absolute left-6 right-6 bottom-5 text-right text-[12px] md:text-[18px] leading-5 text-white/90">
            {left.caption}
          </figcaption>
        </motion.figure>

        {/* RIGHT card (zig from right) */}
        <motion.figure
          initial={{ opacity: 0, x: 56, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6, delay: 0.12 }}
          className="relative h-[300px] sm:h-[420px] md:h-[540px] overflow-hidden rounded-[22px]"
        >
          <Image
            src={right.img}
            alt={right.alt || "Story"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(0,0,0,.70),rgba(0,0,0,0))]" />

          {/* bottom-left on ALL breakpoints */}
          <div className="absolute left-6 bottom-16 text-left leading-[1.05] text-white">
            <div className="recoleta text-[28px] sm:text-[40px]">{right.month}</div>
            <div className="recoleta text-[28px] sm:text-[40px]">{right.year}</div>
          </div>

          <figcaption className="elza absolute left-6 right-6 bottom-5 text-left text-[12px] md:text-[18px] leading-5 text-white/90">
            {right.caption}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
