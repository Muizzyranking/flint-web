"use client";

import { useState } from "react";

type Algorithm = "heap" | "timing_wheel";

const HEAP_BARS = [
  { label: "P1", height: 90, color: "#FF6B2B" },
  { label: "P1", height: 85, color: "#FF6B2B" },
  { label: "P2", height: 55, color: "#E8A87C" },
  { label: "P2", height: 48, color: "#E8A87C" },
  { label: "P3", height: 30, color: "#4A4A5A" },
  { label: "P3", height: 22, color: "#4A4A5A" },
  { label: "P3", height: 15, color: "#4A4A5A" },
];

const WHEEL_BARS = [
  { label: "t+0", height: 75, color: "#7EB8E8" },
  { label: "t+1", height: 70, color: "#7EB8E8" },
  { label: "t+2", height: 65, color: "#7EB8E8" },
  { label: "t+3", height: 60, color: "#7EB8E8" },
  { label: "t+4", height: 55, color: "#7EB8E8" },
  { label: "t+5", height: 45, color: "#5A9EC8" },
  { label: "t+6", height: 35, color: "#5A9EC8" },
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
        <div key={`${bar.label}--${i}`} className="flex flex-col items-center gap-1">
          <div
            className="w-7 rounded-t-sm transition-all duration-700 ease-out"
            style={{
              height: animating ? 0 : bar.height * 0.9,
              backgroundColor: bar.color,
              opacity: animating ? 0 : 1,
              transitionDelay: animating ? "0ms" : `${i * 60}ms`,
            }}
          />
          <span className="font-mono text-[9px] text-white/20">
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
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      {/* Section divider line */}
      <div className="mb-16 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="font-mono text-xs text-white/20 uppercase tracking-widest">
          algorithms
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left: copy */}
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#FF6B2B]/70">
            Switch on the fly
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Two algorithms.
            <br />
            <span className="text-white/35">Zero restarts.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/40">
            Flint ships with two scheduling strategies. Toggle between them at
            runtime through the dashboard or the settings API — the queue drains
            under the current algorithm and the next job is picked up under the
            new one.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex rounded-lg border border-white/[0.08] bg-[#111114] p-1">
            {(["heap", "timing_wheel"] as Algorithm[]).map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => switchTo(a)}
                className={[
                  "rounded-md px-5 py-2 text-sm font-medium transition-all",
                  algo === a
                    ? "bg-[#FF6B2B] text-white shadow-sm"
                    : "text-white/40 hover:text-white/70",
                ].join(" ")}
              >
                {a === "heap" ? "Min-heap" : "Timing wheel"}
              </button>
            ))}
          </div>

          {/* Meta pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/40">
              {meta.complexity}
            </span>
            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/40">
              Best for: {meta.bestFor}
            </span>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-white/30">
            {meta.detail}
          </p>
        </div>

        {/* Right: visualisation card */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111114] overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: algo === "heap" ? "#FF6B2B" : "#7EB8E8",
                }}
              />
              <span className="text-sm font-medium text-white/70 transition-all duration-300">
                {meta.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">
              {meta.tagline}
            </span>
          </div>

          {/* Bar chart visualisation */}
          <div className="p-6">
            <p className="mb-4 font-mono text-[10px] text-white/20 uppercase tracking-widest">
              {algo === "heap" ? "Queue by priority" : "Queue by time slot"}
            </p>
            <QueueVisualisation algo={algo} animating={animating} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-white/[0.05] border-t border-white/[0.05]">
            {[
              { label: "Insert", value: algo === "heap" ? "O(log n)" : "O(1)" },
              { label: "Pop", value: algo === "heap" ? "O(log n)" : "O(1)" },
              { label: "Peek", value: algo === "heap" ? "O(1)" : "O(1)" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center py-4 gap-1"
              >
                <span className="font-mono text-sm font-semibold text-white/70">
                  {value}
                </span>
                <span className="font-mono text-[10px] text-white/25 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
