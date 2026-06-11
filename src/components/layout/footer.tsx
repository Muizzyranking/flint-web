"use client";
import Link from "next/link";
import { FlintLogo } from "@/components/icons/flint-logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            Get started
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Quietly igniting your payload.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
            Spin up the stack, open the dashboard, and schedule your first job
            in under two minutes.
          </p>
        </div>

        <div className="mx-auto mt-8 inline-flex max-w-full items-center gap-3 overflow-x-auto rounded-lg border border-border bg-card px-5 py-3 font-mono text-sm text-muted-foreground shadow-sm shadow-shadow-color">
          <span className="text-accent">$</span>
          <span>docker compose up --build</span>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText("docker compose up --build")
            }
            className="ml-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copy command"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="4"
                width="8"
                height="8"
                rx="1.2"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M9 4V2.5A1.5 1.5 0 0 0 7.5 1h-5A1.5 1.5 0 0 0 1 2.5v5A1.5 1.5 0 0 0 2.5 9H4"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm shadow-shadow-color transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            Open dashboard
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm shadow-shadow-color transition-all hover:-translate-y-0.5 hover:border-accent/45 hover:text-accent active:translate-y-0"
          >
            Read the docs
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-5 text-center sm:px-8 md:flex-row md:text-left lg:px-12">
          <div className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-card text-foreground ring-1 ring-border">
              <FlintLogo className="size-5" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Flint
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/docs" className="transition-colors hover:text-accent">
              Docs
            </Link>
            <Link
              href="/architecture"
              className="transition-colors hover:text-accent"
            >
              Architecture
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-accent"
            >
              GitHub
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a className="text-accent" href="https://muizzyranking.me">
              Muizzyranking
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
