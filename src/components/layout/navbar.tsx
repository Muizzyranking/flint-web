"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Product", href: "/landing" },
  { label: "Docs", href: "/docs" },
  { label: "Architecture", href: "/architecture" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0A0A0B]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2.5 group">
          <div className="relative size-8 shrink-0">
            <Image src="/logo.svg" alt="Flint logo" fill priority />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
            Flint
          </span>
        </Link>

        {/* Centre links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#FF6B2B] px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#e55e22] active:scale-[0.98]"
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
