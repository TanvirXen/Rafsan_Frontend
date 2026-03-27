"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slideIn } from "@/app/motionPresets";

type FeaturedEvent = {
  date: string;
  title: string;
  blurb: string;
  img: string;
  alt?: string;
};

export default function Section3({
  event = {
    date: "September 12, 2025",
    title: "Annual Charity Gala",
    blurb:
      "From a passionate presenter to a professional host, my journey has been filled with excitement and learning. Discover how I reached this stage.",
    img: "/assets/s3.jpg",
    alt: "Stage photo",
  },
}: {
  event?: FeaturedEvent;
}) {
  const [firstWord, ...rest] = event.title.split(" ");
  const restTitle = rest.join(" ");

  return (
    <section className='mx-auto max-w-6xl lg:mt-[60px] mt-[30px]'>
      {/* ----------------------- MOBILE (zig-zag added) ----------------------- */}
      <div className='lg:hidden'>
        <div className='mx-auto w-[360px]'>
          <div className='relative flex h-[244px] overflow-hidden rounded-[16px] shadow-[0_14px_28px_rgba(0,0,0,.35)] ring-1 ring-white/10'>
            {/* Left cyan panel 115×244 — slide from LEFT */}
            <motion.aside
              initial={{ opacity: 0, x: -32, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 16,
                mass: 0.6,
              }}
              className='flex h-[244px] w-[115px] items-center bg-[#00D8FF] px-4'
            >
              <div className='flex h-[212px] w-[83px] flex-col items-start justify-center gap-[6px]'>
                <p className='elza w-[83px] text-[10px] leading-3 text-[#0B0F1A]/80'>
                  {event.date}
                </p>
                <h3 className='recoleta w-[83px] text-[12px] font-extrabold leading-4 text-[#0B0F1A]'>
                  {firstWord}
                  <br />
                  {restTitle}
                </h3>
                <p className='elza w-[83px] text-[10px] leading-3 text-[#0B0F1A]/90'>
                  {event.blurb}
                </p>
              </div>
            </motion.aside>

            {/* Right image 245×244 — slide from RIGHT */}
            <motion.div
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
              className='relative h-[244px] w-[245px]'
            >
              <Image
                src={event.img}
                alt={event.alt || event.title}
                fill
                className='object-cover'
                sizes='360px'
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ----------------------- DESKTOP / LG (unchanged) ----------------------- */}
      <div className='hidden lg:block'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_360px]'>
          <motion.article
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.35 }}
            variants={slideIn("left")}
            className='relative aspect-video w-full h-[540px] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_18px_40px_rgba(0,0,0,.45)]'
          >
            <Image
              src={event.img}
              alt={event.alt || event.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) calc(100vw - 2rem), 740px'
            />
          </motion.article>

          <motion.aside
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.35 }}
            variants={slideIn("right")}
            transition={{ delay: 0.05 }}
            className='relative rounded-[28px] bg-[#00D8FF] ring-1 ring-black/10 shadow-[0_14px_32px_rgba(0,0,0,.25)] items-center justify-center flex'
          >
            <div className='px-6 md:px-7 py-7 min-h-[360px] sm:min-h-[420px] grid place-items-center'>
              <div className='max-w-[260px] space-y-3'>
                <p className='elza text-[14px] font-medium leading-none text-[#0B0F1A]/80'>
                  {event.date}
                </p>
                <h3 className='recoleta text-[24px] leading-[1.15] font-extrabold text-[#0B0F1A]'>
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
    </section>
  );
}
