"use client";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      {/* CTA band */}
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#FF6B2B]/70">
          Get started
        </p>
        <h2 className="mx-auto max-w-xl text-3xl font-bold text-white sm:text-4xl">
          Quietly igniting your payload.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/35">
          Spin up the stack, open the dashboard, and schedule your first job in under two minutes.
        </p>

        {/* Install snippet */}
        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-lg border border-white/[0.07] bg-[#111114] px-5 py-3 font-mono text-sm text-white/50">
          <span className="text-white/20">$</span>
          <span>docker compose up --build</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText("docker compose up --build")}
            className="ml-2 rounded p-1 text-white/20 transition-colors hover:bg-white/[0.06] hover:text-white/50"
            aria-label="Copy command"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <rect x="4" y="4" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9 4V2.5A1.5 1.5 0 0 0 7.5 1h-5A1.5 1.5 0 0 0 1 2.5v5A1.5 1.5 0 0 0 2.5 9H4" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-[#FF6B2B] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e55e22] active:scale-[0.98]"
          >
            Open dashboard
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] px-6 py-2.5 text-sm font-medium text-white/50 transition-all hover:text-white/80 hover:border-white/20 active:scale-[0.98]"
          >
            Read the docs
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="relative size-5 shrink-0">
              <Image src="/logo.svg" alt="Flint" fill />
            </div>
            <span className="text-sm font-semibold text-white/30">Flint</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/20">
            <Link href="/docs" className="hover:text-white/40 transition-colors">Docs</Link>
            <Link href="/architecture" className="hover:text-white/40 transition-colors">Architecture</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              GitHub
            </a>
          </div>

          <p className="text-xs text-white/15">
            MIT License · Open source
          </p>
        </div>
      </div>
    </footer>
  );
}
