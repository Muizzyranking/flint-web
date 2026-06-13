"use client";

import { useEffect, useMemo, useState } from "react";
import {
  extractToc,
  MarkdownRenderer,
  type TocEntry,
} from "./markdown-renderer";

function ArchitectureToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string>("");
  const visible = useMemo(
    () => entries.filter((entry) => entry.level === 2 || entry.level === 3),
    [entries],
  );

  useEffect(() => {
    if (!visible.length) return;

    const observer = new IntersectionObserver(
      (obs) => {
        const current = obs
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (current.length) setActive(current[0].target.id);
      },
      { rootMargin: "-12% 0px -78% 0px" },
    );

    visible.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [visible]);

  if (!visible.length) return null;

  return (
    <aside className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-sm shadow-shadow-color lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Architecture map
      </p>
      <nav className="space-y-1">
        {visible.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById(entry.id)
                ?.scrollIntoView({ behavior: "smooth" });
              setActive(entry.id);
            }}
            className={[
              "block rounded-md px-3 py-2 text-sm transition-colors",
              entry.level === 3 ? "ml-3 text-xs" : "font-medium",
              active === entry.id
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {entry.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export function ArchitectureClient({ content }: { content: string }) {
  const toc = useMemo(() => extractToc(content), [content]);

  // Pull the H1 title out separately so we can render it as a hero header
  const title = toc.find((e) => e.level === 1);
  const subtitle = "System design, component responsibilities, and data flow.";

  return (
    <div className="px-5 pt-28 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm shadow-shadow-color">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            Architecture
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title?.text ?? "Architecture"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <ArchitectureToc entries={toc} />
          <main className="min-w-0">
            <MarkdownRenderer content={content} />
          </main>
        </div>
      </div>
    </div>
  );
}
