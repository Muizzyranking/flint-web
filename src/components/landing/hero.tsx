"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 text-center">
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow behind content */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #FF6B2B 0%, transparent 70%)",
        }}
      />

      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
        <span className="size-1.5 rounded-full bg-[#FF6B2B] animate-pulse" />
        <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
          Open-source · FastAPI + Next.js
        </span>
      </div>

      {/* Headline */}
      <h1 className="mx-auto max-w-3xl text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.06] tracking-tight text-white">
        Every job has{" "}
        <span className="relative inline-block">
          <span className="relative z-10 text-[#FF6B2B]">a spark.</span>
          {/* underline glow */}
          <span
            className="absolute -bottom-1 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #FF6B2B80, transparent)",
            }}
          />
        </span>
      </h1>

      {/* Subheadline */}
      <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/40">
        Flint is a background job scheduler built for developers who care about
        correctness. Schedule emails, webhooks, and log pipelines — powered by
        swappable priority algorithms, live status streams, and a clean UI.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md bg-[#FF6B2B] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#e55e22] hover:shadow-[#FF6B2B]/20 hover:shadow-xl active:scale-[0.98]"
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
          className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] px-6 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:text-white/90 active:scale-[0.98]"
        >
          Read the docs
        </Link>
      </div>

      {/* Scrolling terminal teaser */}
      <div className="mx-auto mt-16 w-full max-w-2xl rounded-xl border border-white/[0.06] bg-[#111114] overflow-hidden shadow-2xl">
        {/* Terminal bar */}
        <div className="flex items-center gap-1.5 border-b border-white/[0.05] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-xs text-white/20 font-mono">
            flint — job scheduler
          </span>
        </div>
        {/* Terminal body */}
        <div className="px-5 py-4 font-mono text-xs leading-relaxed text-left space-y-0.5">
          <p>
            <span className="text-white/25">$</span>{" "}
            <span className="text-white/60">POST /api/v1/jobs</span>
          </p>
          <p className="text-white/25">{"{"}</p>
          <p className="pl-4 text-white/40">
            <span className="text-[#7EC8A4]">"type"</span>
            <span className="text-white/25">: </span>
            <span className="text-[#E8A87C]">"webhook_delivery"</span>
            <span className="text-white/25">,</span>
          </p>
          <p className="pl-4 text-white/40">
            <span className="text-[#7EC8A4]">"priority"</span>
            <span className="text-white/25">: </span>
            <span className="text-[#7EB8E8]">1</span>
            <span className="text-white/25">,</span>
          </p>
          <p className="pl-4 text-white/40">
            <span className="text-[#7EC8A4]">"interval"</span>
            <span className="text-white/25">: </span>
            <span className="text-[#E8A87C]">"5m"</span>
          </p>
          <p className="text-white/25">{"}"}</p>
          <p className="mt-2">
            <span className="text-[#FF6B2B]">✓</span>
            <span className="text-white/30"> 201 Created · job_id: </span>
            <span className="text-white/50">a3f9d2c1</span>
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-auto mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
        {[
          { n: "3", label: "job handlers" },
          { n: "2", label: "scheduling algorithms" },
          { n: "∞", label: "retries with backoff" },
          { n: "SSE", label: "live status stream" },
        ].map(({ n, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-bold text-white">{n}</span>
            <span className="text-xs text-white/30 font-mono">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
