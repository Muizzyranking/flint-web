"use client";

import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Gauge,
  LayoutDashboard,
  ListRestart,
  Menu,
  Settings,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlintLogo } from "@/components/icons/flint-logo";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/dashboard/jobs", icon: BriefcaseBusiness },
  { label: "DLQ", href: "/dashboard/dlq", icon: ShieldAlert },
  { label: "Bin", href: "/dashboard/bin", icon: Trash2 },
  { label: "Logs", href: "/dashboard/logs", icon: Activity },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Benchmark", href: "/dashboard/benchmark", icon: BarChart3 },
  { label: "Workers", href: "/dashboard/workers", icon: ListRestart },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, []);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-card/92 shadow-xl shadow-shadow-color backdrop-blur-xl lg:block">
        <DashboardSidebar pathname={pathname} />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/25"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          />
          <div className="relative h-full w-[min(20rem,86vw)] border-r border-border bg-card shadow-2xl shadow-shadow-color">
            <DashboardSidebar pathname={pathname} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/88 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm shadow-shadow-color transition-colors hover:text-foreground lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Flint operations
                </p>
                <h1 className="text-lg font-semibold text-foreground">
                  Background job control plane
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm shadow-shadow-color transition-colors hover:text-foreground sm:inline-flex"
              >
                Product
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm shadow-shadow-color transition-colors hover:text-foreground"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <Gauge className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function DashboardSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-background text-accent ring-1 ring-border">
            <FlintLogo className="size-8" />
          </span>
          <span>
            <span className="block text-base font-semibold text-foreground">
              Flint
            </span>
            <span className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Scheduler UI
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground shadow-sm shadow-shadow-color"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-success" />
            <p className="text-sm font-semibold text-foreground">Live mode</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Jobs stream through SSE; logs poll every 30 seconds.
          </p>
        </div>
      </div>
    </aside>
  );
}
