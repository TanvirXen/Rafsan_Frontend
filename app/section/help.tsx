"use client";

import Image from "next/image";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

function ZigWrap({
  from,
  delay = 0,
  className = "",
  children,
}: {
  from: "left" | "right";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const x0 = from === "left" ? -18 : 18;

  return (
    <motion.div
      initial={{ opacity: 0, x: x0, y: 16 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.35, margin: "-10% 0px -10% 0px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 16,
        mass: 0.6,
        delay,
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Card({
  className = "",
  titleClass = "",
  bodyClass = "",
  ctaClassName = "",
  iconClassName = "",
  iconSrc,
  title,
  body,
  ctaLabel,
  href = "/connect",
  minHeight = "",
}: {
  className?: string;
  titleClass?: string;
  bodyClass?: string;
  ctaClassName?: string;
  iconClassName?: string;
  iconSrc: string;
  title: string;
  body: string;
  ctaLabel: string;
  href?: string;
  minHeight?: string;
}) {
  return (
    <article
      className={[
        "box-border flex h-full w-full flex-col items-center rounded-[22px] px-4 py-5 text-center sm:px-6 sm:py-7 lg:rounded-[28px] lg:px-8 xl:px-12",
        "shadow-[0_16px_32px_-4px_rgba(12,12,13,0.10),_0_4px_4px_-4px_rgba(12,12,13,0.05)]",
        minHeight,
        className,
      ].join(" ")}
    >
      <div className='flex h-full w-full max-w-[434px] flex-col items-center'>
        <div className='flex min-h-[5rem] w-full flex-col items-center justify-start gap-3 sm:min-h-[5.5rem] xl:min-h-[6rem]'>
          <div className='relative h-6 w-6 shrink-0 sm:h-8 sm:w-8 xl:h-12 xl:w-12'>
            <Image
              src={iconSrc}
              alt=''
              fill
              sizes='(max-width: 640px) 24px, (max-width: 1280px) 32px, 48px'
              className={['object-contain', iconClassName].filter(Boolean).join(' ')}
            />
          </div>

          <h3
            className={[
              "recoleta text-center text-[16px] font-bold leading-[20px] sm:text-[18px] sm:leading-[22px] xl:text-[20px] xl:leading-[24px]",
              titleClass || "text-inherit",
            ].join(" ")}
          >
            {title}
          </h3>
        </div>

        <p
          className={[
            "elza flex-1 text-center text-[12px] leading-4 sm:text-[13px] sm:leading-5 xl:text-[14px] xl:leading-5",
            bodyClass || "text-inherit",
          ].join(" ")}
        >
          {body}
        </p>

        <Link
          href={href}
          className={[
            "elza mt-4 inline-flex min-h-9 items-center justify-center gap-2 rounded-full px-4 text-[11px] font-bold transition sm:min-h-10 sm:px-5 sm:text-[12px]",
            ctaClassName,
          ].join(" ")}
        >
          <span>{ctaLabel}</span>
          <FiArrowUpRight className='h-4 w-4 sm:h-5 sm:w-5' aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export default function Help() {
  const hostingTitle = "Hosting an Event";
  const hostingBody =
    "From corporate gatherings to cultural festivals, I focus on creating a truly engaging and lively atmosphere. My sincere humor and audience connection ensure a seamless, inclusive, and memorable event";

  const sessionsTitle = "Sessions & Workshops";
  const sessionsBody =
    "I conduct interactive sessions and workshops for universities, organizations, professionals, and even aspiring hosts. In these energetic sessions, I share my journey, the essential insights, and the practical skills I've learned. Participants walk away ready to apply powerful communication and storytelling techniques for real-world success.";

  const brandTitle = "Brand Collaboration";
  const brandBody =
    "I help brands tell stories that truly connect. With content and creative campaigns, I make your brand unforgettable.";

  const corporateTitle = "Corporate Shows";
  const corporateBody =
    "Turn your workplace into a stage of laughter and energy. Fun, interactive corporate shows that boost morale, spirit, and teamwork.";

  return (
    <section className='site-shell-wide relative isolate z-[2] overflow-x-hidden pt-2 pb-10 sm:pt-4 sm:pb-12 lg:pt-8 lg:pb-16'>
      <div className='mx-auto flex w-full max-w-none flex-col items-center gap-3 sm:gap-4 lg:gap-6'>
        <ZigWrap from='left' delay={0.05}>
          <div className='w-full'>
            <h2 className='recoleta text-center text-[30px] leading-[34px] text-[#FFD928] sm:text-[34px] sm:leading-[38px] lg:text-[48px] lg:leading-[54px]'>
              How Can I Help You?
            </h2>
          </div>
        </ZigWrap>

        <div className='grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:px-1 max-md:pb-3'>
          <ZigWrap from='left' delay={0.12} className='max-md:w-[min(78vw,300px)] max-md:shrink-0 max-md:snap-center'>
            <Card
              className='border-2 border-black/10 bg-[#00D8FF] text-[#121212]'
              titleClass='text-[#121212]'
              bodyClass='text-[#121212]'
              ctaClassName='border-2 border-[#121212] text-[#121212] hover:bg-black/5'
              iconSrc='/assets/Icon (2).png'
              title={hostingTitle}
              body={hostingBody}
              ctaLabel='Book Hosting'
              minHeight='min-h-[180px] sm:min-h-[220px] lg:min-h-[220px] xl:min-h-[240px]'
            />
          </ZigWrap>

          <ZigWrap from='right' delay={0.16} className='max-md:w-[min(78vw,300px)] max-md:shrink-0 max-md:snap-center'>
            <Card
              className='border-2 border-black/10 bg-[#FFD928] text-[#121212] shadow-none'
              titleClass='text-[#121212]'
              bodyClass='text-[#121212]'
              ctaClassName='border-2 border-[#121212] text-[#121212] hover:bg-black/5'
              iconSrc='/assets/Icon (1).png'
              iconClassName='brightness-0'
              title={sessionsTitle}
              body={sessionsBody}
              ctaLabel='Plan Workshop'
              minHeight='min-h-[200px] sm:min-h-[240px] lg:min-h-[220px] xl:min-h-[240px]'
            />
          </ZigWrap>

          <ZigWrap from='left' delay={0.2} className='max-md:w-[min(78vw,300px)] max-md:shrink-0 max-md:snap-center'>
            <Card
              className='border-2 border-black/10 bg-[#00D8FF] text-[#121212]'
              titleClass='text-[#121212]'
              bodyClass='text-[#121212]'
              ctaClassName='border-2 border-[#121212] text-[#121212] hover:bg-black/5'
              iconSrc='/assets/Star.png'
              iconClassName='brightness-0'
              title={brandTitle}
              body={brandBody}
              ctaLabel='Start Collaboration'
              minHeight='min-h-[180px] sm:min-h-[220px] lg:min-h-[220px] xl:min-h-[240px]'
            />
          </ZigWrap>

          <ZigWrap from='right' delay={0.24} className='max-md:w-[min(78vw,300px)] max-md:shrink-0 max-md:snap-center'>
            <Card
              className='border-2 border-black/10 bg-[#FFD928] text-[#121212]'
              titleClass='text-[#121212]'
              bodyClass='text-[#121212]'
              ctaClassName='border-2 border-[#121212] text-[#121212] hover:bg-black/5'
              iconSrc='/assets/Icon (2).png'
              title={corporateTitle}
              body={corporateBody}
              ctaLabel='Book Corporate Show'
              minHeight='min-h-[180px] sm:min-h-[220px] lg:min-h-[220px] xl:min-h-[240px]'
            />
          </ZigWrap>
        </div>

      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10' />
    </section>
  );
}
