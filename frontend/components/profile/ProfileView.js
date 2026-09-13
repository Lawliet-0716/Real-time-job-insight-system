"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, FileUp, ImagePlus, Save } from "lucide-react";
import AppShell from "../layout/AppShell";
import AuthGuard from "../layout/AuthGuard";
import LoadingState, { ErrorState } from "../shared/LoadingState";
import { api, getAssetUrl } from "../../lib/api";
import { useApi } from "../../hooks/useApi";

export default function ProfileView() {
  const profile = useApi(api.getProfile);
  const update = useApi(api.updateProfile);
  const [form, setForm] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const pictureInput = useRef(null);
  const resumeInput = useRef(null);
  const previewUrl = useRef("");
  const { execute: loadProfile } = profile;
  useEffect(() => {
    loadProfile()
      .then((result) => setForm(result.user))
      .catch(() => {});
  }, [loadProfile]);
  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );
  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }
  async function submit(event) {
    event.preventDefault();
    try {
      const body = new FormData();
      const fields = {
        fullName: form.fullName,
        phone: form.phone,
        headline: form.headline,
        education: form.education,
        experience: form.experience,
        preferredRole: form.preferredRole,
        preferredLocation: form.preferredLocation,
        skills: JSON.stringify(form.skills || []),
        certifications: JSON.stringify(form.certifications || []),
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
      };
      Object.entries(fields).forEach(([key, value]) =>
        body.append(key, value || ""),
      );
      if (profilePicture) body.append("profilePicture", profilePicture);
      if (resumeFile) body.append("resume", resumeFile);
      const result = await update.execute(body);
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = "";
      setForm(result.user);
      setProfilePicture(null);
      setResumeFile(null);
      setProfilePreview("");
    } catch {}
  }
  if (profile.loading && !form)
    return (
      <AppShell>
        <LoadingState label="Loading your profile" />
      </AppShell>
    );
  if (profile.error && !form)
    return (
      <AppShell>
        <ErrorState message={profile.error} onRetry={() => profile.execute()} />
      </AppShell>
    );
  return (
    <AppShell eyebrow="Profile">
      <div className="w-full max-w-none">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
            Your profile
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
            Tune the context behind your signal.
          </h1>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            These preferences help you interpret roles and personalize your next
            move.
          </p>
        </header>
        <form
          onSubmit={submit}
          className="w-full max-w-none rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-8"
        >
          <div className="mb-7 flex flex-col gap-4 border-b border-[var(--line)] pb-7 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--leaf-soft)] text-[var(--leaf)]">
              {profilePreview || form?.profilePicture ? (
                <img
                  src={profilePreview || getAssetUrl(form.profilePicture)}
                  alt="Profile"
                  className="h-auto w-auto max-h-full max-w-full object-contain"
                />
              ) : (
                <ImagePlus size={28} />
              )}
            </div>
            <div>
              <p className="font-semibold">Profile picture</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Add a clear photo to personalize your profile.
              </p>
              <input
                ref={pictureInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  if (previewUrl.current)
                    URL.revokeObjectURL(previewUrl.current);
                  const file = event.target.files?.[0] || null;
                  previewUrl.current = file ? URL.createObjectURL(file) : "";
                  setProfilePicture(file);
                  setProfilePreview(previewUrl.current);
                }}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => pictureInput.current?.click()}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--line)] px-3 text-sm font-semibold"
              >
                <ImagePlus size={16} /> Choose photo
              </button>
            </div>
            <div className="mt-0 flex w-full flex-col justify-between gap-4 rounded-xl border border-[var(--line)] bg-[#fbfcf9] p-4 sm:ml-auto sm:w-auto sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3d7] text-[#936b19]">
                  <FileUp size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Your resume</p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    {resumeFile?.name ||
                      form?.resumeFileName ||
                      "No resume uploaded yet"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {form?.resumeFile && (
                  <a
                    href={getAssetUrl(form.resumeFile)}
                    download={form.resumeFileName || "resume.pdf"}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--line)] px-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--leaf)] hover:text-[var(--leaf)]"
                  >
                    <Download size={16} /> Download
                  </a>
                )}
                <input
                  ref={resumeInput}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) =>
                    setResumeFile(event.target.files?.[0] || null)
                  }
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => resumeInput.current?.click()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--leaf)] px-3 text-sm font-semibold text-white transition hover:bg-[#245b45]"
                >
                  <FileUp size={16} />{" "}
                  {form?.resumeFile ? "Replace resume" : "Upload resume"}
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["email", "Email"],
              ["phone", "Phone number"],
              ["headline", "Professional headline"],
              ["preferredRole", "Preferred role"],
              ["preferredLocation", "Preferred location"],
              ["experience", "Experience"],
              ["linkedin", "LinkedIn URL"],
              ["github", "GitHub URL"],
              ["portfolio", "Portfolio URL"],
            ].map(([name, label]) => (
              <label key={name} className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  {label}
                </span>
                <input
                  name={name}
                  value={form?.[name] || ""}
                  onChange={change}
                  disabled={name === "email"}
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] px-3 text-sm outline-none focus:border-[var(--leaf)] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            ))}
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Education and qualifications
            </span>
            <textarea
              name="education"
              value={form?.education || ""}
              onChange={change}
              rows={4}
              placeholder="B.Tech in Computer Science, certifications, graduation year..."
              className="w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] px-3 py-3 text-sm outline-none focus:border-[var(--leaf)]"
            />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Skills
            </span>
            <input
              name="skills"
              value={Array.isArray(form?.skills) ? form.skills.join(", ") : ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  skills: event.target.value
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="JavaScript, SQL, Docker"
              className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] px-3 text-sm outline-none focus:border-[var(--leaf)]"
            />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Certifications
            </span>
            <input
              name="certifications"
              value={
                Array.isArray(form?.certifications)
                  ? form.certifications.join(", ")
                  : ""
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  certifications: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="AWS Cloud Practitioner, Scrum Master"
              className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfcf9] px-3 text-sm outline-none focus:border-[var(--leaf)]"
            />
          </label>
          <div className="mt-7 flex items-center justify-between gap-3">
            {update.data ? (
              <span className="flex items-center gap-2 text-sm text-[var(--leaf)]">
                <Check size={16} />
                Saved
              </span>
            ) : (
              <span>
                {update.error && (
                  <span className="text-sm text-[#9b4e3b]">{update.error}</span>
                )}
              </span>
            )}
            <button
              disabled={update.loading}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--leaf)] px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save size={16} />
              {update.loading ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
