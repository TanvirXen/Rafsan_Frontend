"use client";

import Image from "next/image";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

function ZigWrap({
  from,
  delay = 0,
  children,
}: {
  from: "left" | "right";
  delay?: number;
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
        <div className='flex min-h-[5.75rem] w-full flex-col items-center justify-start gap-3 sm:min-h-[7rem] xl:min-h-[8rem]'>
          <div className='relative h-6 w-6 shrink-0 sm:h-8 sm:w-8 xl:h-12 xl:w-12'>
            <Image
              src={iconSrc}
              alt=''
              fill
              sizes='(max-width: 640px) 24px, (max-width: 1280px) 32px, 48px'
              className='object-contain'
            />
          </div>

          <h4
            className={[
              "recoleta text-center text-[18px] font-bold leading-[22px] sm:text-[22px] sm:leading-[26px] xl:text-[28px] xl:leading-[30px]",
              titleClass || "text-inherit",
            ].join(" ")}
          >
            {title}
          </h4>
        </div>

        <p
          className={[
            "elza flex-1 text-center text-[14px] leading-5 sm:text-[15px] sm:leading-6 xl:text-[24px] xl:leading-8",
            bodyClass || "text-inherit",
          ].join(" ")}
        >
          {body}
        </p>

        <Link
          href={href}
          className={[
            "elza mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-bold transition sm:min-h-12 sm:px-6 sm:text-[14px]",
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

function CtaCard() {
  return (
    <article
      className='box-border flex w-full flex-col items-center justify-center rounded-[22px] border border-black/10 bg-[#FE80E9] px-4 py-5 text-[#121212] shadow-[0_16px_32px_-4px_rgba(12,12,13,0.10),_0_4px_4px_-4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-7 lg:rounded-[28px] xl:min-h-[288px] xl:px-12'
    >
      <div className='relative mb-2 h-6 w-6 shrink-0 sm:h-8 sm:w-8 xl:h-12 xl:w-12'>
        <Image
          src='/assets/Icon (3).png'
          alt=''
          fill
          sizes='(max-width: 640px) 24px, (max-width: 1280px) 32px, 48px'
          className='object-contain'
        />
      </div>

      <div className='flex w-full max-w-[434px] flex-col items-center gap-3 xl:gap-5'>
        <h5 className='recoleta text-center text-[18px] font-bold leading-[22px] text-[#121212] sm:text-[22px] sm:leading-[26px] xl:text-[28px] xl:leading-[30px]'>
          <span className='hidden xl:inline'>
            Want to share something
            <br />
            exciting?
          </span>
          <span className='xl:hidden'>Want to share something exciting?</span>
        </h5>

        <Link
          href='/connect'
          className='inline-flex h-[44px] w-full max-w-[240px] items-center justify-center gap-2 rounded-[28px] border-[3px] border-[#121212] shadow-[0_16px_32px_-4px_rgba(254,128,233,0.10),_0_4px_4px_-4px_rgba(254,128,233,0.05)]'
          aria-label='Get in touch'
        >
          <span className='elza text-[14px] font-bold leading-4 xl:text-[16px] xl:leading-6'>
            Get in touch
          </span>
          <FiArrowUpRight className='h-5 w-5 xl:h-6 xl:w-6' aria-hidden />
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
    "Turn your workplace into a stage of laughter and energy ! Fun,interactive corporate sows that boost smiles ,spirit and teamwork.";

  return (
    <section className='site-shell relative isolate z-[2] overflow-x-hidden py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto flex w-full max-w-[1100px] flex-col items-center gap-4 sm:gap-6 lg:gap-10'>
        <ZigWrap from='left' delay={0.05}>
          <div className='w-full'>
            <h2 className='recoleta text-center text-[28px] leading-[32px] text-[#FFD928] sm:text-[34px] sm:leading-[38px] lg:text-[48px] lg:leading-[52px]'>
              How Can I Help You?
            </h2>
          </div>
        </ZigWrap>

        <div className='grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8'>
          <ZigWrap from='left' delay={0.12}>
            <Card
              className='border border-black/10 bg-[#00D8FF] text-[#121212]'
              titleClass='text-[#121212]'
              bodyClass='text-[#121212]'
              ctaClassName='border-2 border-[#121212] text-[#121212] hover:bg-black/5'
              iconSrc='/assets/Icon (2).png'
              title={hostingTitle}
              body={hostingBody}
              ctaLabel='Book Hosting'
              minHeight='min-h-[220px] sm:min-h-[280px] lg:min-h-[420px] xl:min-h-[530px]'
            />
          </ZigWrap>

          <ZigWrap from='right' delay={0.16}>
            <Card
              className='border-[3px] border-[#FFD928] bg-[rgba(255,217,40,0.20)] text-[#FFD928] shadow-none'
              titleClass='text-[#FFD928]'
              bodyClass='text-[#FFD928]'
              ctaClassName='border-2 border-[#FFD928] text-[#FFD928] hover:bg-[#FFD928]/10'
              iconSrc='/assets/Icon (1).png'
              title={sessionsTitle}
              body={sessionsBody}
              ctaLabel='Plan Workshop'
              minHeight='min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] xl:min-h-[530px]'
            />
          </ZigWrap>

          <ZigWrap from='left' delay={0.2}>
            <Card
              className='border-[3px] border-[#00D8FF] bg-[rgba(0,216,255,0.20)] text-[#00D8FF]'
              titleClass='text-[#00D8FF]'
              bodyClass='text-[#00D8FF]'
              ctaClassName='border-2 border-[#00D8FF] text-[#00D8FF] hover:bg-[#00D8FF]/10'
              iconSrc='/assets/Star.png'
              title={brandTitle}
              body={brandBody}
              ctaLabel='Start Collaboration'
              minHeight='min-h-[220px] sm:min-h-[260px] lg:min-h-[420px] xl:min-h-[530px]'
            />
          </ZigWrap>

          <ZigWrap from='right' delay={0.24}>
            <Card
              className='border border-black/10 bg-[#FFD928] text-[#121212]'
              titleClass='text-[#121212]'
              bodyClass='text-[#121212]'
              ctaClassName='border-2 border-[#121212] text-[#121212] hover:bg-black/5'
              iconSrc='/assets/Icon (2).png'
              title={corporateTitle}
              body={corporateBody}
              ctaLabel='Book Corporate Show'
              minHeight='min-h-[220px] sm:min-h-[280px] lg:min-h-[420px] xl:min-h-[530px]'
            />
          </ZigWrap>
        </div>

        <ZigWrap from='right' delay={0.28}>
          <div className='w-full max-w-[1100px]'>
            <CtaCard />
          </div>
        </ZigWrap>
      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10' />
    </section>
  );
}
