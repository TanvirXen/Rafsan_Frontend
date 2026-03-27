"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState, type ReactNode } from "react";

export type NotableEventCard = {
  date: string;
  title: string;
  blurb: string;
  img: string;
  alt?: string;
};

const railInner = "mx-auto w-full max-w-[1100px]";

function Zig({
  from,
  delay = 0,
  hover = true,
  children,
}: {
  from: "left" | "right";
  delay?: number;
  hover?: boolean;
  children: ReactNode;
}) {
  const x0 = from === "left" ? -20 : 20;
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
      {...(hover ? { whileHover: { y: -4, scale: 1.01 } } : {})}
    >
      {children}
    </motion.div>
  );
}

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

function CompactEventCard({
  event,
  tone,
  reverse = false,
  onReadMore,
}: {
  event: NotableEventCard;
  tone: "yellow" | "cyan";
  reverse?: boolean;
  onReadMore: (event: NotableEventCard) => void;
}) {
  const previewLimit = 140;
  const long = needsReadMore(event.blurb, previewLimit);
  const preview = long ? truncateText(event.blurb, previewLimit) : event.blurb;
  const panelBg = tone === "yellow" ? "bg-[#FFD928]" : "bg-[#00D8FF]";

  const panel = (
    <div className={`flex items-center px-4 ${panelBg}`}>
      <div className='flex w-full flex-col items-start justify-center gap-2 py-4'>
        <p className='elza text-[11px] leading-4 text-[#121212]/80'>{event.date}</p>
        <h3 className='recoleta text-[15px] font-bold leading-5 text-[#121212]'>
          {event.title}
        </h3>
        <p className='elza text-[11px] leading-4 text-[#121212]/90'>{preview}</p>
        {long && (
          <button
            type='button'
            onClick={() => onReadMore(event)}
            className='elza text-[11px] font-bold text-[#121212] underline underline-offset-2'
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );

  const image = (
    <div className='relative min-h-[15.5rem] overflow-hidden'>
      <Image
        src={event.img}
        alt={event.alt || event.title}
        fill
        className='object-cover'
        sizes='(max-width: 768px) calc(100vw - 2rem), 420px'
        priority
      />
    </div>
  );

  return (
    <div className='mx-auto grid w-full max-w-[28rem] min-h-[15.5rem] overflow-hidden rounded-[18px] shadow-[0_14px_28px_rgba(0,0,0,.35)] ring-1 ring-white/10 grid-cols-[minmax(0,1.7fr)_minmax(7.25rem,1fr)]'>
      {reverse ? panel : image}
      {reverse ? image : panel}
    </div>
  );
}

function Figure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className='relative min-h-[20rem] overflow-hidden rounded-[28px] bg-black/20 md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[33.75rem]'>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className='object-cover'
        sizes='(max-width: 1279px) calc(100vw - 2rem), 728px'
      />
    </figure>
  );
}

function EventCard({
  tone,
  date,
  title,
  body,
}: {
  tone: "yellow" | "cyan";
  date: string;
  title: string;
  body: string;
}) {
  const bg =
    tone === "yellow"
      ? "bg-[#FFD928] text-[#121212]"
      : "bg-[#00D8FF] text-[#121212]";

  return (
    <article
      className={[
        "flex h-full items-center rounded-[28px] p-8 lg:p-10",
        "min-h-[20rem] md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[33.75rem]",
        bg,
      ].join(" ")}
    >
      <div className='max-w-[16rem] space-y-3'>
        <p className='elza text-[15px] leading-6'>{date}</p>
        <h3 className='recoleta text-[24px] font-bold leading-[1.15]'>{title}</h3>
        <p className='elza text-[16px] leading-7'>{body}</p>
      </div>
    </article>
  );
}

export default function NotableEvents({ events }: { events?: NotableEventCard[] }) {
  const listRaw = events && events.length ? events : DEFAULT_EVENTS;
  const list = listRaw.slice(0, 2);
  const first = list[0] ?? DEFAULT_EVENTS[0];
  const second = list[1] ?? list[0] ?? DEFAULT_EVENTS[1];

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

  const activeEvent = useMemo(() => active, [active]);

  return (
    <section className='relative isolate overflow-x-hidden'>
      <div className='site-shell py-8 md:hidden'>
        <div className='mx-auto flex w-full max-w-[30rem] flex-col items-center gap-4 sm:gap-5'>
          <Zig from='left' delay={0.05}>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h2 className='recoleta text-[28px] font-bold leading-none text-[#FFD928]'>
                Notable Events
              </h2>
              <p className='elza text-[13px] leading-5 text-[#00D8FF]'>
                I have had the privilege to host some fantastic events:
              </p>
            </div>
          </Zig>

          <Zig from='right' delay={0.1}>
            <CompactEventCard event={first} tone='yellow' onReadMore={openModal} />
          </Zig>

          <Zig from='left' delay={0.15}>
            <CompactEventCard
              event={second}
              tone='cyan'
              reverse
              onReadMore={openModal}
            />
          </Zig>

          <Zig from='right' delay={0.2}>
            <Link
              href='/allEvents'
              className='elza inline-flex h-11 items-center justify-center rounded-full border border-[#00D8FF] px-6 text-sm font-bold text-white transition hover:bg-white/6'
            >
              Explore more events!
            </Link>
          </Zig>
        </div>
      </div>

      <div className='site-shell-wide hidden py-12 md:block lg:py-14'>
        <header className={`${railInner} mb-10 flex flex-col items-center gap-4`}>
          <h2 className='recoleta text-center text-[34px] font-bold leading-[40px] text-[#FFD928] lg:text-[40px] lg:leading-[48px]'>
            Notable Events
          </h2>
          <p className='elza text-center text-[16px] leading-6 text-[#00D8FF]'>
            I have had the privilege to host some fantastic events:
          </p>
        </header>

        <div className={`${railInner} space-y-10`}>
          <div className='grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:items-stretch lg:gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]'>
            <Zig from='left' delay={0.05}>
              <Figure src={first.img} alt={first.alt || first.title} />
            </Zig>
            <Zig from='right' delay={0.12}>
              <EventCard
                tone='yellow'
                date={first.date}
                title={first.title}
                body={first.blurb}
              />
            </Zig>
          </div>

          <div className='grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)] md:items-stretch lg:gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]'>
            <Zig from='left' delay={0.05}>
              <EventCard
                tone='cyan'
                date={second.date}
                title={second.title}
                body={second.blurb}
              />
            </Zig>
            <Zig from='right' delay={0.12}>
              <Figure src={second.img} alt={second.alt || second.title} />
            </Zig>
          </div>
        </div>

        <div className={`${railInner} mt-10 flex justify-center`}>
          <Link
            href='/allEvents'
            className='elza inline-flex h-12 items-center justify-center rounded-full border border-[#00D8FF] px-6 text-[16px] font-bold text-white transition hover:bg-white/6'
          >
            Explore more events!
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
                className='absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/90 hover:bg-white/5'
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
