"use client";

import Image from "next/image";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

/* ---------- tiny motion helper ---------- */
function ZigWrap({
  from,
  delay = 0,
  children,
}: {
  from: "left" | "right";
  delay?: number;
  children: React.ReactNode;
}) {
  const x0 = from === "left" ? -64 : 64;
  return (
    <motion.div
      initial={{ opacity: 0, x: x0, y: 16, rotateZ: 0.2 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateZ: 0 }}
      viewport={{ once: true, amount: 0.35, margin: "-10% 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- shared card primitive with mobile + lg sizes ---------- */
function Card({
  className = "",
  titleClass = "",
  bodyClass = "",
  iconSrc,
  title,
  body,
  mobileH = "h-[148px]",
  lgH = "lg:h-[530px]",
}: {
  className?: string;
  titleClass?: string;
  bodyClass?: string;
  iconSrc: string;
  title: string;
  body: string;
  mobileH?: string;
  lgH?: string;
}) {
  return (
    <article
      className={[
        "box-border flex flex-col items-center justify-center",
        "w-[336px] rounded-[28px] p-6 gap-[6px]",
        mobileH,
        "lg:w-[530px] lg:p-12 lg:gap-5", lgH,
        className,
      ].join(" ")}
    >
      {/* icon */}
      <div className="relative mb-1 h-6 w-6 lg:h-12 lg:w-12">
        <Image
          src={iconSrc}
          alt=""
          fill
          sizes="(max-width: 1024px) 24px, 48px"
          className="object-contain"
        />
      </div>

      {/* ⬇️ keep content centered on all sizes */}
      <div className="flex w-[288px] flex-col items-center gap-[6px] lg:w-[434px] lg:items-center lg:gap-5">
        <h4
          className={[
            "font-bold text-center text-[14px] leading-[16px]",
            // removed lg:text-left; keep centered
            "lg:h-[28px] lg:text-[28px] lg:leading-[28px]",
            titleClass || "text-inherit",
          ].join(" ")}
        >
          {title}
        </h4>

        <p
          className={[
            "text-center text-[10px] leading-[12px]",
            // removed lg:text-left; keep centered
            "lg:text-[24px] lg:leading-8",
            bodyClass || "text-inherit",
          ].join(" ")}
        >
          {body}
        </p>
      </div>
    </article>
  );
}


/* ---------- CTA small + lg ---------- */
function CtaCard() {
  return (
    <article
      className={[
        "box-border flex w=[336px] w-[336px] flex-col items-center justify-center rounded-[28px] p-6",
        "h-[152px] bg-[#FE80E9] text-[#121212] border border-black/10",
        "shadow-[0_16px_32px_-4px_rgba(12,12,13,0.10),_0_4px_4px_-4px_rgba(12,12,13,0.05)]",
        // lg sizing
        "lg:w-[530px] lg:h-[288px] lg:p-12",
      ].join(" ")}
    >
      <div className="relative mb-1 h-6 w-6 lg:h-12 lg:w-12">
        <Image
          src="/assets/Icon (3).png"
          alt=""
          fill
          sizes="(max-width: 1024px) 24px, 48px"
          className="object-contain"
        />
      </div>

      <div className="flex h-[74px] w-[288px] flex-col items-center gap-2 lg:h-[124px] lg:w-[434px] lg:gap-5">
        <h5 className="recoleta font-bold text-center text-[14px] leading-[20px] text-[#121212] lg:text-[28px] lg:leading-[28px]">
          {/* mobile: single line height feel */}
          <span className="hidden lg:inline">
            Want to share something
            <br />
            exciting?
          </span>
          <span className="lg:hidden">Want to share something exciting?</span>
        </h5>

        <Link
      href="/connect"
      className={[
        "inline-flex h-[44px] w-[150px] items-center justify-center gap-2 rounded-[28px] border-[3px] border-[#121212]",
        "shadow-[0_16px_32px_-4px_rgba(254,128,233,0.10),_0_4px_4px_-4px_rgba(254,128,233,0.05)]",
        "lg:h-12 lg:w-[240px]"
      ].join(" ")}
      aria-label="Get in touch"
    >
      <span className="elza text-[14px] font-bold leading-4 lg:text-[16px] lg:leading-6">
        Get in touch
      </span>
      <FiArrowUpRight className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden />
    </Link>
      </div>
    </article>
  );
}

export default function HelpDextop() {
  return (
    <section
      className={[
        "relative isolate mx-auto z-2 ",
        // MOBILE/TABLET (Figma 440×909 content feel)
        "flex flex-col items-center gap-10 px-10 pt-[30px] pb-[15px] max-w-[440px]",
        // DESKTOP (unchanged)
        "lg:max-w-[1440px] lg:px-[170px] lg:pt-[60px] lg:pb-[30px]",
      ].join(" ")}
    >
      {/* container */}
      <div
        className={[
          // mobile container 360 wide, natural height
          "flex w-[360px] flex-col items-center gap-10",
          // desktop container fixed
          "lg:items-start lg:gap-6 lg:w-[1100px] lg:h-[1540px]",
        ].join(" ")}
      >
        {/* title row */}
        <div
          className={[
            // mobile small title block (visible)
            "flex w-full items-start gap-2.5",
            // desktop: hidden title line in your figma header, but the big yellow H3 shows below in left column
            "lg:hidden",
          ].join(" ")}
        >
          <h2 className="recoleta text-[32px] leading-8 text-[#FFD928]">How Can I Help You?</h2>
        </div>

        {/* desktop headline block (unchanged) */}
        <div className="hidden w-[1100px] lg:flex lg:h-12 lg:flex-col lg:items-center lg:gap-6">
          <h2 className="hidden h-12 w-[1100px] text-center recoleta text-[40px] leading-12 text-[#FFD928]">
            How Can I Help You?
          </h2>
        </div>

        {/* GRID: mobile = single column; desktop = two fixed columns */}
        <div
          className={[
            // mobile stack
            "flex w-[360px] flex-col items-center gap-2.5",
            // desktop row with two columns 530/530 (+40 gap)
            "lg:w-[1100px] lg:h-[1468px] lg:flex-row lg:items-start lg:gap-10",
          ].join(" ")}
        >
          {/* LEFT column on desktop; first chunk on mobile */}
          <div className="flex w-[360px] flex-col items-center gap-2.5 lg:w-[530px] lg:gap-10 lg:py-5">
            {/* big heading (desktop only) */}
            <div className="hidden w-[530px] lg:flex lg:h-32 lg:flex-row lg:items-start lg:gap-2.5">
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
                className="recoleta h-32 w-[1100px] text-[64px] leading-16 text-[#FFD928]"
              >
                How Can I Help You?
              </motion.h3>
              <p className="hidden h-32 w-[530px] text-[16px] leading-8 text-white" />
            </div>

            {/* 1) Sessions & Workshops — yellow outlined */}
            <ZigWrap from="left" delay={0.05}>
              <Card
                className="bg-[rgba(255,217,40,0.20)] border-[3px] border-[#FFD928] text-[#FFD928] "
                titleClass="text-[#FFD928] recoleta"
                bodyClass="text-[#FFD928] elza"
                iconSrc="/assets/Icon (1).png"
                title="Sessions & Workshops"
                body="I conduct interactive sessions and workshops for universities, organizations, professionals, and even aspiring hosts. In these energetic sessions, I share my journey, the essential insights, and the practical skills I've learned. Participants walk away ready to apply powerful communication and storytelling techniques for real-world success."
                mobileH="h-[148px]"
                lgH="lg:h-[530px]"
              />
            </ZigWrap>

            {/* 2) Corporate Shows — yellow filled (taller on mobile per spec 152px) */}
            <ZigWrap from="right" delay={0.15}>
              <Card
                className="bg-[#FFD928] text-[#121212] border border-black/10 shadow-[0_16px_32px_-4px_rgba(12,12,13,0.10),_0_4px_4px_-4px_rgba(12,12,13,0.05)]"
                titleClass="text-[#121212] recoleta"
                bodyClass="text-black elza"
                iconSrc="/assets/Icon (2).png"
                title="Corporate Shows"
                body="Turn your workplace into a stage of laughter and energy ! Fun,interactive corporate sows that boost smiles ,spirit and teamwork."
                mobileH="h-[152px]"
                lgH="lg:h-[530px]"
              />
            </ZigWrap>
          </div>

          {/* RIGHT column on desktop; continues stack on mobile */}
          <div className="mt-2.5 flex w-[360px] flex-col items-center gap-2.5 lg:mt-0 lg:w-[530px] lg:gap-10 lg:py-5">
            {/* 3) Hosting an Event — cyan filled */}
            <ZigWrap from="left" delay={0.1}>
              <Card
                className="bg-[#00D8FF] text-[#121212] border border-black/10 shadow-[0_16px_32px_-4px_rgba(12,12,13,0.10),_0_4px_4px_-4px_rgba(12,12,13,0.05)]"
                titleClass="text-[#121212] recoleta"
                bodyClass="text-[#121212] elza"
                iconSrc="/assets/Icon (2).png"
                title="Hosting an Event"
                body="From corporate gatherings to cultural festivals, I focus on creating a truly engaging and lively atmosphere. My sincere humor and audience connection ensure a seamless, inclusive, and memorable event"
                mobileH="h-[148px]"
                lgH="lg:h-[530px]"
              />
            </ZigWrap>

            {/* 4) Brand Collaboration — cyan outline (slightly shorter on mobile 140px) */}
            <ZigWrap from="right" delay={0.2}>
              <Card
                className="bg-[rgba(0,216,255,0.20)] border-[3px] border-[#00D8FF] text-[#00D8FF] shadow-[0_16px_32px_-4px_rgba(12,12,13,0.10),_0_4px_4px_-4px_rgba(12,12,13,0.05)]"
                titleClass="text-[#00D8FF] recoleta"
                bodyClass="text-[#00D8FF] elza"
                iconSrc="/assets/Star.png"
                title="Brand Collaboration"
                body="I help brands tell stories that truly connect. With content and creative campaigns, I make your brand unforgettable."
                mobileH="h-[140px]"
                lgH="lg:h-[530px]"
              />
            </ZigWrap>

            {/* 5) CTA — pink */}
            <ZigWrap from="right" delay={0.28}>
              <CtaCard />
            </ZigWrap>
          </div>
        </div>
      </div>

      {/* bottom divider hairline (unchanged) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
    </section>
  );
}
