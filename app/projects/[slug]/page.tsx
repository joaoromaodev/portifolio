import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { projectMetadata } from "@/lib/i18n/project-metadata";
import { detailProjects, hasDetailPage, projectBySlug } from "@/lib/projects";

// Only projects with something extra to show get a page (see hasDetailPage),
// and any other slug 404s rather than rendering a thin stub.
export const dynamicParams = false;

export function generateStaticParams() {
  return detailProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return projectMetadata(project, "en");
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasDetailPage(project)) notFound();
  return <ProjectDetail project={project} locale="en" />;
}
