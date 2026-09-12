import { Activity } from "lucide-react";

export default function MetricCard({
  label,
  value,
  note,
  tone = "green",
  icon: Icon = Activity,
}) {
  const tones = {
    green: "bg-[var(--leaf-soft)] text-[var(--leaf)]",
    yellow: "bg-[#fff3d7] text-[#936b19]",
    coral: "bg-[#fbe8e2] text-[#9b4e3b]",
  };

  return (
    <article className="rise-in rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_10px_30px_rgba(33,61,45,0.04)]">
      <div
        className={`mb-6 flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${tones[tone]}`}
      >
        <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
      </div>
      <p className="text-sm text-[var(--ink-muted)]">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-2 text-xs text-[var(--ink-muted)]">{note}</p>
    </article>
  );
}
