"use client";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "Live status via SSE",
    description:
      "Job state changes stream directly to the dashboard over Server-Sent Events. No polling, no stale UI — every transition is instant.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M3 9a6 6 0 1 0 12 0A6 6 0 0 0 3 9Z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M13.5 2.5l1.5 1.5M3 15l1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: "Interval scheduling",
    description:
      "Define recurring jobs with human-readable intervals — 30s, 5m, 1h, 1d. Flint re-queues them automatically after each run.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M9 2v4M9 12v4M2 9h4M12 9h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
    title: "Dependency chains",
    description:
      "Declare upstream job IDs and Flint holds a job until all dependencies reach a completed state. DAG visualised in the job detail view.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M3 6h12M3 10h8M3 14h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "Structured logs",
    description:
      "Every job event — creation, retries, completion, failure — is written to an append-only log you can query and filter in the Logs view.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M2 16l4-4 3 2 4-6 3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Benchmark suite",
    description:
      "Run head-to-head algorithm benchmarks at 1 k, 10 k, or 100 k jobs from inside the dashboard. Visualise insert/pop times side-by-side.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" opacity="0.35"/>
      </svg>
    ),
    title: "Dead letter queue",
    description:
      "Jobs that exhaust all retries are moved to the DLQ. Inspect the last error, view the full payload, and re-queue with one click.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M9 2L2 7v9h5v-5h4v5h5V7L9 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Priority levels",
    description:
      "Three priority tiers — High, Medium, Low — determine queue position under the min-heap strategy. High-priority jobs always run first.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="5" cy="9" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="13" cy="5" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 9h3l1-2.5M7 9h3l1 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Worker management",
    description:
      "Monitor active workers, view last-seen times, and gracefully stop or restart individual workers from the dashboard or Settings page.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Section header */}
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#FF6B2B]/70">
          Built-in
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Everything a job scheduler
          <br />
          <span className="text-white/35">should ship with.</span>
        </h2>
      </div>

      <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden border border-white/[0.04]">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group bg-[#0A0A0B] p-6 transition-colors hover:bg-[#111114]"
          >
            <div className="mb-4 flex size-8 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.03] text-white/50 group-hover:text-white/80 transition-colors">
              {f.icon}
            </div>
            <h3 className="mb-2 text-[13px] font-semibold text-white/80">{f.title}</h3>
            <p className="text-[12px] leading-relaxed text-white/30">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
