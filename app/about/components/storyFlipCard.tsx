"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type MobileCardEntry = {
  element: HTMLDivElement;
  setCentered: (centered: boolean) => void;
};

const mobileCards = new Map<string, MobileCardEntry>();
let centerUpdateFrame: number | null = null;
let centeredCardId: string | null = null;

function updateCenteredCard() {
  centerUpdateFrame = null;
  if (typeof window === "undefined" || !window.matchMedia("(max-width: 768px)").matches) {
    centeredCardId = null;
    mobileCards.forEach(({ setCentered }) => setCentered(false));
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  let nearestId: string | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  mobileCards.forEach(({ element }, id) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
    const distance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestId = id;
    }
  });

  if (nearestId === centeredCardId) return;
  centeredCardId = nearestId;
  mobileCards.forEach(({ setCentered }, id) => setCentered(id === nearestId));
}

function scheduleCenterUpdate() {
  if (centerUpdateFrame !== null || typeof window === "undefined") return;
  centerUpdateFrame = window.requestAnimationFrame(updateCenteredCard);
}

function registerMobileCard(id: string, entry: MobileCardEntry) {
  mobileCards.set(id, entry);
  scheduleCenterUpdate();
}

function unregisterMobileCard(id: string) {
  mobileCards.delete(id);
  if (centeredCardId === id) centeredCardId = null;
  scheduleCenterUpdate();
}

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
  const cardId = useRef(`story-card-${Math.random().toString(36).slice(2)}`).current;
  // Starts false so the server and the first client render agree; the effect
  // below corrects it immediately after mount.
  const [isMobile, setIsMobile] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [mobileFlipped, setMobileFlipped] = useState(false);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMobileFlipped(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile || !rootRef.current) return;

    registerMobileCard(cardId, {
      element: rootRef.current,
      setCentered: setIsCentered,
    });
    window.addEventListener("scroll", scheduleCenterUpdate, { passive: true });
    window.addEventListener("resize", scheduleCenterUpdate);

    return () => {
      unregisterMobileCard(cardId);
      window.removeEventListener("scroll", scheduleCenterUpdate);
      window.removeEventListener("resize", scheduleCenterUpdate);
    };
  }, [cardId, isMobile]);

  /**
   * Set once the reader taps a card, so scrolling does not immediately undo
   * their choice. Cleared when the card leaves the viewport, which lets the
   * scroll-driven flip take over again on the next pass.
   */
  const tapped = useRef(false);

  useEffect(() => {
    if (!isMobile) return;

    if (flipTimer.current) clearTimeout(flipTimer.current);
    tapped.current = false;

    if (!isCentered) {
      setMobileFlipped(false);
      return;
    }

    flipTimer.current = setTimeout(() => {
      if (!tapped.current) setMobileFlipped(true);
      flipTimer.current = null;
    }, 1500);

    return () => {
      if (flipTimer.current) {
        clearTimeout(flipTimer.current);
        flipTimer.current = null;
      }
    };
  }, [isCentered, isMobile]);

  const toggleFlip = () => {
    if (!isMobile) return;
    tapped.current = true;
    setMobileFlipped((f) => !f);
  };

  const dateBlock = (
    <div
      className={`recoleta w-auto max-w-full shrink-0 leading-[1.05] text-white md:w-[8.5rem] ${
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

  /*
   * WebKit ignores the unprefixed backface-visibility once a face contains a
   * filter (the back has a backdrop-blur), so the hidden front face bleeds
   * through mirrored on iOS. The prefix plus an opacity fallback, swapped at
   * the midpoint of the flip, keeps exactly one face visible everywhere.
   */
  const faceBase =
    "absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] transition-opacity duration-0 delay-[350ms]";

  const frontFade = isMobile
    ? mobileFlipped
      ? "opacity-0"
      : "opacity-100"
    : "group-hover:opacity-0 group-focus:opacity-0";

  const backFade = isMobile
    ? mobileFlipped
      ? "opacity-100"
      : "opacity-0"
    : "opacity-0 group-hover:opacity-100 group-focus:opacity-100";

  return (
    <div
      ref={rootRef}
      className={`group relative h-full w-full rounded-[inherit] [perspective:1600px] ${className}`}
      tabIndex={0}
      role={isMobile ? "button" : undefined}
      aria-pressed={isMobile ? mobileFlipped : undefined}
      aria-label={isMobile ? `${month} ${year} — show story` : undefined}
      onClick={toggleFlip}
      onKeyDown={(e) => {
        if (!isMobile) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFlip();
        }
      }}
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
        <div className={`${faceBase} ${frontFade} [transform:translateZ(1px)]`}>
          <Image
            src={img}
            alt={alt || "Story"}
            fill
            priority={priority}
            sizes={sizes}
            /*
             * Desktop-only affordance. Tapping the card focuses it, and the
             * focus outlives the tap, so on touch the blur stayed on the front
             * image after flipping back. md matches the mobile media query.
             */
            className="object-cover transition duration-700 ease-out md:group-hover:scale-105 md:group-hover:blur-[2px] md:group-focus:scale-105 md:group-focus:blur-[2px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(95%_75%_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_55%,rgba(0,0,0,.62)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
            {dateBlock}
          </div>
        </div>

        {/* Back */}
        <div className={`${faceBase} ${backFade} [transform:rotateY(180deg)]`}>
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
