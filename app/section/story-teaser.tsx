"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type StoryTeaserProps = {
  title?: string;
  description?: string;
  image?: string;
};

export default function StoryTeaser({
  title,
  description,
  image,
}: StoryTeaserProps) {
  const fallbackTitle = "Host | Content Creator | Storyteller";
  const headingSource = title || fallbackTitle;
  const headingParts = headingSource.split("|");

  const fallbackDescription =
    "I've gone from cracking jokes on tiny screens to hosting shows for thousands. It hasn't always been pretty, but it's been a journey. Learn more about the story of how it all came together.";

  const bodyText = description || fallbackDescription;
  const imgSrc = image || "/assets/story.jpg";

  return (
    <section className='site-shell mt-8 pb-12'>
      <div className='mx-auto w-full max-w-[1100px]'>
        <div className='grid items-center gap-8 rounded-[28px] border-2 border-[#00D8FF] p-6 sm:p-8 md:grid-cols-[minmax(0,240px)_1fr] lg:grid-cols-[minmax(0,300px)_1fr] lg:p-12'>
          <div className='justify-self-center md:justify-self-start'>
            <div className='relative h-36 w-36 overflow-hidden rounded-full ring-1 ring-white/10 shadow-[0_16px_36px_rgba(0,0,0,.45)] sm:h-44 sm:w-44 md:h-[240px] md:w-[240px] lg:h-[300px] lg:w-[300px]'>
              <Image
                src={imgSrc}
                alt='On stage portrait'
                fill
                className='object-cover'
                sizes='(max-width: 640px) 144px, (max-width: 1024px) 240px, 300px'
                priority
              />
              <div
                aria-hidden
                className='absolute inset-0 rounded-full bg-gradient-to-b from-black/10 via-transparent to-[#121212]'
              />
            </div>
          </div>

          <div className='min-w-0 text-center md:text-left'>
            <h3 className='text-[20px] leading-7 text-[#00D8FF] sm:text-[24px] sm:leading-8 lg:text-[28px] lg:leading-9'>
              {headingParts.map((part, idx) => (
                <React.Fragment key={idx}>
                  <span className='recoleta'>{part.trim()}</span>
                  {idx < headingParts.length - 1 && (
                    <span className='mx-2 elza align-middle text-white/65'>|</span>
                  )}
                </React.Fragment>
              ))}
            </h3>

            <p className='elza mt-4 max-w-[40rem] text-[15px] leading-7 text-white sm:text-base'>
              {bodyText}
            </p>

            <Link
              href='/about'
              className='elza mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#FFD928] px-6 text-[15px] font-bold text-black transition hover:brightness-95 sm:h-12 sm:text-base'
            >
              Full Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
