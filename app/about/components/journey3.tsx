"use client";

import { motion } from "framer-motion";
import StoryFlipCard from "./storyFlipCard";

type Card = {
  img: string;
  alt?: string;
  month: string;
  year: string;
  caption: string;
};

export default function Journey3({
  left,
  topRight,
  bottomRight,
  reverse = false,
}: {
  left?: Card;
  topRight?: Card;
  bottomRight?: Card;
  reverse?: boolean;
}) {
  if (!left && !topRight && !bottomRight) return null;

  const cards = [
    left ? { card: left, reverse: false } : null,
    topRight ? { card: topRight, reverse: true } : null,
    bottomRight ? { card: bottomRight, reverse: true } : null,
  ].filter(Boolean) as Array<{ card: Card; reverse: boolean }>;

  const fullLayout = Boolean(left && topRight && bottomRight);

  return (
    <section className="relative mx-auto max-w-6xl px-4 -mt-5 lg:mt-0">
      {fullLayout ? (
        <div className="grid grid-cols-1 items-stretch gap-5 lg:gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {left && (
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
              className="relative h-[260px] overflow-hidden rounded-[22px] md:h-[520px] md:rounded-r-[26px]"
            >
              <StoryFlipCard
                img={left.img}
                alt={left.alt || "Journey left"}
                month={left.month}
                year={left.year}
                caption={left.caption}
                reverse={false}
                priority
                sizes="(max-width: 768px) calc(100vw - 2rem), 60vw"
                className="h-full w-full"
              />
            </motion.figure>
          )}

          {(topRight || bottomRight) && (
            <div
              className={`grid h-[440px] gap-5 lg:gap-10 md:h-[520px] ${
                reverse ? "md:order-1" : "md:order-2"
              } grid-rows-2`}
            >
              {topRight && (
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
                  <StoryFlipCard
                    img={topRight.img}
                    alt={topRight.alt || "Journey top right"}
                    month={topRight.month}
                    year={topRight.year}
                    caption={topRight.caption}
                    reverse
                    sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                    className="h-full w-full"
                  />
                </motion.figure>
              )}

              {bottomRight && (
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
                  <StoryFlipCard
                    img={bottomRight.img}
                    alt={bottomRight.alt || "Journey bottom right"}
                    month={bottomRight.month}
                    year={bottomRight.year}
                    caption={bottomRight.caption}
                    reverse
                    sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                    className="h-full w-full"
                  />
                </motion.figure>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:gap-10 md:grid-cols-2">
          {cards.map(({ card, reverse: cardReverse }, idx) => (
            <motion.figure
              key={`${card.img}-${idx}`}
              initial={{ opacity: 0, x: cardReverse ? 56 : -56, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 16,
                mass: 0.6,
                delay: 0.05 + idx * 0.07,
              }}
              className={`relative h-[260px] overflow-hidden rounded-[22px] sm:h-[420px] md:h-[520px] ${
                cards.length === 1 ? "md:col-span-2" : ""
              }`}
            >
              <StoryFlipCard
                img={card.img}
                alt={card.alt || "Journey story"}
                month={card.month}
                year={card.year}
                caption={card.caption}
                reverse={cardReverse}
                sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
                className="h-full w-full"
              />
            </motion.figure>
          ))}
        </div>
      )}
    </section>
  );
}
