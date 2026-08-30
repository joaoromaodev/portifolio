"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FLAGS, flagColor, type Project, type ProjectLink } from "@/lib/projects";
import type { LocalizedText } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/dictionaries/en";

// The panel itself is an English-only dev tool; only the *content* it edits is
// bilingual. Flag labels are borrowed from the English dictionary so the badge
// wording here matches what the site renders.
const FLAG_LABEL = en.projects.flags;

// Local project manager. Loads content/projects.json, edits it in a
// master-detail layout, and writes it back through /api/admin/projects.
// Everything here runs on the dev server only.

const EMPTY: Project = {
  slug: "",
  title: "",
  kicker: { en: "" },
  flag: "side",
  featured: false,
  published: true,
  order: 0,
  summary: { en: "" },
  problem: { en: "" },
  solution: { en: "" },
  impact: undefined,
  stack: [],
  links: [],
};

/** A project is "translated" once every field it actually uses has Portuguese. */
function missingPortuguese(p: Project): number {
  const fields: (LocalizedText | undefined)[] = [
    p.kicker,
    p.summary,
    p.problem,
    p.solution,
    p.impact,
    p.privateNote,
    p.imageAlt,
  ];
  return fields.filter((f) => f?.en?.trim() && !f.pt?.trim()).length;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (Diárias -> diarias)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminClient() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setProjects(d.projects);
        setSelected(d.projects[0]?.slug ?? null);
      })
      .catch((e: Error) => setStatus({ kind: "err", text: e.message }));
  }, []);

  // Guard against closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const current = useMemo(
    () => projects?.find((p) => p.slug === selected) ?? null,
    [projects, selected],
  );

  const mutate = useCallback((next: Project[]) => {
    setProjects(next);
    setDirty(true);
    setStatus(null);
  }, []);

  const patch = useCallback(
    (changes: Partial<Project>) => {
      if (!projects || !selected) return;
      mutate(
        projects.map((p) => (p.slug === selected ? { ...p, ...changes } : p)),
      );
      if (changes.slug && changes.slug !== selected) setSelected(changes.slug);
    },
    [projects, selected, mutate],
  );

  const save = useCallback(async () => {
    if (!projects || saving) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      setDirty(false);
      setStatus({
        kind: "ok",
        text: `Saved ${json.count} projects to content/projects.json - commit the file to publish.`,
      });
    } catch (e) {
      setStatus({ kind: "err", text: (e as Error).message });
    } finally {
      setSaving(false);
    }
  }, [projects, saving]);

  // Cmd/Ctrl+S saves, like any editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const addProject = () => {
    if (!projects) return;
    let slug = "new-project";
    let n = 2;
    while (projects.some((p) => p.slug === slug)) slug = `new-project-${n++}`;
    const next: Project = { ...EMPTY, slug, title: "New project", published: false };
    mutate([...projects, next]);
    setSelected(slug);
  };

  const removeProject = (slug: string) => {
    if (!projects) return;
    const p = projects.find((x) => x.slug === slug);
    if (!confirm(`Delete "${p?.title ?? slug}"? This cannot be undone here.`)) return;
    const next = projects.filter((x) => x.slug !== slug);
    mutate(next);
    if (selected === slug) setSelected(next[0]?.slug ?? null);
  };

  const move = (slug: string, delta: -1 | 1) => {
    if (!projects) return;
    const i = projects.findIndex((p) => p.slug === slug);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[i], next[j]] = [next[j], next[i]];
    mutate(next);
  };

  if (!projects) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 font-mono text-sm">
        {status ? (
          <p className="text-red">{status.text}</p>
        ) : (
          <p className="text-comment">Loading content/projects.json...</p>
        )}
      </main>
    );
  }

  const featuredCount = projects.filter((p) => p.featured && p.published).length;
  const untranslated = projects.filter(
    (p) => p.published && missingPortuguese(p) > 0,
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-mono text-lg font-semibold text-fg">
            <span className="text-comment">{"// "}</span>admin · projects
          </h1>
          <p className="mt-1 font-mono text-xs text-comment">
            Edits <span className="text-muted">content/projects.json</span>. Dev-only
            — commit the file to publish. {featuredCount} featured,{" "}
            {projects.length} total
            {untranslated > 0 ? (
              <>
                ,{" "}
                <span className="text-amber">
                  {untranslated} missing Portuguese
                </span>
              </>
            ) : null}
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dirty ? (
            <span className="font-mono text-xs text-amber">● unsaved</span>
          ) : null}
          <Link
            href="/"
            className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            view site ↗
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="rounded-lg border border-green/40 px-4 py-2 font-mono text-xs text-green transition-colors hover:bg-green/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "saving..." : "save"}
          </button>
        </div>
      </header>

      {status ? (
        <p
          role="status"
          className={`mb-5 rounded-lg border px-4 py-2.5 font-mono text-xs ${
            status.kind === "ok"
              ? "border-green/40 text-green"
              : "border-red/40 text-red"
          }`}
        >
          {status.text}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <ProjectList
          projects={projects}
          selected={selected}
          onSelect={setSelected}
          onMove={move}
          onDelete={removeProject}
          onToggle={(slug, key) =>
            mutate(
              projects.map((p) => (p.slug === slug ? { ...p, [key]: !p[key] } : p)),
            )
          }
          onAdd={addProject}
        />

        {current ? (
          <Editor
            key={current.slug}
            project={current}
            taken={projects.filter((p) => p.slug !== current.slug).map((p) => p.slug)}
            onChange={patch}
          />
        ) : (
          <p className="font-mono text-sm text-comment">
            No project selected. Add one to get started.
          </p>
        )}
      </div>
    </main>
  );
}

function ProjectList({
  projects,
  selected,
  onSelect,
  onMove,
  onDelete,
  onToggle,
  onAdd,
}: {
  projects: Project[];
  selected: string | null;
  onSelect: (slug: string) => void;
  onMove: (slug: string, delta: -1 | 1) => void;
  onDelete: (slug: string) => void;
  onToggle: (slug: string, key: "featured" | "published") => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs text-comment">{"// order = display order"}</p>

      <ul className="space-y-1.5">
        {projects.map((p, i) => {
          const active = p.slug === selected;
          return (
            <li key={p.slug}>
              <div
                className={`rounded-lg border bg-surface p-2.5 transition-colors ${
                  active ? "border-green/50" : "border-border"
                } ${p.published ? "" : "opacity-55"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-none flex-col">
                    <IconBtn
                      label={`Move ${p.title} up`}
                      disabled={i === 0}
                      onClick={() => onMove(p.slug, -1)}
                    >
                      ↑
                    </IconBtn>
                    <IconBtn
                      label={`Move ${p.title} down`}
                      disabled={i === projects.length - 1}
                      onClick={() => onMove(p.slug, 1)}
                    >
                      ↓
                    </IconBtn>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(p.slug)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate font-mono text-sm text-fg">
                      {p.title || "(untitled)"}
                    </span>
                    <span
                      className={`block truncate font-mono text-[10px] ${flagColor[p.flag]}`}
                    >
                      {FLAG_LABEL[p.flag]} · {p.slug}
                    </span>
                  </button>

                  {missingPortuguese(p) > 0 ? (
                    <span
                      title={`${missingPortuguese(p)} field(s) have no Portuguese — the site falls back to English there`}
                      className="flex-none font-mono text-[10px] text-amber"
                    >
                      pt {missingPortuguese(p)}
                    </span>
                  ) : null}

                  <div className="flex flex-none items-center gap-1">
                    <Toggle
                      on={p.featured}
                      onClick={() => onToggle(p.slug, "featured")}
                      title={
                        p.featured
                          ? "Featured - click to unfeature"
                          : "Not featured - click to feature"
                      }
                      onClass="border-amber/60 text-amber"
                    >
                      ★
                    </Toggle>
                    <Toggle
                      on={p.published}
                      onClick={() => onToggle(p.slug, "published")}
                      title={
                        p.published
                          ? "Published - click to make a draft"
                          : "Draft - click to publish"
                      }
                      onClass="border-green/60 text-green"
                    >
                      {p.published ? "◉" : "◌"}
                    </Toggle>
                    <IconBtn
                      label={`Delete ${p.title}`}
                      onClick={() => onDelete(p.slug)}
                      className="hover:border-red/50 hover:text-red"
                    >
                      ×
                    </IconBtn>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onAdd}
        className="w-full rounded-lg border border-dashed border-border py-2.5 font-mono text-xs text-muted transition-colors hover:border-green/40 hover:text-green"
      >
        + new project
      </button>

      <p className="pt-2 font-mono text-[11px] leading-relaxed text-comment">
        ★ featured = full-width case-study row. ◉ published / ◌ draft (kept in the
        file, hidden from the site).
      </p>
    </div>
  );
}

function Editor({
  project,
  taken,
  onChange,
}: {
  project: Project;
  taken: string[];
  onChange: (changes: Partial<Project>) => void;
}) {
  const slugClash = taken.includes(project.slug);
  const needsAlt = Boolean(project.image) && !project.imageAlt?.en?.trim();

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="title"
          value={project.title}
          onChange={(v) =>
            onChange(
              // Keep the slug in sync only while it is still the placeholder.
              project.slug.startsWith("new-project")
                ? { title: v, slug: slugify(v) || project.slug }
                : { title: v },
            )
          }
        />
        <Field
          label="slug"
          value={project.slug}
          onChange={(v) => onChange({ slug: slugify(v) })}
          hint={slugClash ? "already used by another project" : "url-safe id"}
          invalid={slugClash}
        />
      </div>

      <LocalizedField
        label="kicker"
        value={project.kicker}
        onChange={(v) => onChange({ kicker: v })}
        hint="one-line subtitle under the title"
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-comment">flag</span>
          <select
            value={project.flag}
            onChange={(e) => onChange({ flag: e.target.value as Project["flag"] })}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-fg"
          >
            {FLAGS.map((f) => (
              <option key={f} value={f}>
                {FLAG_LABEL[f]}
              </option>
            ))}
          </select>
        </label>

        <Check
          label="featured"
          checked={project.featured}
          onChange={(v) => onChange({ featured: v })}
        />
        <Check
          label="published"
          checked={project.published}
          onChange={(v) => onChange({ published: v })}
        />
      </div>

      <LocalizedArea
        label="summary"
        value={project.summary}
        onChange={(v) => onChange({ summary: v })}
        hint="the pitch, shown on every card"
      />
      <LocalizedArea
        label="problem"
        value={project.problem}
        onChange={(v) => onChange({ problem: v })}
        hint="featured cards only"
      />
      <LocalizedArea
        label="solution"
        value={project.solution}
        onChange={(v) => onChange({ solution: v })}
        hint="featured cards only"
      />
      <LocalizedArea
        label="impact"
        value={project.impact}
        onChange={(v) => onChange({ impact: v })}
        hint="optional, the result, highlighted"
        optional
      />

      <Field
        label="stack"
        value={project.stack.join(", ")}
        onChange={(v) =>
          onChange({
            stack: v
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        hint="comma-separated chips"
      />

      <LinkEditor links={project.links} onChange={(links) => onChange({ links })} />

      <LocalizedArea
        label="privateNote"
        value={project.privateNote}
        onChange={(v) => onChange({ privateNote: v })}
        hint="shown instead of a repo link when the code cannot be published"
        optional
      />

      <div>
        <Field
          label="image"
          value={project.image ?? ""}
          onChange={(v) => onChange({ image: v || undefined })}
          hint="e.g. /projects/simf.png (file goes in public/projects/)"
        />
      </div>

      <LocalizedField
        label="imageAlt"
        value={project.imageAlt}
        onChange={(v) => onChange({ imageAlt: v })}
        hint={needsAlt ? "required when an image is set" : "describes the screenshot"}
        invalid={needsAlt}
        optional
      />
    </div>
  );
}

function LinkEditor({
  links,
  onChange,
}: {
  links: ProjectLink[];
  onChange: (links: ProjectLink[]) => void;
}) {
  const set = (i: number, changes: Partial<ProjectLink>) =>
    onChange(links.map((l, j) => (i === j ? { ...l, ...changes } : l)));

  return (
    <div>
      <span className="mb-1.5 block font-mono text-xs text-comment">links</span>
      <div className="space-y-2">
        {links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={l.label}
              placeholder="GitHub"
              aria-label={`Link ${i + 1} label`}
              onChange={(e) => set(i, { label: e.target.value })}
              className="w-32 flex-none rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-fg placeholder:text-comment"
            />
            <input
              value={l.href}
              placeholder="https://..."
              aria-label={`Link ${i + 1} URL`}
              onChange={(e) => set(i, { href: e.target.value })}
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-fg placeholder:text-comment"
            />
            <IconBtn
              label={`Remove link ${l.label || i + 1}`}
              onClick={() => onChange(links.filter((_, j) => j !== i))}
              className="hover:border-red/50 hover:text-red"
            >
              ×
            </IconBtn>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...links, { label: "", href: "" }])}
          className="rounded-lg border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-green/40 hover:text-green"
        >
          + link
        </button>
      </div>
      <p className="mt-1 font-mono text-[10px] text-comment">
        Empty rows are dropped on save.
      </p>
    </div>
  );
}

/* -- bilingual fields ----------------------------------------------------- */

// English is the required side; Portuguese is optional and falls back to it at
// render time (lib/projects.ts). That's deliberate — a project can be added in
// one language and translated later without the /pt page showing a gap.
function LocaleRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1.5 block font-mono text-xs text-comment">
        {label}
        {hint ? <span className="ml-2 text-[10px]">- {hint}</span> : null}
      </span>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function localeTag(lang: "en" | "pt", filled: boolean, fallback: boolean) {
  const tone = filled
    ? "text-green"
    : fallback
      ? "text-amber"
      : "text-comment";
  return (
    <span className={`font-mono text-[10px] ${tone}`}>
      {lang.toUpperCase()}
      {!filled && fallback ? " · falls back to EN" : ""}
    </span>
  );
}

function LocalizedField({
  label,
  value,
  onChange,
  hint,
  invalid = false,
  optional = false,
}: {
  label: string;
  value: LocalizedText | undefined;
  onChange: (v: LocalizedText | undefined) => void;
  hint?: string;
  invalid?: boolean;
  optional?: boolean;
}) {
  const v = value ?? { en: "" };
  const set = (patch: Partial<LocalizedText>) => {
    const next = { ...v, ...patch };
    const empty = !next.en?.trim() && !next.pt?.trim();
    onChange(optional && empty ? undefined : next);
  };

  return (
    <LocaleRow label={label} hint={hint}>
      <label className="block">
        {localeTag("en", Boolean(v.en?.trim()), false)}
        <input
          value={v.en ?? ""}
          onChange={(e) => set({ en: e.target.value })}
          aria-label={`${label} (English)`}
          aria-invalid={invalid || undefined}
          className={`mt-1 ${inputClass} ${invalid ? "border-red/60" : "border-border"}`}
        />
      </label>
      <label className="block">
        {localeTag("pt", Boolean(v.pt?.trim()), Boolean(v.en?.trim()))}
        <input
          value={v.pt ?? ""}
          onChange={(e) => set({ pt: e.target.value })}
          aria-label={`${label} (Portuguese)`}
          className={`mt-1 ${inputClass} border-border`}
        />
      </label>
    </LocaleRow>
  );
}

function LocalizedArea({
  label,
  value,
  onChange,
  hint,
  optional = false,
}: {
  label: string;
  value: LocalizedText | undefined;
  onChange: (v: LocalizedText | undefined) => void;
  hint?: string;
  optional?: boolean;
}) {
  const v = value ?? { en: "" };
  const set = (patch: Partial<LocalizedText>) => {
    const next = { ...v, ...patch };
    const empty = !next.en?.trim() && !next.pt?.trim();
    onChange(optional && empty ? undefined : next);
  };

  return (
    <LocaleRow label={label} hint={hint}>
      <label className="block">
        {localeTag("en", Boolean(v.en?.trim()), false)}
        <textarea
          value={v.en ?? ""}
          rows={3}
          onChange={(e) => set({ en: e.target.value })}
          aria-label={`${label} (English)`}
          className={`mt-1 ${inputClass} resize-y border-border leading-relaxed`}
        />
      </label>
      <label className="block">
        {localeTag("pt", Boolean(v.pt?.trim()), Boolean(v.en?.trim()))}
        <textarea
          value={v.pt ?? ""}
          rows={3}
          onChange={(e) => set({ pt: e.target.value })}
          aria-label={`${label} (Portuguese)`}
          className={`mt-1 ${inputClass} resize-y border-border leading-relaxed`}
        />
      </label>
    </LocaleRow>
  );
}

/* -- small controls ------------------------------------------------------- */

const inputClass =
  "w-full rounded-lg border bg-bg px-3 py-2 font-mono text-sm text-fg placeholder:text-comment";

function Field({
  label,
  value,
  onChange,
  hint,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  invalid?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs text-comment">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className={`${inputClass} ${invalid ? "border-red/60" : "border-border"}`}
      />
      {hint ? (
        <span
          className={`mt-1 block font-mono text-[10px] ${invalid ? "text-red" : "text-comment"}`}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-end gap-2 pb-2.5 font-mono text-sm text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-green"
      />
      {label}
    </label>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex size-6 items-center justify-center rounded border border-border font-mono text-xs text-muted transition-colors hover:text-fg disabled:opacity-25 ${className}`}
    >
      {children}
    </button>
  );
}

function Toggle({
  children,
  on,
  onClick,
  title,
  onClass,
}: {
  children: React.ReactNode;
  on: boolean;
  onClick: () => void;
  title: string;
  onClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      title={title}
      aria-label={title}
      className={`flex size-6 items-center justify-center rounded border font-mono text-xs transition-colors ${
        on ? onClass : "border-border text-comment hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}
