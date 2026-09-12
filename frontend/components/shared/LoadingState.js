export default function LoadingState({ label = "Loading workspace" }) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-white/60">
      <div className="flex items-center gap-3 text-sm text-[var(--ink-muted)]">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--leaf)]" />
        {label}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-[#f0c8bd] bg-[#fff5f1] p-5 text-sm text-[#8b493a]">
      <p>{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-3 font-semibold underline underline-offset-4"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
