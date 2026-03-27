/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState } from "react";
import { slideIn } from "@/app/motionPresets";
import Section1 from "./section1";

export type FeaturedEvent = {
  date: string;
  title: string;
  blurb: string;
  img: string;
  alt?: string;
};

const DEFAULT_FEATURED: FeaturedEvent = {
  date: "September 12, 2025",
  title: "Annual Charity Gala",
  blurb:
    "From a passionate presenter to a professional host, my journey has been filled with excitement and learning. Discover how I reached this stage.",
  img: "/assets/j6.jpg",
  alt: "Stage photo",
};

type Props = {
  featured?: FeaturedEvent;
  events?: FeaturedEvent[];
};

function needsReadMore(text: string, limit = 140) {
  return text.trim().length > limit;
}

function truncateText(text: string, limit = 140) {
  const t = text.trim();
  if (t.length <= limit) return t;
  const cut = t.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export default function GalleryNotableEvents({ featured, events = [] }: Props) {
  const event = featured ?? DEFAULT_FEATURED;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<FeaturedEvent | null>(null);

  const openModal = (ev: FeaturedEvent) => {
    setActive(ev);
    setOpen(true);
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setOpen(false);
    setActive(null);
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  };

  const mobilePreviewLimit = 140;
  const isLong = useMemo(
    () => needsReadMore(event.blurb, mobilePreviewLimit),
    [event.blurb]
  );
  const preview = useMemo(
    () => (isLong ? truncateText(event.blurb, mobilePreviewLimit) : event.blurb),
    [event.blurb, isLong]
  );

  return (
    <section className='site-shell mt-12 sm:mt-14'>
      <div className='lg:hidden'>
        <div className='relative mb-8 flex items-center justify-center'>
          <h2 className='recoleta mx-auto w-fit px-4 text-center text-[30px] text-white'>
            Notable Events
          </h2>
          <span
            aria-hidden
            className='pointer-events-none absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded bg-[#FFD928]'
          />
          <span
            aria-hidden
            className='pointer-events-none absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded bg-[#FFD928]'
          />
        </div>

        <div className='mx-auto mb-8 grid w-full max-w-[28rem] min-h-[16rem] overflow-hidden rounded-[18px] shadow-[0_14px_28px_rgba(0,0,0,.35)] ring-1 ring-white/10 grid-cols-[minmax(0,1.7fr)_minmax(7.25rem,1fr)]'>
          <motion.div
            initial={{ opacity: 0, x: -32, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
            className='relative min-h-[16rem] overflow-hidden'
          >
            <Image
              src={event.img}
              alt={event.alt || event.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) calc(100vw - 2rem), 420px'
              priority
            />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 32, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
              mass: 0.6,
              delay: 0.05,
            }}
            className='flex items-center bg-[#FFD928] px-4'
          >
            <div className='flex w-full flex-col items-start justify-center gap-2 py-4'>
              <p className='elza text-[11px] leading-4 text-[#0B0F1A]/80'>{event.date}</p>
              <h3 className='recoleta text-[15px] font-extrabold leading-5 text-[#0B0F1A]'>
                {event.title}
              </h3>
              <p className='elza text-[11px] leading-4 text-[#0B0F1A]/90'>{preview}</p>
              {isLong && (
                <button
                  type='button'
                  onClick={() => openModal(event)}
                  className='elza text-[11px] font-bold text-[#0B0F1A] underline underline-offset-2'
                  aria-label='Read more'
                >
                  Read more
                </button>
              )}
            </div>
          </motion.aside>
        </div>
      </div>

      <div className='hidden lg:block'>
        <div className='relative mb-[60px]'>
          <h2 className='recoleta mx-auto w-fit px-4 text-center text-[40px] font-bold text-white'>
            Notable Events
          </h2>
          <span className='pointer-events-none absolute left-0 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded bg-[#FFD928] sm:block' />
          <span className='pointer-events-none absolute right-0 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded bg-[#FFD928] sm:block' />
        </div>

        <div className='mb-[40px] grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]'>
          <motion.article
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.35 }}
            variants={slideIn("left")}
            className='relative min-h-[22rem] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_18px_40px_rgba(0,0,0,.45)] lg:min-h-[33.75rem]'
          >
            <Image
              src={event.img}
              alt={event.alt || event.title}
              fill
              className='object-cover'
              sizes='(max-width: 1024px) calc(100vw - 2rem), 740px'
              priority
            />
          </motion.article>

          <motion.aside
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.35 }}
            variants={slideIn("right")}
            transition={{ delay: 0.05 }}
            className='flex min-h-[22rem] items-center rounded-[28px] bg-[#FFD928] ring-1 ring-black/10 shadow-[0_14px_32px_rgba(0,0,0,.25)] lg:min-h-[33.75rem]'
          >
            <div className='grid h-full place-items-center px-7 py-8'>
              <div className='max-w-[260px] space-y-3'>
                <p className='elza text-[14px] font-medium leading-none text-[#0B0F1A]/80'>
                  {event.date}
                </p>
                <h3 className='recoleta text-[24px] font-extrabold leading-[1.15] text-[#0B0F1A]'>
                  {event.title}
                </h3>
                <p className='elza text-[16px] leading-6 text-[#0B0F1A]/90'>
                  {event.blurb}
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <Section1
        events={events}
        onReadMore={openModal}
        previewLimit={mobilePreviewLimit}
      />

      <AnimatePresence>
        {open && active && (
          <motion.div
            className='fixed inset-0 z-[999] flex items-center justify-center px-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />

            <motion.div
              role='dialog'
              aria-modal='true'
              aria-label='Event details'
              className='relative w-full max-w-[520px] rounded-[20px] border border-white/10 bg-[#121212] p-5 shadow-[0_30px_80px_rgba(0,0,0,.55)]'
              initial={{ y: 18, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 18, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <button
                type='button'
                onClick={closeModal}
                className='absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/90 hover:bg-white/5'
                aria-label='Close'
              >
                ×
              </button>

              <div className='relative mb-4 h-[220px] w-full overflow-hidden rounded-[16px] bg-black/20'>
                <Image
                  src={active.img}
                  alt={active.alt || active.title}
                  fill
                  className='object-cover'
                  sizes='520px'
                />
                <div
                  aria-hidden
                  className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60'
                />
              </div>

              <p className='elza text-[12px] leading-4 text-[#00D8FF]'>
                {active.date}
              </p>

              <h3 className='recoleta mt-2 text-[20px] font-bold leading-6 text-white'>
                {active.title}
              </h3>

              <p className='elza mt-3 text-[14px] leading-6 text-white/90'>
                {active.blurb}
              </p>

              <div className='mt-5 flex items-center justify-end gap-3'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='elza inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-5 text-[14px] font-bold text-white hover:bg-white/5'
                >
                  Close
                </button>

                <Link
                  href='/allEvents'
                  onClick={() => closeModal()}
                  className='elza inline-flex h-10 items-center justify-center rounded-full bg-[#00D8FF] px-5 text-[14px] font-bold text-[#121212] hover:brightness-95'
                >
                  View all events
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
