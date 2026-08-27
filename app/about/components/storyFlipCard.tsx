"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type StoryFlipCardProps = {
  img: string;
  alt?: string;
  month: string;
  year: string;
  caption: string;
  reverse?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export default function StoryFlipCard({
  img,
  alt,
  month,
  year,
  caption,
  reverse = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: StoryFlipCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );
  const [mobileFlipped, setMobileFlipped] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMobileFlipped(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMobileFlipped(entry.intersectionRatio >= 0.55);
      },
      {
        threshold: [0, 0.55, 1],
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  const dateBlock = (
    <div
      className={`recoleta w-[8.5rem] shrink-0 leading-[1.05] text-white ${
        reverse ? "text-left" : "text-right"
      }`}
    >
      <div className="text-[24px] md:text-[38px]">{month}</div>
      <div className="text-[24px] md:text-[38px]">{year}</div>
    </div>
  );

  const fullText = (
    <p
      className={`elza text-[13px] leading-6 text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,.75)] md:text-[16px] ${
        reverse ? "text-left" : "text-right"
      }`}
    >
      {caption}
    </p>
  );

  return (
    <div
      ref={rootRef}
      className={`group relative h-full w-full rounded-[inherit] [perspective:1600px] ${className}`}
      tabIndex={0}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] ${
          isMobile
            ? mobileFlipped
              ? "[transform:rotateY(180deg)]"
              : "[transform:rotateY(0deg)]"
            : "group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]"
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden]">
          <Image
            src={img}
            alt={alt || "Story"}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:blur-[2px] group-focus:scale-105 group-focus:blur-[2px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(95%_75%_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_55%,rgba(0,0,0,.62)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
            {dateBlock}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Image
            src={img}
            alt={alt || "Story"}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover scale-110 blur-md brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.78),rgba(0,0,0,.42))] backdrop-blur-[4px]" />
          <div className="relative z-10 flex h-full items-end p-5 md:p-6">
            <div className="w-full max-h-[11rem] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,.35)_transparent]">
              {fullText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
