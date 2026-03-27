"use client";

import { LuCircleCheckBig } from "react-icons/lu";
import { motion } from "framer-motion";

type Fact = {
  title: string;
  body: string;
  bg?: string;
  border?: string;
  text?: string;
};

const FACTS: Fact[] = [
  {
    title: "Hosting an Event",
    body: "From corporate gatherings to cultural festivals, I ensure every event is engaging, lively.",
    bg: "#00D8FF",
    border: "#7fefff",
    text: "#121212",
  },
  {
    title: "Sessions & Workshops",
    body: "I conduct interactive sessions and workshops for universities, organizations.",
    bg: "#cba64a1a",
    border: "#ffd928",
    text: "#ffd928",
  },
  {
    title: "Brand Collaboration",
    body: "I help your brand reach the right audience in a memorable way.",
    bg: "#0e3e46",
    border: "#00d8ff",
    text: "#00d8ff",
  },
  {
    title: "Corporate Shows",
    body: "I blend humor, motivation, and audience interaction to make company events fresh.",
    bg: "#ffd928",
    border: "#ffe783",
    text: "#0b0f1a",
  },
];

export default function QuickFacts() {
  return (
    <section className='mx-auto max-w-6xl text-white px-4 md:px-6 mt-8 md:mt-[50px] lg:mt-[60px]'>
      <h2 className='recoleta text-center text-[#FFD928] text-[32px] leading-[1.1] sm:text-[36px] md:text-[48px] lg:text-[64px]'>
        Quick Facts
      </h2>

      {/* mobile: tighter gap, md: medium, lg: original gap-10 */}
      <div className='mt-6 grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 md:grid-cols-2'>
        {FACTS.map((f, idx) => (
          <FactCard
            key={idx}
            {...f}
            from={idx % 2 === 0 ? "left" : "right"}
            delay={0.06 * idx}
          />
        ))}
      </div>

      <div className='mx-auto mt-[40px] md:mt-[50px] h-0.5 w-[240px] md:w-[320px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.9),transparent)]' />
    </section>
  );
}

function FactCard({
  title,
  body,
  bg,
  border,
  text,
  from = "left",
  delay = 0,
}: Fact & { from?: "left" | "right"; delay?: number }) {
  const x0 = from === "left" ? -56 : 56;

  return (
    <motion.article
      initial={{ opacity: 0, x: x0, y: 12 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 16,
        mass: 0.6,
        delay,
      }}
      className='rounded-2xl p-4 md:p-5 ring-1 shadow-[0_10px_26px_rgba(0,0,0,.35)]'
      style={{
        background: bg ?? "rgba(6,201,255,.12)",
        borderColor: border ?? "rgba(255,255,255,.08)",
        color: text ?? "#ffffff",
      }}
    >
      <div className='flex items-start gap-3 md:gap-6'>
        <span className='grid h-9 w-9 md:h-10 md:w-10 place-items-center shrink-0'>
          <LuCircleCheckBig className='h-7 w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 opacity-90' />
        </span>

        <div className='flex-1'>
          {/* lg stays 28px exactly */}
          <h3 className='recoleta text-[20px] md:text-[24px] lg:text-[28px]'>
            {title}
          </h3>
          {/* lg stays 2xl exactly */}
          <p className='mt-2 text-[16px] md:text-xl lg:text-2xl leading-[1.5] md:leading-[1.4] lg:leading-[1.35] opacity-95'>
            {body}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
