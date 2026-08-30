import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { projectsIndexMetadata } from "@/lib/i18n/index-metadata";

export const metadata: Metadata = projectsIndexMetadata("pt");

export default function ProjectsIndexPagePt() {
  return <ProjectsIndex locale="pt" />;
}
