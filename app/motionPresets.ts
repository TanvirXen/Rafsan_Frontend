// app/motionPresets.ts
import type { Variants } from "framer-motion";

export type Dir = "left" | "right";

export const slideIn = (from: Dir): Variants => ({
  hidden: { opacity: 0, x: from === "left" ? -40 : 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 60, damping: 12, mass: 0.6 },
  },
});
