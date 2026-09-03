"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Shot2Props = {
  leftTopSrc?: string;
  leftBottomSrc?: string;
  rightSrc?: string;
};

export default function Shot2({
  leftTopSrc,
  leftBottomSrc,
  rightSrc,
}: Shot2Props) {
  const hasAny = leftTopSrc || leftBottomSrc || rightSrc;
  if (!hasAny) return null;

  return (
    <section className="mx-auto lg:mt-10 mt-5 max-w-6xl">
      {/* MOBILE/TABLET */}
      <div className="lg:hidden grid grid-cols-1 items-stretch lg:gap-10 gap-5 md:grid-cols-[1.05fr_1.25fr]">
        {(leftTopSrc || leftBottomSrc) && (
          <div className="h-[420px] md:h-[520px]">
            <div className="flex h-full flex-col lg:gap-10 gap-5">
              {leftTopSrc && (
                <motion.figure
                  initial={{ opacity: 0, x: -36, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative flex-1 overflow-hidden rounded-[18px] ring-1 ring-white/10 shadow-[0_14px_28px_rgba(0,0,0,.35)]"
                >
                  <Image
                    src={leftTopSrc}
                    alt="Shot"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) calc(100vw - 2rem), 45vw"
                    priority
                  />
                </motion.figure>
              )}

              {leftBottomSrc && (
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
                  className="relative flex-1 overflow-hidden rounded-[18px]"
                >
                  <Image
                    src={leftBottomSrc}
                    alt="Shot"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) calc(100vw - 2rem), 45vw"
                  />
                </motion.figure>
              )}
            </div>
          </div>
        )}

        {rightSrc && (
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
            className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[28px]"
          >
            <Image
              src={rightSrc}
              alt="Shot"
              fill
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 2rem), 55vw"
            />
          </motion.figure>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 items-stretch lg:gap-10 gap-5 md:grid-cols-[1.05fr_1.25fr]">
          {(leftTopSrc || leftBottomSrc) && (
            <div className="h-[420px] md:h-[520px]">
              <div className="flex h-full flex-col lg:gap-10 gap-5">
                {leftTopSrc && (
                  <motion.figure
                    initial={{ opacity: 0, x: -36, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 16,
                      mass: 0.6,
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative flex-1 overflow-hidden rounded-[18px] ring-1 ring-white/10 shadow-[0_14px_28px_rgba(0,0,0,.35)]"
                  >
                    <Image
                      src={leftTopSrc}
                      alt="Shot"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) calc(100vw - 2rem), 45vw"
                      priority
                    />
                  </motion.figure>
                )}

                {leftBottomSrc && (
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
                    className="relative flex-1 overflow-hidden rounded-[18px]"
                  >
                    <Image
                      src={leftBottomSrc}
                      alt="Shot"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) calc(100vw - 2rem), 45vw"
                    />
                  </motion.figure>
                )}
              </div>
            </div>
          )}

          {rightSrc && (
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
              className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[28px]"
            >
              <Image
                src={rightSrc}
                alt="Shot"
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), 55vw"
              />
            </motion.figure>
          )}
        </div>
      </div>

      <div className="mx-auto mt-[50px] h-0.5 lg:w-[520px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.9),transparent)]" />
    </section>
  );
}
