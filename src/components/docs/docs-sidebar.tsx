"use client";

import { useEffect, useState } from "react";

export type DocSection = {
  id: string;
  title: string;
  children?: { id: string; title: string }[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "Overview",
  },
  {
    id: "getting-started",
    title: "Getting started",
    children: [
      { id: "prerequisites", title: "Prerequisites" },
      { id: "installation", title: "Installation" },
      { id: "configuration", title: "Configuration" },
    ],
  },
  {
    id: "api-reference",
    title: "API reference",
    children: [
      { id: "jobs", title: "Jobs" },
      { id: "dlq", title: "Dead letter queue" },
      { id: "bin", title: "Bin" },
      { id: "workers", title: "Workers" },
      { id: "logs", title: "Logs" },
      { id: "settings", title: "Settings" },
      { id: "benchmark", title: "Benchmark" },
      { id: "sse", title: "SSE stream" },
    ],
  },
  {
    id: "job-handlers",
    title: "Job handlers",
    children: [
      { id: "send-email", title: "send_email" },
      { id: "webhook-delivery", title: "webhook_delivery" },
      { id: "log-processing", title: "log_processing" },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    children: [
      { id: "min-heap", title: "Min-heap" },
      { id: "timing-wheel", title: "Timing wheel" },
      { id: "switching", title: "Switching at runtime" },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    children: [
      { id: "docker", title: "Docker Compose" },
      { id: "env-vars", title: "Environment variables" },
    ],
  },
];

function flatIds(sections: DocSection[]): string[] {
  return sections.flatMap((s) => [
    s.id,
    ...(s.children?.map((c) => c.id) ?? []),
  ]);
}

export function DocsSidebar() {
  const [active, setActive] = useState<string>("overview");

  // Highlight the section whose heading is nearest the top of the viewport
  useEffect(() => {
    const ids = flatIds(DOC_SECTIONS);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-sm shadow-shadow-color lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <nav className="space-y-5">
        {DOC_SECTIONS.map((section) => (
          <div key={section.id}>
            <a
              href={`#${section.id}`}
              className={[
                "block text-[12px] font-semibold uppercase tracking-widest transition-colors",
                active === section.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {section.title}
            </a>

            {section.children && (
              <ul className="mt-2 space-y-1 border-l border-border pl-3">
                {section.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className={[
                        "block py-0.5 text-[13px] transition-colors",
                        active === child.id
                          ? "text-accent"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
