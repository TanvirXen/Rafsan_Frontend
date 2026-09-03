"use client";

import { useMemo } from "react";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import Shot1 from "./components/shot1";
import Shot2 from "./components/shot2";
import Newsletter from "@/app/section/newsletter";

export type ShotDto = {
  _id: string;
  image: string;
  sequence: number;
};

interface ShotsSectionProps {
  shots: ShotDto[];
}

export default function ShotsSection({ shots }: ShotsSectionProps) {
  // Always-called hook #1
  const sorted = useMemo(
    () => [...(shots || [])].sort((a, b) => a.sequence - b.sequence),
    [shots]
  );

  // First 2 are the hero pair (computed every render – cheap)
  const heroPair = sorted.slice(0, 2);

  // Always-called hook #2 – comes BEFORE any early return
  // Everything after the first 2 is used in repeating mosaics of 3
  const mosaics = useMemo(() => {
    const rest = sorted.slice(2);
    const chunks: ShotDto[][] = [];
    for (let i = 0; i < rest.length; i += 3) {
      chunks.push(rest.slice(i, i + 3));
    }
    return chunks;
  }, [sorted]);

  const hasAny = sorted.length > 0;
  if (!hasAny) return null;

  return (
    <>
      <section className="mx-auto lg:mt-[60px] mt-10 max-w-6xl px-6">
        {/* Header */}
        <div className="relative lg:mb-[60px] mb-10 flex items-center justify-center gap-2">
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-6 sm:h-8 w-1 -translate-y-1/2 rounded bg-[#FFD928]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 h-6 sm:h-8 w-1 -translate-y-1/2 rounded bg-[#FFD928]"
          />

          <FiCamera
            className="lg:h-9 h-6 lg:w-11 w-6 text-white/90"
            aria-hidden
          />
          <h3 className="recoleta lg:text-[40px] text-2xl font-bold text-white">
            Shots
          </h3>
        </div>

        {/* -------- MOBILE/TABLET: top pair -------- */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:hidden">
          {heroPair[0] && (
            <motion.figure
              initial={{ opacity: 0, x: -36, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden rounded-2xl"
            >
              <Image
                src={heroPair[0].image}
                alt={`Shot ${heroPair[0].sequence}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
                priority
              />
            </motion.figure>
          )}

          {heroPair[1] && (
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
              className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden rounded-2xl"
            >
              <Image
                src={heroPair[1].image}
                alt={`Shot ${heroPair[1].sequence}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
              />
            </motion.figure>
          )}
        </div>

        {/* -------- DESKTOP: top pair -------- */}
        <div className="hidden lg:grid grid-cols-1 gap-10 md:grid-cols-2">
          {heroPair[0] && (
            <motion.figure
              initial={{ opacity: 0, x: -36, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden rounded-2xl"
            >
              <Image
                src={heroPair[0].image}
                alt={`Shot ${heroPair[0].sequence}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
                priority
              />
            </motion.figure>
          )}

          {heroPair[1] && (
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
              className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden rounded-2xl"
            >
              <Image
                src={heroPair[1].image}
                alt={`Shot ${heroPair[1].sequence}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), 48vw"
              />
            </motion.figure>
          )}
        </div>

        {/* -------- Dynamic mosaics (3 per row, alternate Shot1/Shot2) -------- */}
        {mosaics.map((group, idx) =>
          idx % 2 === 0 ? (
            <Shot1
              key={`mosaic-${idx}`}
              leftSrc={group[0]?.image}
              topRightSrc={group[1]?.image}
              bottomRightSrc={group[2]?.image}
            />
          ) : (
            <Shot2
              key={`mosaic-${idx}`}
              leftTopSrc={group[0]?.image}
              leftBottomSrc={group[1]?.image}
              rightSrc={group[2]?.image}
            />
          )
        )}
      </section>

      <Newsletter />
    </>
  );
}
