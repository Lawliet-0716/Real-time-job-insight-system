"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileUp, RefreshCw, Target, X } from "lucide-react";
import AppShell from "../layout/AppShell";
import AuthGuard from "../layout/AuthGuard";
import LoadingState, { ErrorState } from "../shared/LoadingState";
import { api } from "../../lib/api";
import { useApi } from "../../hooks/useApi";

function ResumeContent() {
  const input = useRef(null);
  const [file, setFile] = useState(null);
  const [roadmapDuration, setRoadmapDuration] = useState(30);
  const resume = useApi(api.getResume);
  const upload = useApi(api.uploadResume);
  const analyze = useApi(api.analyzeResume);
  const { execute: loadResume } = resume;
  useEffect(() => {
    loadResume().catch(() => {});
  }, [loadResume]);
  async function submitUpload(event) {
    event.preventDefault();
    if (!file) return;
    try {
      await upload.execute(file, roadmapDuration);
      setFile(null);
      await resume.execute();
    } catch {}
  }
  async function reanalyze() {
    try {
      await analyze.execute(roadmapDuration);
      await resume.execute();
    } catch {}
  }
  if (resume.loading && !resume.data)
    return (
      <AppShell>
        <LoadingState label="Loading your resume lab" />
      </AppShell>
    );
  const data = resume.data?.data;
  return (
    <AppShell eyebrow="Resume lab">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
          Resume lab
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
          Make your experience easier to match.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
          Upload a PDF and let the market data show you what is already working,
          what is missing, and what to learn next.
        </p>
      </header>
      {upload.error && (
        <div className="mb-5 rounded-xl border border-[#f0c8bd] bg-[#fff5f1] p-4 text-sm text-[#8b493a]">
          {upload.error}
        </div>
      )}
      {resume.error && !data && (
        <ErrorState message={resume.error} onRetry={() => resume.execute()} />
      )}
      {!data && (
        <section className="rounded-2xl border border-dashed border-[var(--leaf)] bg-[var(--leaf-soft)] p-8 text-center sm:p-14">
          <FileUp className="mx-auto text-[var(--leaf)]" size={34} />
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
            Start with a PDF resume
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--ink-muted)]">
            The backend accepts the `resume` multipart field and processes files
            up to 5 MB.
          </p>
          <UploadForm
            input={input}
            file={file}
            setFile={setFile}
            duration={roadmapDuration}
            setDuration={setRoadmapDuration}
            onSubmit={submitUpload}
            loading={upload.loading}
            error={upload.error}
          />
        </section>
      )}
      {data && (
        <>
          <section className="mb-6 rounded-2xl border border-[var(--line)] bg-white p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                  Resume versions
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Upload another resume
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  Each upload is analyzed and becomes your active resume.
                </p>
              </div>
              <UploadForm
                input={input}
                file={file}
                setFile={setFile}
                duration={roadmapDuration}
                setDuration={setRoadmapDuration}
                onSubmit={submitUpload}
                loading={upload.loading}
                error={upload.error}
                compact
              />
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#233f33] p-6 text-white">
              <p className="text-xs uppercase tracking-wider text-[#acd3b9]">
                Target role
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {data.targetRole || "Not detected"}
              </p>
              <p className="mt-2 text-sm text-[#c7d9cf]">{data.fileName}</p>
            </div>
            <Score label="ATS score" value={data.atsScore} />
            <Score label="Market match" value={data.matchPercentage} />
          </section>
          <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                    Skill inventory
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Your current signal
                  </h2>
                </div>
                <Target className="text-[var(--sun)]" size={22} />
              </div>
              <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Matching
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data.matchingSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-3 py-1.5 text-xs font-medium text-[var(--leaf)]"
                    >
                      <Check size={13} />
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Worth adding
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data.missingSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-[#fbe8e2] px-3 py-1.5 text-xs font-medium text-[#9b4e3b]"
                    >
                      <X size={13} />
                      {skill}
                    </span>
                  ))}
                </div>
                <SkillCoverageGraph
                  matchingCount={(data.matchingSkills || []).length}
                  missingCount={(data.missingSkills || []).length}
                  matchPercentage={data.matchPercentage}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                {data.roadmapDuration || roadmapDuration}-day roadmap
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                A practical next sprint
              </h2>
              <div className="mt-5 max-h-[560px] space-y-4 overflow-y-auto pr-3">
                {(data.roadmap || []).map((week) => (
                  <div
                    key={week.week}
                    className="border-l-2 border-[var(--leaf-soft)] pl-4"
                  >
                    <p className="text-sm font-semibold">{week.week}</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--ink-muted)]">
                      {week.tasks.map((task) => (
                        <li key={task}>· {task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">Keep the analysis fresh</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Re-run market comparison and regenerate your recommendations.
              </p>
            </div>
            <button
              onClick={reanalyze}
              disabled={analyze.loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--leaf)] px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={analyze.loading ? "animate-spin" : ""}
              />
              {analyze.loading ? "Analyzing..." : "Re-analyze resume"}
            </button>
            <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold text-[var(--ink-muted)]">
              Roadmap
              <select
                value={roadmapDuration}
                onChange={(event) =>
                  setRoadmapDuration(Number(event.target.value))
                }
                className="bg-transparent text-sm text-[var(--foreground)] outline-none"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="120">120 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </label>
          </section>
          {analyze.error && (
            <div className="mt-4">
              <ErrorState message={analyze.error} />
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

function SkillCoverageGraph({ matchingCount, missingCount, matchPercentage }) {
  const totalSkills = matchingCount + missingCount;
  const calculatedMatch =
    totalSkills > 0 ? Math.round((matchingCount / totalSkills) * 100) : 0;
  const match = Math.min(
    100,
    Math.max(
      0,
      Number.isFinite(Number(matchPercentage))
        ? Number(matchPercentage)
        : calculatedMatch,
    ),
  );
  const gap = 100 - match;

  return (
    <div className="mt-8 border-t border-[var(--line)] pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
            Skill coverage
          </p>
          <h3 className="mt-2 text-lg font-semibold">
            {gap}% behind current market demand
          </h3>
        </div>
        <span className="text-2xl font-semibold text-[var(--leaf)]">
          {match}%
        </span>
      </div>
      <div
        className="mt-4 flex h-4 overflow-hidden rounded-full bg-[#fbe8e2]"
        role="img"
        aria-label={`${match}% matching skills and ${gap}% missing skills`}
      >
        <div
          className="bg-[var(--leaf)] transition-all"
          style={{ width: `${match}%` }}
        />
        <div className="flex-1 bg-[#e8a18d]" />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--ink-muted)]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--leaf)]" />
          {matchingCount} matched skills
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8a18d]" />
          {missingCount} skills to build
        </span>
      </div>
    </div>
  );
}

function Score({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <p className="text-xs uppercase tracking-wider text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
        {value ?? 0}
        <span className="text-xl text-[var(--ink-muted)]">%</span>
      </p>
    </div>
  );
}
function UploadForm({
  input,
  file,
  setFile,
  duration,
  setDuration,
  onSubmit,
  loading,
  error,
  compact = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "w-full max-w-xl" : "mx-auto mt-7 max-w-md"}
    >
      <input
        ref={input}
        type="file"
        accept="application/pdf"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="sr-only"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left text-sm font-semibold"
        >
          {file ? file.name : "Choose PDF"}
        </button>
        <label className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold text-[var(--ink-muted)]">
          Roadmap
          <select
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="bg-transparent text-sm text-[var(--foreground)] outline-none"
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="120">120 days</option>
            <option value="180">180 days</option>
            <option value="365">365 days</option>
          </select>
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-[#9b4e3b]">{error}</p>}
      <button
        disabled={!file || loading}
        className="mt-3 h-11 w-full rounded-xl bg-[var(--leaf)] text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Analyzing file..." : "Upload and analyze"}
      </button>
    </form>
  );
}
export default function ResumeView() {
  return (
    <AuthGuard>
      <ResumeContent />
    </AuthGuard>
  );
}
