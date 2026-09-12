"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import AppShell from "../layout/AppShell";
import AuthGuard from "../layout/AuthGuard";
import LoadingState, { ErrorState } from "../shared/LoadingState";
import { api } from "../../lib/api";
import { useApi } from "../../hooks/useApi";

export default function JobDetailView({ id }) {
  const jobRequest = useApi(api.getJob);
  const { execute: loadJob } = jobRequest;
  useEffect(() => {
    loadJob(id).catch(() => {});
  }, [id, loadJob]);
  if (jobRequest.loading && !jobRequest.data)
    return (
      <AppShell>
        <LoadingState label="Opening role" />
      </AppShell>
    );
  if (jobRequest.error)
    return (
      <AppShell>
        <ErrorState
          message={jobRequest.error}
          onRetry={() => jobRequest.execute(id)}
        />
      </AppShell>
    );
  const job = jobRequest.data?.job;
  if (!job) return null;
  return (
    <AppShell eyebrow="Job market">
      <Link
        href="/jobs"
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--leaf)]"
      >
        <ArrowLeft size={16} />
        Back to roles
      </Link>
      <article className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
            {job.source}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
            {job.title}
          </h1>
          <p className="mt-3 text-lg text-[var(--ink-muted)]">{job.company}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--ink-muted)]">
            <span className="flex items-center gap-2">
              <MapPin size={15} />
              {job.location?.fullLocation || "Location not listed"}
            </span>
            <span>{job.employmentType || "Open role"}</span>
          </div>
          <div className="my-8 h-px bg-[var(--line)]" />
          <h2 className="text-lg font-semibold">Role overview</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--ink-muted)]">
            {job.description || "No description was provided for this role."}
          </p>
        </div>
        <aside className="h-fit rounded-2xl bg-[#233f33] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#acd3b9]">
            Next step
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            Worth a closer look?
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#c7d9cf]">
            Review the requirements, then take the application to the source.
          </p>
          {job.applyLink && (
            <a
              href={job.applyLink}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5d98f] px-4 py-3 text-sm font-semibold text-[#233f33]"
            >
              Open application <ExternalLink size={15} />
            </a>
          )}
          <div className="mt-7 border-t border-white/15 pt-5">
            <p className="text-xs uppercase tracking-wider text-[#acd3b9]">
              Skills mentioned
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(job.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-[#d9e6dd]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </article>
    </AppShell>
  );
}
