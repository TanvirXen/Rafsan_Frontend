"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Section1 from "../gallery/components/section1";

export type NotableEventCard = {
  date: string;
  title: string;
  blurb: string;
  img: string;
  alt?: string;
};

const DEFAULT_EVENTS: NotableEventCard[] = [
  {
    date: "September 12, 2025",
    title: "Annual Charity Gala",
    blurb:
      "From a passionate presenter to a professional host, my journey has been filled with excitement and learning. Discover how I reached this stage.",
    img: "/assets/notable1.jpg",
    alt: "Annual Charity Gala",
  },
  {
    date: "September 12, 2025",
    title: "Summer Music Festival",
    blurb:
      "From a passionate presenter to a professional host, my journey has been filled with excitement and learning. Discover how I reached this stage.",
    img: "/assets/notable2.jpg",
    alt: "Summer Music Festival",
  },
];

export default function NotableEvents({ events }: { events?: NotableEventCard[] }) {
  const listRaw = events && events.length ? events : DEFAULT_EVENTS;
  const list = listRaw.slice(0, 2);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NotableEventCard | null>(null);

  const openModal = (ev: NotableEventCard) => {
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

  const activeEvent = active;

  return (
    <section className='relative isolate overflow-x-hidden'>
      <div className='site-shell-wide py-8 md:py-12 lg:py-14'>
        <header className='relative mb-8 flex items-center justify-center lg:mb-10'>
          <h2 className='recoleta mx-auto w-fit px-4 text-center text-[30px] text-white lg:text-[40px]'>
            Notable Events
          </h2>
          <span aria-hidden className='pointer-events-none absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded bg-[#FFD928] lg:h-8' />
          <span aria-hidden className='pointer-events-none absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded bg-[#FFD928] lg:h-8' />
        </header>

        <Section1
          events={list}
          onReadMore={openModal}
          previewLimit={140}
          startWithPanelRight
        />

        <div className='mt-10 flex justify-center'>
          <Link
            href='/portfolio'
            className='elza inline-flex h-12 items-center justify-center rounded-full border border-[#00D8FF] px-6 text-[16px] font-bold text-white transition hover:bg-white/6'
          >
            Explore more
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && activeEvent && (
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
                className='absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/90 hover:bg-white/5'
                aria-label='Close'
              >
                ×
              </button>

              <div className='relative mb-4 h-[220px] w-full overflow-hidden rounded-[16px] bg-black/20'>
                <Image
                  src={activeEvent.img}
                  alt={activeEvent.alt || activeEvent.title}
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
                {activeEvent.date}
              </p>

              <h3 className='recoleta mt-2 text-[20px] font-bold leading-6 text-white'>
                {activeEvent.title}
              </h3>

              <p className='elza mt-3 text-[14px] leading-6 text-white/90'>
                {activeEvent.blurb}
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
