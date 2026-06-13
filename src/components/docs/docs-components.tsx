"use client";

import { useState } from "react";

export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-border py-10 first:pt-0 last:border-0"
    >
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function DocSubSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 pt-4">
      <h3 className="mb-3 text-base font-semibold text-card-foreground">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-7 text-muted-foreground">{children}</p>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-card-foreground">
      {children}
    </code>
  );
}

export function CodeBlock({
  language = "bash",
  children,
}: {
  language?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-code shadow-sm shadow-shadow-color">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] text-muted-foreground transition-all hover:bg-card hover:text-foreground"
        >
          {copied ? (
            <>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1.5 5.5l2.5 2.5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3.5"
                  y="3.5"
                  width="6"
                  height="6"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <path
                  d="M7 3.5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-code-foreground">
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}

const METHOD_COLORS: Record<string, string> = {
  DELETE: "border-danger/20 bg-danger/10 text-danger",
  GET: "border-secondary/20 bg-secondary/10 text-secondary",
  PATCH: "border-warning/20 bg-warning/10 text-warning",
  POST: "border-success/20 bg-success/10 text-success",
};

export function Endpoint({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description?: string;
}) {
  const colors =
    METHOD_COLORS[method] ?? "border-border bg-muted text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm shadow-shadow-color">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${colors}`}
        >
          {method}
        </span>
        <code className="font-mono text-[13px] text-card-foreground">
          {path}
        </code>
      </div>
      {description && (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

type CalloutType = "info" | "warning" | "tip";

const CALLOUT_STYLES: Record<CalloutType, { border: string; label: string }> = {
  info: { border: "border-l-secondary", label: "Note" },
  tip: { border: "border-l-success", label: "Tip" },
  warning: { border: "border-l-warning", label: "Warning" },
};

export function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  const s = CALLOUT_STYLES[type];
  return (
    <div
      className={`rounded-r-lg border-l-2 bg-card px-4 py-3 shadow-sm shadow-shadow-color ${s.border}`}
    >
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {s.label}
      </p>
      <div className="text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

export function PropsTable({
  rows,
}: {
  rows: {
    field: string;
    type: string;
    required?: boolean;
    description: string;
  }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm shadow-shadow-color">
      <table className="w-full text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-2.5 font-mono font-semibold text-muted-foreground">
              Field
            </th>
            <th className="px-4 py-2.5 font-mono font-semibold text-muted-foreground">
              Type
            </th>
            <th className="px-4 py-2.5 font-mono font-semibold text-muted-foreground">
              Req
            </th>
            <th className="px-4 py-2.5 font-mono font-semibold text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.field} className="transition-colors hover:bg-muted/35">
              <td className="px-4 py-2.5 font-mono text-secondary">
                {r.field}
              </td>
              <td className="px-4 py-2.5 font-mono text-accent">{r.type}</td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {r.required ? (
                  <span className="text-accent">yes</span>
                ) : (
                  <span>—</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {r.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
