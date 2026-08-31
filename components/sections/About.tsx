"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function About() {
  const { dict } = useI18n();
  const about = dict.about;

  return (
    <Section id="about">
      <SectionHeader id={about.slug} title={about.title} />

      <motion.div
        variants={fadeUp}
        className="max-w-2xl space-y-4 text-[17px] leading-relaxed text-fg/90"
      >
        {about.paragraphs.map((p, i) => (
          <p key={i}>{typeof p === "string" ? p : <Rich segments={p} />}</p>
        ))}
      </motion.div>

      {/* A quiet footnote, not a sidebar — a short tag list never balances a
          5-paragraph essay in a boxed 2-column layout, so it doesn't try. */}
      <motion.div variants={fadeUp} className="mt-8 max-w-2xl border-t border-border pt-6">
        <p className="font-mono text-sm text-comment">{`// ${about.beyondCodeLabel}`}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {about.beyondCode.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-xs text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}

// A paragraph that carries a link is authored as segments instead of one
// string, because the anchor sits mid-sentence and the sentence is different
// in each language — splitting on a marker would tie the two dictionaries to
// the same word order.
function Rich({
  segments,
}: {
  segments: readonly (string | { text: string; href: string })[];
}) {
  return (
    <>
      {segments.map((s, i) =>
        typeof s === "string" ? (
          s
        ) : (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-green underline decoration-green/40 underline-offset-4 transition-colors hover:decoration-green"
          >
            {s.text}
          </a>
        ),
      )}
    </>
  );
}
