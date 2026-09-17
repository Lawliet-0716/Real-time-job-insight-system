"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Send,
  UserRound,
} from "lucide-react";
import { clearToken } from "../../lib/api";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@signaldesk.app";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/jobs", label: "Job market", icon: BriefcaseBusiness },
  { href: "/resume", label: "Resume lab", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function AppShell({ children, eyebrow = "Workspace" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState("");

  function signOut() {
    clearToken();
    router.push("/");
  }

  function openContactEmail(event) {
    event.preventDefault();
    const subject = "CareerWise project inquiry";
    const body = `Email: ${contactEmail}\n\n${contactMessage}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setContactStatus("Opening your email app...");
    window.location.assign(mailto);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[#f9faf6]/95 backdrop-blur">
        <div className="mx-auto flex w-full flex-wrap items-center gap-4 px-5 py-4 sm:px-8 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-8 lg:px-10">
          <Link
            href="/"
            className="mr-auto flex shrink-0 items-center gap-3 md:mr-0"
          >
            <Image
              src="/logo.png"
              alt="CareerWise"
              width={150}
              height={54}
              priority
              className="h-11 w-auto object-contain object-left"
            />
          </Link>
          <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-[var(--line)] pt-3 md:order-2 md:w-full md:max-w-[620px] md:justify-self-center md:justify-between md:border-t-0 md:pt-0">
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
      <main className="flex-1">
        <div className="w-full px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-[#1f4b3a] bg-[#233f33] text-white">
        <div className="relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#acd3b9]">
                <span className="h-px w-8 bg-[#f5d98f]" />
                Career intelligence
              </div>
              <h2 className="max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#f6f7f2] sm:text-6xl">
                Make your next move count.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-[#c7d9cf]">
                Follow the signal, sharpen your edge, and move toward work that
                fits where you are going.
              </p>
              <Link
                href="/jobs"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d98f] transition hover:text-white"
              >
                Explore the job market <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#acd3b9] transition hover:text-white"
              >
                About us <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <form
                onSubmit={openContactEmail}
                className="border-t border-[#527461] pt-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5d98f]">
                  Start a conversation
                </p>
                <div className="mt-3 flex items-center gap-2 border-b border-[#789686] pb-2">
                  <Mail size={16} className="shrink-0 text-[#acd3b9]" />
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="Your email"
                    aria-label="Your email address"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#acd3b9]"
                  />
                </div>
                <textarea
                  required
                  value={contactMessage}
                  onChange={(event) => setContactMessage(event.target.value)}
                  placeholder="Tell us about your idea"
                  aria-label="Your message"
                  rows={2}
                  className="mt-4 w-full resize-none rounded-lg border border-[#527461] bg-[#1f382e] px-3 py-2 text-sm text-white outline-none placeholder:text-[#acd3b9] focus:border-[#f5d98f]"
                />
                <button
                  type="submit"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d98f] transition hover:text-white"
                >
                  Email the team <Send size={15} />
                </button>
                <p aria-live="polite" className="mt-2 text-xs text-[#acd3b9]">
                  {contactStatus || `Or email ${CONTACT_EMAIL} directly.`}
                </p>
              </form>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="absolute -right-4 -bottom-20 text-[22rem] font-bold leading-none tracking-[-0.2em] text-[#2d5948]"
          >
            S
          </span>
        </div>
        <div className="border-t border-[#527461] px-5 py-4 text-center text-xs text-[#acd3b9] sm:px-8 lg:px-10">
          <p>© 2026 CareerWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
