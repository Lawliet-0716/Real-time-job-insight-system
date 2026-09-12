"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, RefreshCw, Search } from "lucide-react";
import AppShell from "../layout/AppShell";
import AuthGuard from "../layout/AuthGuard";
import LoadingState, { ErrorState } from "../shared/LoadingState";
import { api } from "../../lib/api";
import { useApi } from "../../hooks/useApi";

function JobsContent() {
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    sort: "latest",
    page: 1,
    limit: 10,
  });
  const jobs = useApi(api.getJobs);
  const sync = useApi(api.syncJobs);
  const { execute: loadJobs } = jobs;
  useEffect(() => {
    loadJobs(filters).catch(() => {});
  }, [filters, loadJobs]);
  function update(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
      page: 1,
    }));
  }
  async function synchronize() {
    await sync.execute({
      query: filters.query || "Software Engineer",
      location: filters.location || "India",
      page: 1,
    });
    await jobs.execute(filters);
  }
  const payload = jobs.data || {};
  return (
    <AppShell eyebrow="Job market">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
            Live index
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
            Find the signal in the listings.
          </h1>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            Search the jobs currently indexed by your market workspace.
          </p>
        </div>
        <button
          onClick={synchronize}
          disabled={sync.loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold transition hover:border-[var(--leaf)] disabled:opacity-50"
        >
          <RefreshCw size={16} className={sync.loading ? "animate-spin" : ""} />
          {sync.loading ? "Syncing..." : "Sync jobs"}
        </button>
      </header>
      {sync.error && (
        <div className="mb-5">
          <ErrorState message={sync.error} />
        </div>
      )}
      <section className="mb-6 grid gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 md:grid-cols-[1.5fr_1fr_0.65fr]">
        <label className="relative">
          <Search
            className="absolute left-3 top-3 text-[var(--ink-muted)]"
            size={17}
          />
          <input
            name="query"
            value={filters.query}
            onChange={update}
            placeholder="Role, company, or skill"
            className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] pl-10 pr-3 text-sm outline-none focus:border-[var(--leaf)]"
          />
        </label>
        <input
          name="location"
          value={filters.location}
          onChange={update}
          placeholder="Location"
          className="h-11 rounded-xl border border-[var(--line)] bg-[#fbfcf9] px-3 text-sm outline-none focus:border-[var(--leaf)]"
        />
        <select
          name="sort"
          value={filters.sort}
          onChange={update}
          className="h-11 rounded-xl border border-[var(--line)] bg-[#fbfcf9] px-3 text-sm outline-none focus:border-[var(--leaf)]"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company</option>
          <option value="title">Title</option>
        </select>
      </section>
      {jobs.loading && !jobs.data ? (
        <LoadingState label="Reading the job market" />
      ) : jobs.error ? (
        <ErrorState
          message={jobs.error}
          onRetry={() => jobs.execute(filters)}
        />
      ) : (
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7">
          <div className="mb-4 flex justify-between text-sm text-[var(--ink-muted)]">
            <span>{payload.totalJobs ?? 0} indexed roles</span>
            <span>
              Page {payload.page || 1} of {payload.totalPages || 1}
            </span>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {(payload.jobs || []).map((job) => (
              <Link
                href={`/jobs/${job._id}`}
                key={job._id}
                className="group block py-5 first:pt-2"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-semibold group-hover:text-[var(--leaf)]">
                        {job.title}
                      </h2>
                      {job.isRemote && (
                        <span className="rounded-full bg-[var(--leaf-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--leaf)]">
                          Remote
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[var(--ink-muted)]">
                      {job.company} · {job.employmentType || "Full time"}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="text-[var(--ink-muted)] group-hover:text-[var(--leaf)]"
                    size={18}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--ink-muted)]">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {job.location?.fullLocation ||
                      job.location?.country ||
                      "Location not listed"}
                  </span>
                  <span>{job.source}</span>
                  <span>{job.salary?.text || "Salary not specified"}</span>
                </div>
              </Link>
            ))}
            {(!payload.jobs || payload.jobs.length === 0) && (
              <div className="py-12 text-center text-sm text-[var(--ink-muted)]">
                No roles match these filters.
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              disabled={(payload.page || 1) <= 1}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: current.page - 1,
                }))
              }
              className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={(payload.page || 1) >= (payload.totalPages || 1)}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
              className="rounded-lg bg-[var(--leaf)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </AppShell>
  );
}

export default function JobsView() {
  return (
    <AuthGuard>
      <JobsContent />
    </AuthGuard>
  );
}
