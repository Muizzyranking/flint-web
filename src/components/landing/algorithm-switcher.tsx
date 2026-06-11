"use client";

import { useState } from "react";

type Algorithm = "heap" | "timing_wheel";

const HEAP_BARS = [
  { label: "P1", height: 90, colorClass: "bg-accent" },
  { label: "P1", height: 85, colorClass: "bg-accent" },
  { label: "P2", height: 55, colorClass: "bg-warning" },
  { label: "P2", height: 48, colorClass: "bg-warning" },
  { label: "P3", height: 30, colorClass: "bg-muted-foreground/40" },
  { label: "P3", height: 22, colorClass: "bg-muted-foreground/40" },
  { label: "P3", height: 15, colorClass: "bg-muted-foreground/40" },
];

const WHEEL_BARS = [
  { label: "t+0", height: 75, colorClass: "bg-secondary" },
  { label: "t+1", height: 70, colorClass: "bg-secondary" },
  { label: "t+2", height: 65, colorClass: "bg-secondary" },
  { label: "t+3", height: 60, colorClass: "bg-secondary" },
  { label: "t+4", height: 55, colorClass: "bg-secondary" },
  { label: "t+5", height: 45, colorClass: "bg-secondary/70" },
  { label: "t+6", height: 35, colorClass: "bg-secondary/70" },
];

const ALGO_META: Record<
  Algorithm,
  {
    name: string;
    tagline: string;
    complexity: string;
    bestFor: string;
    detail: string;
  }
> = {
  heap: {
    name: "Min-heap",
    tagline: "Priority-first scheduling",
    complexity: "O(log n) insert · O(log n) pop",
    bestFor: "Mixed-priority workloads",
    detail:
      "Jobs are stored in a binary min-heap keyed by effective priority. The scheduler always pops the highest-priority job next — ideal when you need to guarantee that critical jobs like payment webhooks always run before lower-priority batch work.",
  },
  timing_wheel: {
    name: "Timing wheel",
    tagline: "Time-first scheduling",
    complexity: "O(1) insert · O(1) pop",
    bestFor: "High-throughput scheduled jobs",
    detail:
      "Jobs are bucketed into time slots on a circular wheel. Each scheduler tick advances the hand and dispatches everything in the current slot. Constant-time operations make this ideal for high-volume recurring jobs at precise intervals.",
  },
};

function QueueVisualisation({
  algo,
  animating,
}: {
  algo: Algorithm;
  animating: boolean;
}) {
  const bars = algo === "heap" ? HEAP_BARS : WHEEL_BARS;

  return (
    <div className="flex h-28 items-end justify-center gap-1.5 px-4">
      {bars.map((bar, i) => (
        <div
          key={`${bar.label}--${i}`}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-7 rounded-t transition-all duration-700 ease-out ${bar.colorClass}`}
            style={{
              height: animating ? 0 : bar.height * 0.9,
              opacity: animating ? 0 : 1,
              transitionDelay: animating ? "0ms" : `${i * 60}ms`,
            }}
          />
          <span className="font-mono text-[9px] text-muted-foreground">
            {bar.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AlgorithmSwitcher() {
  const [algo, setAlgo] = useState<Algorithm>("heap");
  const [animating, setAnimating] = useState(false);

  function switchTo(next: Algorithm) {
    if (next === algo) return;
    setAnimating(true);
    setTimeout(() => {
      setAlgo(next);
      setAnimating(false);
    }, 300);
  }

  const meta = ALGO_META[algo];

  return (
    <section className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            algorithms
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Switch on the fly
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Two algorithms.
              <br />
              <span className="text-muted-foreground">Zero restarts.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Flint ships with two scheduling strategies. Toggle between them at
              runtime through the dashboard or the settings API; the queue
              drains under the current algorithm and the next job is picked up
              under the new one.
            </p>

            <div className="mt-8 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm shadow-shadow-color">
              {(["heap", "timing_wheel"] as Algorithm[]).map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => switchTo(a)}
                  className={[
                    "rounded-md px-5 py-2 text-sm font-semibold transition-all",
                    algo === a
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {a === "heap" ? "Min-heap" : "Timing wheel"}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">
                {meta.complexity}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">
                Best for: {meta.bestFor}
              </span>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
              {meta.detail}
            </p>
          </div>

          <div className="flint-float-delay overflow-hidden rounded-lg border border-border bg-card shadow-xl shadow-shadow-color">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "size-2 rounded-full transition-colors duration-300",
                    algo === "heap" ? "bg-accent" : "bg-secondary",
                  ].join(" ")}
                />
                <span className="text-sm font-semibold text-card-foreground transition-all duration-300">
                  {meta.name}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {meta.tagline}
              </span>
            </div>

            <div className="p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {algo === "heap" ? "Queue by priority" : "Queue by time slot"}
              </p>
              <QueueVisualisation algo={algo} animating={animating} />
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["worker-a", "running"],
                  ["worker-b", "idle"],
                  ["worker-c", "retrying"],
                ].map(([worker, state]) => (
                  <div
                    key={worker}
                    className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {worker}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-card-foreground">
                      <span className="size-1.5 rounded-full bg-accent" />
                      {state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              {[
                {
                  label: "Insert",
                  value: algo === "heap" ? "O(log n)" : "O(1)",
                },
                { label: "Pop", value: algo === "heap" ? "O(log n)" : "O(1)" },
                { label: "Peek", value: algo === "heap" ? "O(1)" : "O(1)" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-4"
                >
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
