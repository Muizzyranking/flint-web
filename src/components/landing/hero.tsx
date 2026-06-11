"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden px-5 pt-28 pb-16 sm:px-8 lg:px-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute top-28 right-1/2 -z-10 size-[36rem] translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 shadow-sm shadow-shadow-color">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Open-source · FastAPI + Next.js
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Every job needs{" "}
            <span className="relative inline-block text-accent">
              a spark.
              <span className="absolute -bottom-1 left-1 right-1 h-1 rounded-full bg-accent/25" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
            Flint is a background job scheduler built for developers who care
            about correctness. Schedule emails, webhooks, and log pipelines,
            powered by swappable priority algorithms, live status streams, and a
            clean UI.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-shadow-color transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              Open dashboard
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold text-foreground shadow-sm shadow-shadow-color transition-all hover:-translate-y-0.5 hover:border-accent/45 hover:text-accent active:translate-y-0"
            >
              Read the docs
            </Link>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 lg:mx-0">
            {[
              { n: "3", label: "job handlers" },
              { n: "2", label: "algorithms" },
              { n: "∞", label: "retry backoff" },
              { n: "SSE", label: "live stream" },
            ].map(({ n, label }) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-card/70 px-4 py-3 shadow-sm shadow-shadow-color"
              >
                <span className="block text-2xl font-bold text-foreground">
                  {n}
                </span>
                <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flint-float mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-shadow-color">
          <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-4 py-3">
            <span className="size-2.5 rounded-full bg-danger" />
            <span className="size-2.5 rounded-full bg-warning" />
            <span className="size-2.5 rounded-full bg-success" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              flint — job scheduler
            </span>
          </div>
          <div className="space-y-0.5 overflow-x-auto px-5 py-5 text-left font-mono text-xs leading-6 text-code-foreground">
            <p>
              <span className="text-muted-foreground">$</span>{" "}
              <span className="text-foreground">POST /api/v1/jobs</span>
            </p>
            <p className="text-muted-foreground">{"{"}</p>
            <p className="pl-4">
              <span className="text-success">&quot;type&quot;</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-accent">&quot;webhook_delivery&quot;</span>
              <span className="text-muted-foreground">,</span>
            </p>
            <p className="pl-4">
              <span className="text-success">&quot;priority&quot;</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-secondary">1</span>
              <span className="text-muted-foreground">,</span>
            </p>
            <p className="pl-4">
              <span className="text-success">&quot;interval&quot;</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-accent">&quot;5m&quot;</span>
            </p>
            <p className="text-muted-foreground">{"}"}</p>
            <p className="mt-3 border-t border-border pt-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">
                {" "}
                201 Created · job_id:{" "}
              </span>
              <span className="text-foreground">a3f9d2c1</span>
            </p>
          </div>
          <div className="border-t border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-card-foreground">
                  Live queue
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  4 active workers · 18 queued
                </p>
              </div>
              <span className="flint-pulse-ring size-2.5 rounded-full bg-success" />
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-border">
              <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-accent/80" />
              <span className="flint-scan absolute inset-y-0 left-0 w-1/3 rounded-full bg-accent-soft/80" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-muted-foreground">
              <span className="rounded-md border border-border bg-card px-2 py-1">
                retry #2
              </span>
              <span className="rounded-md border border-border bg-card px-2 py-1">
                webhook
              </span>
              <span className="rounded-md border border-border bg-card px-2 py-1">
                due 5m
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
