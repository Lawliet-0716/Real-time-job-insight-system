"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  FileCheck2,
  Mail,
  Radar,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

const storyCards = [
  {
    type: "RESUME LAB",
    title: "Make your experience easier to match.",
    text: "Turn the resume you already have into a clearer view of your strengths and gaps.",
    color: "bg-[#d8785e]",
    image: "/resume lab.png",
    icon: FileCheck2,
  },
  {
    type: "MARKET SIGNAL",
    title: "See what employers are asking for now.",
    text: "Follow live demand instead of relying on yesterday's advice.",
    color: "bg-[#5b21b6]",
    image: "/market signal.png",
    icon: BarChart3,
  },
  {
    type: "NEXT SPRINT",
    title: "Know what to learn next.",
    text: "Move from a long list of gaps to a practical learning direction.",
    color: "bg-[#2e6f55]",
    image: "/next sprint.png",
    icon: Sparkles,
  },
  {
    type: "JOB MARKET",
    title: "Find roles that fit your direction.",
    text: "Filter opportunities by role, location, and the signal your experience already carries.",
    color: "bg-[#0284c7]",
    image: "/job market.png",
    icon: BriefcaseBusiness,
  },
  {
    type: "SKILL COVERAGE",
    title: "See the gap without the noise.",
    text: "Separate the skills you already have from the ones worth building next.",
    color: "bg-[#7c3aed]",
    image: "/skill coverage.png",
    icon: Target,
  },
  {
    type: "PROFILE SIGNAL",
    title: "Keep your context in one place.",
    text: "Save your resume, preferences, and professional links for a more useful market view.",
    color: "bg-[#936b19]",
    image: "/profile signal.png",
    icon: Radar,
  },
];

const capabilities = [
  [
    "01",
    "Upload once",
    "Bring your resume into a workspace that understands the context behind it.",
  ],
  [
    "02",
    "Read the market",
    "Compare your signal with the skills and roles moving through the market.",
  ],
  [
    "03",
    "Move with intent",
    "Use a focused roadmap to turn insight into the next deliberate step.",
  ],
];

export default function Home() {
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function submitContact(event) {
    event.preventDefault();
    const body = `Email: ${contactEmail}\n\n${contactMessage}`;
    window.location.assign(
      `mailto:hello@signaldesk.app?subject=${encodeURIComponent("SignalDesk project inquiry")}&body=${encodeURIComponent(body)}`,
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative z-10 border-b border-[var(--line)] bg-[#f9faf6]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
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
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <a
              href="#approach"
              className="hidden text-[var(--ink-muted)] transition hover:text-[var(--leaf)] lg:inline"
            >
              Our approach
            </a>
            <Link
              href="/login"
              className="hidden text-[var(--ink-muted)] transition hover:text-[var(--leaf)] sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--leaf)] px-4 text-white transition hover:bg-[#245b45]"
            >
              Get started <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#101514] text-white">
        <div className="grid min-h-[650px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-20 sm:px-10 lg:px-16 xl:px-24">
            <p className="reveal-on-scroll mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#acd3b9]">
              <span className="h-px w-10 bg-[#f5d98f]" /> Career intelligence
            </p>
            <h1 className="reveal-on-scroll max-w-3xl text-5xl font-semibold leading-[0.91] tracking-[-0.075em] sm:text-7xl xl:text-[5.7rem]">
              Your next move deserves more than a guess.
            </h1>
            <p className="reveal-on-scroll mt-8 max-w-xl text-base leading-7 text-[#c7d9cf] sm:text-lg">
              SignalDesk connects your resume to the market around you, so you
              can see what fits, what is changing, and where to put your energy
              next.
            </p>
            <div className="reveal-on-scroll mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f5d98f] px-6 text-sm font-bold text-[#233f33] transition hover:bg-white"
              >
                Build your signal <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold text-white transition hover:text-[#f5d98f]"
              >
                Sign in to your workspace
              </Link>
            </div>
            <div className="reveal-on-scroll mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#344b42] pt-5 text-xs text-[#acd3b9]">
              <span className="flex items-center gap-2">
                <Check size={14} /> Resume-aware
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} /> Market-informed
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} /> Actionable
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden bg-[#233f33] px-5 py-12 sm:px-10 lg:px-12 lg:py-16">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(#acd3b9_1px,transparent_1px),linear-gradient(90deg,#acd3b9_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="relative flex h-full items-center justify-center">
              <div className="relative w-full max-w-[530px] rounded-[2rem] border border-[#789686] bg-[#14241e]/90 p-4 shadow-2xl sm:p-6">
                <div className="flex items-center justify-between border-b border-[#527461] pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#acd3b9]">
                      Live workspace
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      Market signal / 09.12
                    </p>
                  </div>
                  <Radar className="text-[#f5d98f]" size={25} />
                </div>
                <div className="mt-5 grid grid-cols-[78px_1fr] gap-4">
                  <div className="hidden rounded-xl bg-[#1f382e] p-2 sm:block">
                    <div className="h-1.5 w-9 rounded-full bg-[#acd3b9]" />
                    <div className="mt-8 space-y-3">
                      {["Overview", "Jobs", "Resume", "Profile"].map(
                        (item, index) => (
                          <div
                            key={item}
                            className={`rounded-md px-1.5 py-2 text-[9px] ${index === 0 ? "bg-[#2e6f55] text-white" : "text-[#acd3b9]"}`}
                          >
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f0f6f1] p-3 text-[var(--foreground)]">
                        <FileCheck2 className="text-[var(--leaf)]" size={18} />
                        <p className="mt-5 text-2xl font-semibold">78%</p>
                        <p className="mt-1 text-[10px] text-[var(--ink-muted)]">
                          Resume fit
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fff3d7] p-3 text-[var(--foreground)]">
                        <BriefcaseBusiness
                          className="text-[#936b19]"
                          size={18}
                        />
                        <p className="mt-5 text-2xl font-semibold">1,240</p>
                        <p className="mt-1 text-[10px] text-[var(--ink-muted)]">
                          Relevant roles
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl bg-[#f0f6f1] p-3 text-[var(--foreground)]">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Skill momentum</span>
                        <span className="text-[var(--leaf)]">Live</span>
                      </div>
                      <div className="mt-4 flex h-20 items-end gap-1.5">
                        {[28, 42, 37, 59, 50, 76, 90].map((height, index) => (
                          <span
                            key={index}
                            className="flex-1 rounded-t-sm bg-[var(--leaf)]"
                            style={{
                              height: `${height}%`,
                              opacity: 0.4 + index * 0.08,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-[#acd3b9]">
                  <span className="h-2 w-2 rounded-full bg-[#f5d98f]" /> Built
                  from your resume and market demand
                </div>
              </div>
              <div className="absolute -bottom-3 -left-1 hidden rounded-2xl bg-[#d8785e] px-5 py-4 text-sm font-bold text-white shadow-xl sm:block">
                <Target className="mb-3" size={19} />
                Find your edge.
              </div>
              <div className="absolute -right-1 -top-3 hidden rounded-2xl bg-[#7c3aed] px-5 py-4 text-sm font-bold text-white shadow-xl sm:block">
                <Sparkles className="mb-3" size={19} />
                Keep moving.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-5 text-sm text-[var(--ink-muted)] sm:grid-cols-3">
          <div>
            <strong className="block text-[var(--foreground)]">
              Your experience, in context
            </strong>
            <span>Not just a resume score. A clearer explanation.</span>
          </div>
          <div>
            <strong className="block text-[var(--foreground)]">
              The market, made readable
            </strong>
            <span>Not a noisy job board. A focused signal.</span>
          </div>
          <div>
            <strong className="block text-[var(--foreground)]">
              A next step you can use
            </strong>
            <span>Not a vague recommendation. A practical sprint.</span>
          </div>
        </div>
      </section>

      <section
        id="approach"
        className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="reveal-on-scroll flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--leaf)]">
                A workspace built around your direction
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-6xl">
                Insight is useful when it changes what you do next.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[var(--ink-muted)]">
              Three connected views give you the context to make a deliberate
              move, without adding more noise to your day.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {capabilities.map(([number, title, text]) => (
              <article
                key={number}
                className="reveal-on-scroll border-t-2 border-[var(--leaf)] pt-5"
              >
                <span className="text-sm font-bold text-[var(--leaf)]">
                  {number}
                </span>
                <h3 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">
                  {title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--ink-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll overflow-hidden bg-[#eef2eb] py-20 sm:py-28">
        <div className="mb-10 px-5 sm:px-8 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--leaf)]">
            Inside the workspace
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">
            Signals worth following.
          </h2>
        </div>
        <div className="grid gap-6 px-5 pb-4 sm:grid-cols-2 sm:px-8 lg:px-12 xl:grid-cols-3">
          {storyCards.map(({ type, title, text, color, image, icon: Icon }) => (
            <article
              key={type}
              className="group reveal-on-scroll overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_rgba(33,61,45,0.08)]"
            >
              <div
                className={`relative aspect-[16/9] overflow-hidden ${color}`}
              >
                <Image
                  src={image}
                  alt={type.toLowerCase()}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[var(--foreground)] shadow-sm backdrop-blur-sm">
                  <Icon size={22} />
                </div>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--leaf)]">
                  {type}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.04em]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
                  {text}
                </p>
                <Link
                  href="/register"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--leaf)]"
                >
                  Explore <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#1f4b3a] bg-[#233f33] text-white">
        <div className="relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#acd3b9]">
                <span className="h-px w-8 bg-[#f5d98f]" /> Career intelligence
              </div>
              <h2 className="max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#f6f7f2] sm:text-6xl">
                Make your next move count.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-[#c7d9cf]">
                Follow the signal, sharpen your edge, and move toward work that
                fits where you are going.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d98f] transition hover:text-white"
              >
                Build your signal <ArrowRight size={16} />
              </Link>
              <p className="mt-10 max-w-md text-xs leading-5 text-[#acd3b9]">
                Created by Achuta S, Adithya S, Charan G, and Lepaksh S Gujar.
                <br />
                Under the guidance of Mrs. Teja Shree V.
              </p>
            </div>
            <form
              onSubmit={submitContact}
              className="border-t border-[#527461] pt-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5d98f]">
                Start a conversation
              </p>
              <div className="mt-4 flex items-center gap-2 border-b border-[#789686] pb-2">
                <Mail size={16} className="text-[#acd3b9]" />
                <input
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#acd3b9]"
                />
              </div>
              <textarea
                required
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder="Tell us about your idea"
                rows={3}
                className="mt-4 w-full resize-none rounded-lg border border-[#527461] bg-[#1f382e] px-3 py-2 text-sm text-white outline-none placeholder:text-[#acd3b9] focus:border-[#f5d98f]"
              />
              <button
                type="submit"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d98f] transition hover:text-white"
              >
                Email the team <Send size={15} />
              </button>
            </form>
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-20 -right-4 text-[22rem] font-bold leading-none tracking-[-0.2em] text-[#2d5948]"
          >
            S
          </span>
        </div>
        <div className="border-t border-[#527461] px-5 py-4 text-center text-xs text-[#acd3b9] sm:px-8 lg:px-12">
          © 2026 SignalDesk. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
