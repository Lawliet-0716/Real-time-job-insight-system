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
  const { execute: loadDashboard } = dashboard;
  useEffect(() => {
    loadDashboard().catch(() => {});
  }, [loadDashboard]);

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
  const skillsToLearn = resume?.skillsToLearn ?? resume?.missingSkills ?? [];
  const jobs = data?.recentJobs || [];
  const skills = data?.trendingSkills || [];
  const dailyTrend = data?.dailyTrend || [];
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
      timeZone: "UTC",
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
          value={stats.totalJobs ?? "—"}
          note={`${stats.jobs24h || 0} added in the last 24h`}
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
          note={"In-demand skills from stored job data"}
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
                  {stats.jobs24h?.toLocaleString() || 0} today
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
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex min-h-[520px] flex-col rounded-2xl bg-[#233f33] p-6 text-white sm:p-8 xl:min-h-[620px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#acd3b9]">
                Resume lab
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                {resume
                  ? "Your resume is becoming a signal."
                  : "Build your career signal."}
              </h2>
            </div>
            <span className="text-4xl font-semibold tracking-[-0.06em] text-[#f5d98f]">
              {resume ? `${Math.round(resume.atsScore || 0)}%` : "0%"}
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#416354]">
            <div
              className="h-full rounded-full bg-[#f5d98f] transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, resume?.atsScore || 0))}%`,
              }}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#c7d9cf]">
            {resume
              ? `${skillsToLearn.length} skills are worth adding to your next learning sprint for ${resume.targetRole || "your target role"}.`
              : "Upload a PDF to see your market match, skill gaps, and a practical roadmap built around your experience."}
          </p>
          {resume ? (
            <>
              <div className="mt-5 grid grid-cols-3 divide-x divide-[#527461] border-y border-[#527461] py-4">
                <div className="pr-3">
                  <p className="text-xl font-semibold text-[#f6f7f2]">
                    {Math.round(resume.atsScore || 0)}%
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#acd3b9]">
                    ATS score
                  </p>
                </div>
                <div className="px-3">
                  <p className="text-xl font-semibold text-[#f6f7f2]">
                    {Math.round(resume.matchPercentage || 0)}%
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#acd3b9]">
                    Market match
                  </p>
                </div>
                <div className="pl-3">
                  <p className="text-xl font-semibold text-[#f6f7f2]">
                    {resume.extractedSkills?.length || 0}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#acd3b9]">
                    Skills found
                  </p>
                </div>
              </div>
              {skillsToLearn.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#acd3b9]">
                    Next focus
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skillsToLearn.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#527461] px-2.5 py-1 text-xs text-[#d9e6dd]"
                      >
                        {skill}
                      </span>
                    ))}
                    {skillsToLearn.length > 5 && (
                      <span className="px-1 py-1 text-xs text-[#acd3b9]">
                        +{skillsToLearn.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              {resume.roadmap?.[0] && (
                <div className="mt-6 rounded-xl border border-[#527461] bg-[#1f382e] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#acd3b9]">
                      Next sprint
                    </p>
                    <span className="text-xs font-semibold text-[#f5d98f]">
                      {resume.roadmap[0].week}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-5 text-[#d9e6dd]">
                    {(resume.roadmap[0].tasks || []).slice(0, 3).map((task) => (
                      <li key={task} className="flex gap-2">
                        <span className="text-[#f5d98f]">-</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="mt-5 space-y-3 border-t border-[#527461] pt-5 text-sm text-[#d9e6dd]">
              <div className="flex items-center justify-between">
                <span>Resume strength and ATS score</span>
                <span className="text-[#f5d98f]">01</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Market skills you already match</span>
                <span className="text-[#f5d98f]">02</span>
              </div>
              <div className="flex items-center justify-between">
                <span>A focused learning roadmap</span>
                <span className="text-[#f5d98f]">03</span>
              </div>
            </div>
          )}
          <Link
            href="/resume"
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5d98f] px-4 py-3 text-sm font-semibold text-[#233f33] transition hover:bg-[#ffe6a8]"
          >
            {resume ? "Open resume lab" : "Upload your resume"}{" "}
            <ArrowUpRight size={15} />
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
