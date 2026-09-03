import { projectOgImage, OG_SIZE } from "@/lib/og/project-card";
import { detailProjects, projectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";

export const alt = "Estudo de caso — João Romão";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return detailProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  return projectOgImage(project, "pt");
}
