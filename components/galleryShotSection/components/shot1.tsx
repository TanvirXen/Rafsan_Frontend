"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ShotsMosaicProps = {
  leftSrc?: string;
  topRightSrc?: string;
  bottomRightSrc?: string;
};

export default function Shot1({
  leftSrc,
  topRightSrc,
  bottomRightSrc,
}: ShotsMosaicProps) {
  const hasAny = leftSrc || topRightSrc || bottomRightSrc;
  if (!hasAny) return null;

  return (
    <section className="mx-auto lg:mt-10 mt-5 max-w-6xl">
      {/* MOBILE/TABLET */}
      <div className="lg:hidden grid grid-cols-1 items-stretch lg:gap-10 gap-5 md:grid-cols-[1.55fr_1fr]">
        {leftSrc && (
          <motion.figure
            initial={{ opacity: 0, x: -36, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[0_18px_40px_rgba(0,0,0,.45)]"
          >
            <Image
              src={leftSrc}
              alt="Shot"
              fill
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 2rem), 60vw"
              priority
            />
          </motion.figure>
        )}

        {(topRightSrc || bottomRightSrc) && (
          <div className="h-[420px] md:h-[520px]">
            <div className="flex h-full flex-col lg:gap-10 gap-5">
              {topRightSrc && (
                <motion.figure
                  initial={{ opacity: 0, x: 36, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 16,
                    mass: 0.6,
                    delay: 0.05,
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative flex-1 overflow-hidden rounded-[20px]"
                >
                  <Image
                    src={topRightSrc}
                    alt="Shot"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                  />
                </motion.figure>
              )}

              {bottomRightSrc && (
                <motion.figure
                  initial={{ opacity: 0, x: -36, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 16,
                    mass: 0.6,
                    delay: 0.1,
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative flex-1 overflow-hidden rounded-[20px]"
                >
                  <Image
                    src={bottomRightSrc}
                    alt="Shot"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                  />
                </motion.figure>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 items-stretch lg:gap-10 gap-5 md:grid-cols-[1.55fr_1fr]">
          {leftSrc && (
            <motion.figure
              initial={{ opacity: 0, x: -36, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[0_18px_40px_rgba(0,0,0,.45)]"
            >
              <Image
                src={leftSrc}
                alt="Shot"
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), 60vw"
                priority
              />
            </motion.figure>
          )}

          {(topRightSrc || bottomRightSrc) && (
            <div className="h-[420px] md:h-[520px]">
              <div className="flex h-full flex-col lg:gap-10 gap-5">
                {topRightSrc && (
                  <motion.figure
                    initial={{ opacity: 0, x: 36, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 16,
                      mass: 0.6,
                      delay: 0.05,
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative flex-1 overflow-hidden rounded-[20px]"
                  >
                    <Image
                      src={topRightSrc}
                      alt="Shot"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                    />
                  </motion.figure>
                )}

                {bottomRightSrc && (
                  <motion.figure
                    initial={{ opacity: 0, x: -36, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 16,
                      mass: 0.6,
                      delay: 0.1,
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative flex-1 overflow-hidden rounded-[20px]"
                  >
                    <Image
                      src={bottomRightSrc}
                      alt="Shot"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                    />
                  </motion.figure>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
