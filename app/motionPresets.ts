// app/motionPresets.ts
import type { Variants } from "framer-motion";

export type Dir = "left" | "right";

// Fade-and-rise. Sliding in from the sides (the old behaviour) made pages
// with many alternating blocks feel like they were shaking while scrolling
// on mobile. `from` is kept so existing call sites don't need to change.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const slideIn = (_from: Dir): Variants => ({
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18, mass: 0.6 },
  },
});
