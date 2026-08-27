"use client";

import { motion } from "framer-motion";
import StoryFlipCard from "./storyFlipCard";

type StoryCard = {
  img: string;
  alt?: string;
  month: string;
  year: string;
  caption: string;
};

export default function Journey1({
  left,
  right,
}: {
  left?: StoryCard;
  right?: StoryCard;
}) {
  if (!left || !right) return null;

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
            relative w-full overflow-hidden
            h-[260px] rounded-[22px]
            md:h-[540px] md:rounded-r-[26px] md:rounded-l-none
          "
        >
          <StoryFlipCard
            img={left.img}
            alt={left.alt || "Story"}
            month={left.month}
            year={left.year}
            caption={left.caption}
            reverse={false}
            priority
            sizes="(max-width: 768px) calc(100vw - 2rem), 62vw"
            className="h-full w-full"
          />
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
          <StoryFlipCard
            img={right.img}
            alt={right.alt || "Story"}
            month={right.month}
            year={right.year}
            caption={right.caption}
            reverse
            sizes="(max-width: 768px) calc(100vw - 2rem), 360px"
            className="h-full w-full"
          />
        </motion.figure>
      </div>
    </section>
  );
}
