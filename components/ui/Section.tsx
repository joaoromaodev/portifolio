"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { stagger, inView } from "@/lib/motion";

// Consistent section spacing + a staggered reveal container.
export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={stagger}
      {...inView}
      className={`mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28 ${className}`}
    >
      {children}
    </motion.section>
  );
}
