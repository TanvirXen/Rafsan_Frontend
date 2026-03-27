"use client";

import Image from "next/image";

export default function GalleryBanner({
  title,
  subtitle,
  src,
  alt,
}: {
  title: string;
  subtitle: string;
  src: string;
  alt: string;
}) {
  return (
    <section className='relative isolate overflow-hidden'>
      <div className='absolute inset-0 -z-10'>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes='(max-width: 768px) calc(100vw - 1px), calc(100vw - 15px)'
          className='object-cover object-center'
        />
      </div>

      <div className='absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_25%,rgba(0,216,255,.22)_0%,rgba(0,0,0,0)_60%)]' />
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.88)_0%,rgba(0,0,0,.72)_28%,rgba(153,0,255,.28)_60%,rgba(0,0,0,.18)_100%)]' />
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,.12)_0%,rgba(0,0,0,.10)_35%,rgba(0,0,0,.55)_75%,rgba(0,0,0,.92)_100%)]' />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.14] mix-blend-overlay [background-image:url('/assets/grain.png')]" />

      <div className='site-shell relative flex min-h-[calc(100svh-64px)] items-end py-12 lg:min-h-[calc(100svh-72px)] lg:items-center lg:py-16'>
        <div className='max-w-[42rem]'>
          <div className='mb-3 flex items-center gap-3'>
            <span className='h-8 w-1 rounded bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.55)]' />
            <h1 className='recoleta text-[clamp(2rem,6vw,4rem)] font-bold leading-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,.55)]'>
              {title}
            </h1>
          </div>

          <p className='elza max-w-[34rem] text-sm leading-6 text-white/85 drop-shadow-[0_10px_28px_rgba(0,0,0,.55)] sm:text-base lg:text-xl lg:leading-8'>
            {subtitle}
          </p>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10' />
    </section>
  );
}
