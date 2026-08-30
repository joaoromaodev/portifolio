// Admin API for the project catalogue — DEVELOPMENT ONLY.
//
// The panel writes content/projects.json on the local filesystem; you then
// commit the change and Vercel publishes it. In production this handler does
// not exist: every method returns 404, so the deployed site has no write
// endpoint and no auth surface to get wrong.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { normalizeProject, type Project } from "@/lib/projects";

const IS_DEV = process.env.NODE_ENV !== "production";
const FILE = path.join(process.cwd(), "content", "projects.json");

const notFound = () =>
  NextResponse.json({ error: "Not found" }, { status: 404 });

async function readProjects(): Promise<Project[]> {
  const raw = JSON.parse(await readFile(FILE, "utf8"));
  const list: unknown[] = Array.isArray(raw?.projects) ? raw.projects : [];
  return list.map((p, i) => normalizeProject(p, i));
}

export async function GET() {
  if (!IS_DEV) return notFound();
  try {
    return NextResponse.json({ projects: await readProjects() });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not read projects.json: ${(err as Error).message}` },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  if (!IS_DEV) return notFound();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const incoming = (body as { projects?: unknown })?.projects;
  if (!Array.isArray(incoming)) {
    return NextResponse.json(
      { error: "Body must be { projects: [...] }." },
      { status: 400 },
    );
  }

  // Re-key order from array position so the panel's list order is the source
  // of truth, and reject duplicate slugs (they'd collide as React keys and in
  // any future per-project route).
  const projects = incoming.map((p, i) => ({
    ...normalizeProject(p, i),
    order: i + 1,
  }));

  const seen = new Set<string>();
  for (const p of projects) {
    if (!p.title.trim()) {
      return NextResponse.json(
        { error: `Project "${p.slug}" needs a title.` },
        { status: 400 },
      );
    }
    if (seen.has(p.slug)) {
      return NextResponse.json(
        { error: `Duplicate slug: "${p.slug}". Slugs must be unique.` },
        { status: 400 },
      );
    }
    seen.add(p.slug);
  }

  try {
    // Strip undefined so optional fields disappear from the file instead of
    // being serialised, and keep the formatting git-diff friendly.
    const json = JSON.stringify(
      { $schema: "./projects.schema.json", projects },
      null,
      2,
    );
    await writeFile(FILE, `${json}\n`, "utf8");
    return NextResponse.json({ ok: true, count: projects.length });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not write projects.json: ${(err as Error).message}` },
      { status: 500 },
    );
  }
}
