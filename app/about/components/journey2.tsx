"use client";

import { motion } from "framer-motion";
import StoryFlipCard from "./storyFlipCard";

type Story = {
  img: string;
  alt?: string;
  month: string;
  year: string;
  caption: string;
};

export default function Journey2({
  left,
  right,
}: {
  left?: Story;
  right?: Story;
}) {
  if (!left || !right) return null;

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
          <StoryFlipCard
            img={left.img}
            alt={left.alt || "Story"}
            month={left.month}
            year={left.year}
            caption={left.caption}
            reverse={false}
            priority
            sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
            className="h-full w-full"
          />
        </motion.figure>

        {/* RIGHT card (zig from right) */}
        <motion.figure
          initial={{ opacity: 0, x: 56, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6, delay: 0.12 }}
          className="relative h-[300px] sm:h-[420px] md:h-[540px] overflow-hidden rounded-[22px]"
        >
          <StoryFlipCard
            img={right.img}
            alt={right.alt || "Story"}
            month={right.month}
            year={right.year}
            caption={right.caption}
            reverse
            sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
            className="h-full w-full"
          />
        </motion.figure>
      </div>
    </section>
  );
}
