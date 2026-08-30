import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { localeMetadata } from "@/lib/i18n/metadata";

export const metadata: Metadata = localeMetadata("pt");

export default function HomePt() {
  return <SiteShell locale="pt" />;
}
