"use client";

import Link from "next/link";
import type { BannerApi } from "../page";

type Props = {
  banner?: BannerApi | null;
};

export default function AboutBanner({ banner }: Props) {
  const mobileImage = banner?.mobileImage || "/assets/aboutBanner.png";
  const desktopImage = banner?.desktopImage || "/assets/aboutBannerD.png";

  const kicker =
    banner?.kicker ||
    "From the classrooms of IBA to the bright lights of the stage and screen.";
  const title = banner?.title || "RAFSAN SABAB";
  const ctaLabel = banner?.ctaLabel || "Host | Content Creator | Storyteller";
  const ctaHref = banner?.ctaHref || "/about";

  const bgMobile =
    mobileImage && mobileImage.trim().length > 0
      ? mobileImage
      : "/assets/aboutBanner.png";

  const bgDesktop =
    desktopImage && desktopImage.trim().length > 0
      ? desktopImage
      : "/assets/aboutBannerD.png";

  return (
    <section className='relative isolate overflow-hidden'>
      <div
        className='absolute inset-0 -z-10 bg-[#121212] bg-cover bg-no-repeat lg:hidden [background-position:60%_top] md:[background-position:60%_15%]'
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.45) 80%, rgba(0,0,0,.88) 100%),
            url('${bgMobile}')
          `,
        }}
      />

      <div
        className='absolute inset-0 -z-10 hidden bg-[#121212] bg-cover bg-no-repeat lg:block [background-position:60%_42%]'
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.45) 80%, rgba(0,0,0,.88) 100%),
            url('${bgDesktop}')
          `,
        }}
      />

      <div className='site-shell-wide relative flex min-h-[calc(100svh-64px)] items-end py-12 text-center sm:py-16 lg:min-h-[calc(100svh-72px)] lg:items-center lg:py-24'>
        <div className='mx-auto flex max-w-[68rem] flex-col items-center gap-4 sm:gap-6 lg:gap-8'>
          <p className='elza max-w-[50rem] text-sm leading-6 text-white/90 sm:text-base lg:text-xl lg:leading-8'>
            {kicker}
          </p>

          <h1 className='recoleta text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] tracking-tight text-white drop-shadow-[0_8px_26px_rgba(0,0,0,.35)]'>
            {title}
          </h1>

          <Link
            href={ctaHref}
            className='elza inline-flex min-h-12 max-w-full items-center justify-center rounded-2xl bg-[#00D8FF] px-5 py-3 text-center text-sm font-bold text-[#121212] shadow-[0_10px_28px_rgba(0,216,255,.28)] transition hover:brightness-95 sm:min-h-14 sm:px-8 sm:text-base lg:min-h-16 lg:min-w-[28rem] lg:text-xl'
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px border-t border-black/10' />
    </section>
  );
}
