"use client";

import Image from "next/image";
import Link from "next/link";

type Logo = {
  src: string;
  alt: string;
  shape?: "circle" | "square";
  href?: string; // ✅ make tiles clickable when provided
};

const DEFAULT_LOGOS: Logo[] = [
  { src: "/assets/image.png", alt: "Partner 1", shape: "circle" },
  { src: "/assets/image.png", alt: "Partner 2", shape: "circle" },
  { src: "/assets/image.png", alt: "Partner 3", shape: "square" },
  { src: "/assets/image.png", alt: "Partner 4", shape: "circle" },
  { src: "/assets/image.png", alt: "Partner 5", shape: "square" },
];

function Tile({ logo }: { logo: Logo }) {
  const inner = (
    <figure className='relative flex h-[84px] w-[84px] items-center justify-center rounded-xl'>
      <div
        className={[
          "relative overflow-hidden bg-white/10",
          logo.shape === "square"
            ? "h-[58px] w-[58px] rounded-md"
            : "h-16 w-16 rounded-full",
        ].join(" ")}
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          fill
          sizes='84px'
          className='object-contain'
        />
      </div>
    </figure>
  );

  // ✅ clickable when href is present
  if (logo.href) {
    return (
      <Link
        href={logo.href}
        target='_blank'
        rel='noopener noreferrer'
        className='transition-transform hover:scale-105 focus:scale-105'
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function Collaboration({
  logos = DEFAULT_LOGOS,
  title = "In Collaboration With",
}: {
  logos?: Logo[];
  title?: string;
}) {
  return (
    <section className='mx-auto mt-[60px] max-w-6xl px-6 text-white'>
      <h2 className='recoleta mb-10 text-center text-[32px] leading-tight md:mb-[60px] md:text-[32px]'>
        {title}
      </h2>

      {/* ✅ Always centered, any count: flex-wrap + justify-center */}
      <div
        aria-label='Partner logos'
        className='mx-auto flex max-w-full flex-wrap items-center justify-center gap-6 md:gap-10'
      >
        {logos.map((l, i) => (
          <Tile key={i} logo={l} />
        ))}
      </div>

      <div className='mx-auto mt-14 h-0.5 w-[520px] max-w-full rounded-full bg-[linear-gradient(90deg,transparent,#00D8FF_50%,transparent)]' />
    </section>
  );
}
