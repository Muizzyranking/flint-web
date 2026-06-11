"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlintLogo } from "@/components/icons/flint-logo";

const NAV_LINKS = [
  { label: "Product", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Architecture", href: "/architecture" },
];

type Theme = "light" | "dark";

export function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("flint-theme", next);
    setTheme(next);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/82 shadow-sm shadow-shadow-color backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-foreground shadow-sm shadow-shadow-color ring-1 ring-border transition-colors group-hover:text-accent">
            <FlintLogo className="size-7" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
            Flint
          </span>
        </Link>

        <ul className="hidden items-center rounded-full border border-border bg-card/70 p-1 shadow-sm shadow-shadow-color md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              href === "/"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm shadow-shadow-color transition-colors hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="3.2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8.5 1.8v1.4M8.5 13.8v1.4M1.8 8.5h1.4M13.8 8.5h1.4M3.8 3.8l1 1M12.2 12.2l1 1M13.2 3.8l-1 1M4.8 12.2l-1 1"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M13.6 10.4A5.5 5.5 0 0 1 6.6 3.4 5.7 5.7 0 1 0 13.6 10.4Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </button>
          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm shadow-shadow-color transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:inline-flex"
          >
            Open dashboard
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6h8M6 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
