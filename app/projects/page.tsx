import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { projectsIndexMetadata } from "@/lib/i18n/index-metadata";

export const metadata: Metadata = projectsIndexMetadata("en");

export default function ProjectsIndexPage() {
  return <ProjectsIndex locale="en" />;
}
