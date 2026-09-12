"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  FileCheck2,
  Globe2,
  MapPin,
  Radar,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AppShell from "../layout/AppShell";
import AuthGuard from "../layout/AuthGuard";
import LoadingState, { ErrorState } from "../shared/LoadingState";
import MetricCard from "../shared/MetricCard";
import { api } from "../../lib/api";
import { useApi } from "../../hooks/useApi";

const skillColors = [
  {
    row: "border-transparent bg-white/60",
    rank: "text-[#5b21b6]",
    bar: "bg-[#5b21b6]",
    signal: "text-[#5b21b6]",
  },
  {
    row: "border-transparent bg-white/60",
    rank: "text-[#5b21b6]",
    bar: "bg-[#7c3aed]",
    signal: "text-[#5b21b6]",
  },
  {
    row: "border-transparent bg-white/60",
    rank: "text-[#5b21b6]",
    bar: "bg-[#a78bfa]",
    signal: "text-[#5b21b6]",
  },
  {
    row: "border-transparent bg-white/60",
    rank: "text-[#5b21b6]",
    bar: "bg-[#ddd6fe]",
    signal: "text-[#5b21b6]",
  },
  {
    row: "border-transparent bg-white/60",
    rank: "text-[#5b21b6]",
    bar: "bg-[#f3e8ff]",
    signal: "text-[#5b21b6]",
  },
];

const dailyVolumeColors = [
  "bg-[#0284c7] group-hover:bg-[#0369a1]",
  "bg-[#0ea5e9] group-hover:bg-[#0284c7]",
  "bg-[#38bdf8] group-hover:bg-[#0ea5e9]",
  "bg-[#7dd3fc] group-hover:bg-[#38bdf8]",
  "bg-[#f0f9ff] group-hover:bg-[#7dd3fc]",
];

function DashboardContent() {
  const dashboard = useApi(api.getDashboard);
  const market = useApi(api.getMarket);
  const { execute: loadDashboard } = dashboard;
  const { execute: loadMarket } = market;
  useEffect(() => {
    loadDashboard().catch(() => {});
  }, [loadDashboard]);
  useEffect(() => {
    loadMarket().catch(() => {});
  }, [loadMarket]);

  if (dashboard.loading && !dashboard.data)
    return (
      <AppShell>
        <LoadingState label="Gathering your market signals" />
      </AppShell>
    );
  if (dashboard.error && !dashboard.data)
    return (
      <AppShell>
        <ErrorState
          message={dashboard.error}
          onRetry={() => dashboard.execute()}
        />
      </AppShell>
    );

  const data = dashboard.data?.data;
  const stats = data?.stats || {};
  const resume = data?.resume;
  const jobs = data?.recentJobs || [];
  const marketData = market.data;
  const skills = data?.trendingSkills || [];
  const dailyTrend = marketData?.dailyTrend || [];
  const maxDailyJobs = Math.max(...dailyTrend.map((day) => day.count || 0), 1);
  const maxDemand = Math.max(
    ...skills.map((skill) => skill.count || skill.demandCount || 0),
    1,
  );
  const latestSkillUpdate =
    data?.skillsLastUpdated ||
    skills
      .map((skill) => skill.lastUpdated)
      .filter(Boolean)
      .sort()
      .at(-1);

  function formatUpdateDate(value) {
    if (!value) return "Waiting for the first market sync";
    return `Updated ${new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value))}`;
  }

  return (
    <AppShell>
      <header className="rise-in mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--leaf)]">
            Career intelligence
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            See where your next move is hiding.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
            A live read on your resume fit, the skills employers are asking for,
            and the roles worth your attention.
          </p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--leaf)] px-4 text-sm font-semibold text-white transition hover:bg-[#245b45]"
        >
          Explore jobs <ArrowUpRight size={16} />
        </Link>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Jobs in market"
          icon={BriefcaseBusiness}
          value={marketData?.totalJobs ?? stats.totalJobs ?? "—"}
          note={
            marketData
              ? `${marketData.jobs24h || 0} added in the last 24h`
              : "Across the current index"
          }
        />
        <MetricCard
          label="Remote roles"
          icon={Globe2}
          value={stats.remoteJobs ?? "—"}
          note="Open to location-flexible work"
          tone="yellow"
        />
        <MetricCard
          label="Resume fit"
          icon={FileCheck2}
          value={stats.resumeScore ? `${Math.round(stats.resumeScore)}%` : "—"}
          note={
            resume?.targetRole
              ? `For ${resume.targetRole}`
              : "Upload a resume to begin"
          }
          tone="coral"
        />
        <MetricCard
          label="Trending skills"
          icon={Radar}
          value={
            data?.trendingSkills?.length ?? stats.totalTrendingSkills ?? "—"
          }
          note={
            marketData
              ? "In-demand skills from live job data"
              : "Skills tracked from job demand"
          }
        />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="page-grid rounded-2xl border border-[var(--line)] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--leaf)]">
                Top skills right now
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                Trending skills
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
                <Clock3 size={13} /> {formatUpdateDate(latestSkillUpdate)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-full bg-[#fff3d7] px-3 py-1.5 text-xs font-semibold text-[#936b19] sm:flex">
                <TrendingUp size={13} /> Live demand
              </span>
              <Sparkles className="text-[var(--sun)]" size={22} />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {skills.slice(0, 5).map((skill, index) => {
              const demand = skill.count || skill.demandCount || 0;
              const percentageValue = Number(skill.percentage ?? skill.change);
              const percentage = Number.isFinite(percentageValue)
                ? percentageValue
                : null;
              const share = Math.max(8, Math.round((demand / maxDemand) * 100));
              const colors = skillColors[index % skillColors.length];
              return (
                <div
                  key={skill.skill}
                  className={`rounded-xl border p-3 transition hover:bg-white ${colors.row}`}
                >
                  <div className="mb-2 flex items-center gap-3 text-sm">
                    <span className={`w-5 text-xs font-bold ${colors.rank}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold">
                      {skill.skill}
                    </span>
                    {index < 3 && (
                      <span className="hidden items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--leaf)] sm:flex">
                        <TrendingUp size={11} /> Booming
                      </span>
                    )}
                    {percentage !== null ? (
                      <span
                        className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${colors.signal}`}
                      >
                        <TrendingUp size={13} /> {percentage}%
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-[var(--ink-muted)]">
                        Change unavailable
                      </span>
                    )}
                    <span className="text-xs text-[var(--ink-muted)]">
                      {demand} {demand === 1 ? "role" : "roles"}
                    </span>
                  </div>
                  <div className="ml-8 h-2 overflow-hidden rounded-full bg-[#e9eee8]">
                    <div
                      className={`h-full rounded-full ${colors.bar}`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {skills.length === 0 && (
              <div className="rounded-xl border border-dashed border-[var(--line)] p-6 text-center">
                <p className="text-sm text-[var(--ink-muted)]">
                  Skill trends will appear after jobs are synchronized.
                </p>
                <button
                  onClick={() => dashboard.execute()}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--leaf)]"
                >
                  <RefreshCw size={14} /> Refresh market data
                </button>
              </div>
            )}
          </div>
          {dailyTrend.length > 0 && (
            <div className="mt-8 border-t border-[var(--line)] pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    Daily volume
                  </p>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">
                    New jobs scanned over the last week
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--leaf)]">
                  {marketData.jobs24h?.toLocaleString() || 0} today
                </span>
              </div>
              <div className="flex h-24 items-end gap-2">
                {dailyTrend.map((day, index) => (
                  <div
                    key={day.date}
                    className="group flex min-w-0 flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`w-full rounded-t-md transition ${dailyVolumeColors[index % dailyVolumeColors.length]}`}
                      style={{
                        height: `${Math.max(10, Math.round((day.count / maxDailyJobs) * 72))}px`,
                      }}
                      title={`${day.count.toLocaleString()} jobs on ${day.date}`}
                    />
                    <span className="text-[10px] text-[var(--ink-muted)]">
                      {new Date(day.date).toLocaleDateString("en", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl bg-[#233f33] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#acd3b9]">
            Resume lab
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            {resume
              ? `${resume.atsScore}% ready for ${resume.targetRole}`
              : "Turn your resume into a signal."}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#c7d9cf]">
            {resume
              ? `${resume.missingSkills?.length || 0} skills are worth adding to your next learning sprint.`
              : "Upload a PDF to see your market match, gaps, and a practical roadmap."}
          </p>
          <Link
            href="/resume"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d98f]"
          >
            Open resume lab <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--leaf)]">
              Fresh opportunities
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Recently indexed
            </h2>
          </div>
          <Link
            href="/jobs"
            className="text-sm font-semibold text-[var(--leaf)]"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {jobs.slice(0, 5).map((job) => (
            <Link
              href={`/jobs/${job._id}`}
              key={job._id}
              className="flex flex-col gap-2 py-4 transition hover:bg-[#fafcf9] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {job.company} ·{" "}
                  {job.location?.fullLocation ||
                    job.location?.country ||
                    "Location not listed"}
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs text-[var(--ink-muted)]">
                <MapPin size={13} />
                {job.isRemote ? "Remote" : job.employmentType || "Open role"}
              </span>
            </Link>
          ))}
          {jobs.length === 0 && (
            <p className="py-6 text-sm text-[var(--ink-muted)]">
              No jobs have been indexed yet.
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
}

export default function DashboardView() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
