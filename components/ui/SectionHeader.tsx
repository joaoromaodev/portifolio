"use client";

import { motion } from "framer-motion";
import { fadeUp, inView } from "@/lib/motion";

// Comment-style section header: "// about" (DESIGN.md §10).
export function SectionHeader({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.header
      variants={fadeUp}
      {...inView}
      className="mb-8 md:mb-10"
    >
      <p className="font-mono text-sm text-comment">{`// ${id}`}</p>
      <h2 className="mt-1 font-mono text-2xl font-semibold tracking-tight text-fg md:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>
      ) : null}
    </motion.header>
  );
}
