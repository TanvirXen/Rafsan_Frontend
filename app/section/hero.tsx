"use client";

import Link from "next/link";

type HeroProps = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
};

export default function Hero(props: HeroProps) {
  const title = props.title || "Hey There!";
  const subtitle = props.subtitle || "";
  const description =
    props.description ||
    `I'm the guy who hosts shows, makes people laugh, and turns
regular ideas into conversations you won't forget. I dive into
everything from corporate conferences and live events to my own hit
show, "What a Show." Enough talk, let's get to work.`;

  const bgImage =
    props.image && props.image.trim().length > 0
      ? props.image
      : "/assets/hero.png";

  return (
    <section className='relative isolate overflow-hidden'>
      <div
        className='absolute inset-0 -z-10 bg-[#2D1B59] bg-cover bg-no-repeat [background-position:60%_top] md:[background-position:60%_18%] lg:[background-position:60%_35%]'
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(45,27,89,0.08) 0%, rgba(18,18,18,0.42) 58%, #121212 100%),
            url('${bgImage}')
          `,
        }}
      />
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_22%_22%,rgba(0,216,255,.12)_0%,rgba(0,0,0,0)_70%)]' />

      <div className='site-shell-wide relative flex min-h-[calc(100svh-64px)] items-end py-10 sm:py-14 lg:min-h-[calc(100svh-72px)] lg:items-center lg:py-20'>
        <div className='max-w-[36rem] space-y-4 sm:space-y-5 lg:space-y-6'>
          <h1 className='recoleta text-[clamp(2.25rem,6vw,3.5rem)] leading-[0.95] text-white'>
            {title}
          </h1>

          {subtitle && (
            <p className='elza max-w-[34rem] text-sm leading-6 text-white/75 sm:text-[15px] lg:text-base'>
              {subtitle}
            </p>
          )}

          <p className='elza max-w-[34rem] text-[15px] leading-6 text-white/92 sm:text-base lg:text-lg lg:leading-7'>
            {description}
          </p>

          <div className='flex w-full max-w-[32rem] flex-col gap-3 pt-1 sm:flex-row'>
            <Link
              href='/connect'
              className='elza inline-flex h-11 items-center justify-center rounded-full border border-white/80 px-6 text-sm font-bold text-white transition hover:bg-white/8 sm:h-12 sm:flex-1 sm:text-base'
            >
              Connect
            </Link>

            <Link
              href='/explore-shows'
              className='elza inline-flex h-11 items-center justify-center rounded-full bg-[#00D8FF] px-6 text-sm font-bold text-[#121212] shadow-[0_12px_32px_rgba(0,216,255,.24)] transition hover:brightness-95 sm:h-12 sm:flex-1 sm:text-base'
            >
              Watch Shows
            </Link>
          </div>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10' />
    </section>
  );
}
