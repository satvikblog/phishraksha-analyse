import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  currentPath?: "/" | "/analyse" | "/results";
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07111ccc]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 font-mono text-sm text-cyan-100">
            PR
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
              PhishRaksha
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
              AI phishing defense
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink href="/" active={currentPath === "/"}>
            Home
          </NavLink>
          <NavLink href="/analyse" active={currentPath === "/analyse"}>
            Analyse
          </NavLink>
        </nav>

        <Link
          href="/analyse"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-50 hover:-translate-y-0.5 hover:border-cyan-200/32 hover:bg-cyan-300/16"
        >
          Launch Scanner
        </Link>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/6 hover:text-white",
        active && "bg-white/8 text-white",
      )}
    >
      {children}
    </Link>
  );
}
