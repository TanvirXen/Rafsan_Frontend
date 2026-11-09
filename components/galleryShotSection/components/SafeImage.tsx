"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image that never shows a broken-image icon. If the optimised version
 * fails, it retries the original file once; if that fails too, it renders
 * nothing so the card stays clean instead of showing the alt text.
 */
export default function SafeImage(props: ImageProps) {
  const [attempt, setAttempt] = useState<0 | 1 | 2>(0);

  if (!props.src || attempt === 2) return null;

  return (
    <Image
      {...props}
      alt={props.alt}
      unoptimized={attempt === 1 || props.unoptimized}
      onError={() => setAttempt((a) => (a === 0 ? 1 : 2))}
    />
  );
}
