"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { clearToken } from "../../lib/api";

const links = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/jobs", label: "Job market", icon: BriefcaseBusiness },
  { href: "/resume", label: "Resume lab", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function AppShell({ children, eyebrow = "Workspace" }) {
  const pathname = usePathname();
  const router = useRouter();

  function signOut() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[#f9faf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="mr-auto flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--leaf)] text-sm font-bold text-white">
              S
            </span>
            <span>
              <strong className="block text-lg tracking-[-0.04em]">
                SignalDesk
              </strong>
              <small className="text-[11px] text-[var(--ink-muted)]">
                career intelligence
              </small>
            </span>
          </Link>
          <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-[var(--line)] pt-3 md:order-2 md:w-auto md:border-t-0 md:pt-0">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-[var(--leaf-soft)] font-semibold text-[var(--leaf)]" : "text-[var(--ink-muted)] hover:bg-[#edf1eb] hover:text-[var(--foreground)]"}`}
                >
                  <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-3 md:order-3">
            <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)] lg:inline">
              {eyebrow}
            </span>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e8cfc8] bg-white px-3 text-sm font-semibold text-[#9b4e3b] transition hover:bg-[#fdf0ec]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="min-h-screen">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
