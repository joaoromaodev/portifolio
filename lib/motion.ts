// One easing curve + one duration scale for the whole site (DESIGN.md §9).
import type { Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const; // soft, confident ease-out

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

// Parent that staggers its children's `fadeUp` reveals.
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Shared props for scroll-triggered reveals.
export const inView = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-80px" },
} as const;
