"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { api, clearToken, setToken } from "../../lib/api";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await (isRegister
        ? api.register(form)
        : api.login({ email: form.email, password: form.password }));

      if (isRegister) {
        clearToken();
        router.push("/login");
        return;
      }

      setToken(result.token);
      router.push("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-grid flex min-h-screen items-center justify-center px-5 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_20px_70px_rgba(33,61,45,0.1)] md:grid-cols-[0.8fr_1.2fr]">
        <div className="hidden bg-[#233f33] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8fc6a1] font-bold text-[#173b2d]">
                S
              </span>
              <strong className="text-lg">SignalDesk</strong>
            </div>
            <h1 className="mt-20 text-4xl font-semibold leading-tight tracking-[-0.06em]">
              Make the market legible.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#c7d9cf]">
              Your resume, live job demand, and next learning sprint in one
              quiet workspace.
            </p>
          </div>
          <p className="text-xs text-[#acd3b9]">
            Job market intelligence for deliberate moves.
          </p>
        </div>
        <div className="p-7 sm:p-11">
          <div className="mb-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
              {isRegister ? "Create workspace" : "Welcome back"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              {isRegister
                ? "Start with your signal."
                : "Pick up where you left off."}
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              {isRegister
                ? "Build a clearer read on your next role."
                : "Your market view is waiting."}
            </p>
          </div>
          {error && (
            <div className="mb-5 rounded-xl border border-[#f0c8bd] bg-[#fff5f1] p-3 text-sm text-[#8b493a]">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Full name
                </span>
                <div className="relative">
                  <UserRound
                    className="absolute left-3 top-3.5 text-[var(--ink-muted)]"
                    size={17}
                  />
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={update}
                    className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] pl-10 pr-3 text-sm outline-none focus:border-[var(--leaf)]"
                    placeholder="Your name"
                  />
                </div>
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Email
              </span>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3.5 text-[var(--ink-muted)]"
                  size={17}
                />
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] pl-10 pr-3 text-sm outline-none focus:border-[var(--leaf)]"
                  placeholder="you@example.com"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Password
              </span>
              <div className="relative">
                <LockKeyhole
                  className="absolute left-3 top-3.5 text-[var(--ink-muted)]"
                  size={17}
                />
                <input
                  required
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={update}
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] pl-10 pr-3 text-sm outline-none focus:border-[var(--leaf)]"
                  placeholder="At least 8 characters"
                />
              </div>
            </label>
            <button
              disabled={loading}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--leaf)] text-sm font-semibold text-white transition hover:bg-[#245b45] disabled:cursor-wait disabled:opacity-60"
            >
              {loading
                ? "Working..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-[var(--ink-muted)]">
            {isRegister ? "Already have an account?" : "New to SignalDesk?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-semibold text-[var(--leaf)]"
            >
              {isRegister ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
