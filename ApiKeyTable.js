import { useState, useCallback } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function maskKey(key = "") {
  if (!key) return "—";
  const visible = key.slice(0, 14);
  return `${visible}${"•".repeat(16)}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year:   "numeric",
    month:  "short",
    day:    "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const active = status === "active";
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
        font-mono text-[10px] font-bold uppercase tracking-widest
        ${active
          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25"
          : "bg-red-500/10    text-red-400    ring-1 ring-red-500/25"}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-400 animate-pulse" : "bg-red-400"
        }`}
      />
      {active ? "Active" : "Revoked"}
    </span>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ value, disabled }) {
  const [state, setState] = useState("idle"); // idle | copied | error

  const handleCopy = useCallback(async () => {
    if (disabled || !value) return;
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [value, disabled]);

  const label =
    state === "copied" ? "✓ Copied"
    : state === "error" ? "✗ Failed"
    : "⎘";

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      title="Copy full key"
      aria-label="Copy API key"
      className={`
        grid h-7 w-7 place-items-center rounded-md border text-[11px]
        font-bold transition-all duration-200
        ${state === "copied"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          : state === "error"
          ? "border-red-500/40 bg-red-500/10 text-red-400"
          : "border-zinc-700/60 bg-zinc-800/50 text-zinc-500 hover:border-zinc-500 hover:text-zinc-200"}
        disabled:cursor-not-allowed disabled:opacity-30
      `}
    >
      {state === "idle" ? "⎘" : state === "copied" ? "✓" : "✗"}
    </button>
  );
}

// ── Revoke Button ─────────────────────────────────────────────────────────────

function RevokeButton({ id, status, revoking, onRevoke }) {
  const isThisOne  = revoking === id;
  const isRevoked  = status === "revoked";
  const isDisabled = isRevoked || revoking !== null;

  return (
    <button
      onClick={() => !isDisabled && onRevoke(id)}
      disabled={isDisabled}
      aria-label={isRevoked ? "Already revoked" : "Revoke this key"}
      title={isRevoked ? "Already revoked" : isDisabled ? "Another key is being revoked" : "Revoke key"}
      className={`
        inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5
        text-xs font-semibold transition-all duration-200
        ${isRevoked
          ? "cursor-default border-zinc-800/60 text-zinc-600"
          : isDisabled
          ? "cursor-not-allowed border-zinc-800/60 text-zinc-600 opacity-40"
          : "border-red-500/25 bg-red-500/5 text-red-400 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300 active:scale-95"}
      `}
    >
      {isThisOne ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-red-500/30 border-t-red-400" />
          Revoking…
        </>
      ) : isRevoked ? (
        "Revoked"
      ) : (
        <>
          <span aria-hidden="true">⊘</span>
          Revoke
        </>
      )}
    </button>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow({ index }) {
  return (
    <tr
      className="border-b border-zinc-800/50"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {[120, 180, 72, 140, 80].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3.5 animate-pulse rounded bg-zinc-800"
            style={{ width: w, animationDelay: `${index * 60 + i * 20}ms` }}
          />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard({ index }) {
  return (
    <div
      className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 space-y-3"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-28 animate-pulse rounded bg-zinc-800" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-800" />
      </div>
      <div className="h-9 w-full animate-pulse rounded-lg bg-zinc-800" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
        <div className="h-7 w-20 animate-pulse rounded-lg bg-zinc-800" />
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl text-zinc-600">
            ⚿
          </div>
          <p className="text-sm font-semibold text-zinc-400">No API keys found</p>
          <p className="mt-1 text-xs text-zinc-600">Generate a key above to get started.</p>
        </div>
      </td>
    </tr>
  );
}

function EmptyCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl text-zinc-600">
        ⚿
      </div>
      <p className="text-sm font-semibold text-zinc-400">No API keys found</p>
      <p className="mt-1 text-xs text-zinc-600">Generate a key above to get started.</p>
    </div>
  );
}

// ── Desktop Table Row ─────────────────────────────────────────────────────────

function TableRow({ apiKey, revoking, onRevoke }) {
  const [revealed, setRevealed] = useState(false);
  const { id, key, label, status, createdAt } = apiKey;
  const isRevoked = status === "revoked";

  return (
    <tr className="group border-b border-zinc-800/50 transition-colors duration-150 hover:bg-zinc-900/40">
      {/* Label */}
      <td className="px-4 py-3.5">
        <span className="text-sm font-semibold text-zinc-200">{label || "—"}</span>
      </td>

      {/* Key */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <code
            className={`
              max-w-[190px] truncate rounded-md bg-zinc-900/80 px-2.5 py-1
              font-mono text-xs ring-1 ring-inset ring-zinc-800
              transition-colors duration-300
              ${revealed ? "text-cyan-300" : "text-zinc-500 tracking-widest"}
            `}
          >
            {revealed ? key : maskKey(key)}
          </code>
          <button
            onClick={() => !isRevoked && setRevealed((v) => !v)}
            disabled={isRevoked}
            title={revealed ? "Hide key" : "Reveal key"}
            aria-label={revealed ? "Hide API key" : "Reveal API key"}
            className="
              grid h-7 w-7 place-items-center rounded-md border border-zinc-700/60
              bg-zinc-800/50 text-xs text-zinc-500
              transition-all duration-200
              hover:border-zinc-500 hover:text-zinc-200
              disabled:cursor-not-allowed disabled:opacity-30
            "
          >
            {revealed ? "○" : "●"}
          </button>
          <CopyButton value={key} disabled={isRevoked || !revealed} />
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={status} />
      </td>

      {/* Created At */}
      <td className="px-4 py-3.5">
        <span className="whitespace-nowrap font-mono text-xs text-zinc-500">
          {formatDate(createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right">
        <RevokeButton
          id={id}
          status={status}
          revoking={revoking}
          onRevoke={onRevoke}
        />
      </td>
    </tr>
  );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────

function MobileCard({ apiKey, revoking, onRevoke }) {
  const [revealed, setRevealed] = useState(false);
  const { id, key, label, status, createdAt } = apiKey;
  const isRevoked = status === "revoked";

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 transition-colors duration-200 hover:border-zinc-700/60">
      {/* Row 1: label + status */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-zinc-100 leading-tight truncate">
          {label || "—"}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* Row 2: key */}
      <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
          API Key
        </p>
        <div className="flex items-center gap-2">
          <code
            className={`
              flex-1 truncate font-mono text-xs
              transition-colors duration-300
              ${revealed ? "text-cyan-300" : "text-zinc-500 tracking-widest"}
            `}
          >
            {revealed ? key : maskKey(key)}
          </code>
          <button
            onClick={() => !isRevoked && setRevealed((v) => !v)}
            disabled={isRevoked}
            title={revealed ? "Hide key" : "Reveal key"}
            className="
              grid h-7 w-7 shrink-0 place-items-center rounded-md border
              border-zinc-700/60 bg-zinc-800/50 text-xs text-zinc-500
              transition-all duration-200 hover:border-zinc-500 hover:text-zinc-200
              disabled:cursor-not-allowed disabled:opacity-30
            "
          >
            {revealed ? "○" : "●"}
          </button>
          <CopyButton value={key} disabled={isRevoked || !revealed} />
        </div>
      </div>

      {/* Row 3: date + revoke */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-zinc-600">
          {formatDate(createdAt)}
        </span>
        <RevokeButton
          id={id}
          status={status}
          revoking={revoking}
          onRevoke={onRevoke}
        />
      </div>
    </div>
  );
}

// ── Table Footer ──────────────────────────────────────────────────────────────

function TableFooter({ apiKeys }) {
  const active  = apiKeys.filter((k) => k.status === "active").length;
  const revoked = apiKeys.filter((k) => k.status === "revoked").length;

  return (
    <div className="flex items-center justify-between border-t border-zinc-800/60 bg-zinc-900/50 px-4 py-2.5">
      <p className="font-mono text-[11px] text-zinc-600">
        {apiKeys.length} key{apiKeys.length !== 1 ? "s" : ""} total
      </p>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {active} active
        </span>
        <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          {revoked} revoked
        </span>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export default function ApiKeyTable({
  apiKeys  = [],
  loading  = false,
  revoking = null,
  onRevoke,
}) {
  const COLUMNS = ["Label", "API Key", "Status", "Created At", "Actions"];

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[#0d1117]">
              {[...Array(4)].map((_, i) => <SkeletonRow key={i} index={i} />)}
            </tbody>
          </table>
        </div>

        {/* Mobile skeleton */}
        <div className="space-y-3 md:hidden">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} index={i} />)}
        </div>
      </>
    );
  }

  // ── Desktop table ────────────────────────────────────────────────────────
  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-800/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 bg-[#0d1117]">
            {apiKeys.length === 0 ? (
              <EmptyState />
            ) : (
              apiKeys.map((key) => (
                <TableRow
                  key={key.id}
                  apiKey={key}
                  revoking={revoking}
                  onRevoke={onRevoke}
                />
              ))
            )}
          </tbody>
        </table>

        {apiKeys.length > 0 && <TableFooter apiKeys={apiKeys} />}
      </div>

      {/* ── Mobile cards ── */}
      <div className="space-y-3 md:hidden">
        {apiKeys.length === 0 ? (
          <EmptyCard />
        ) : (
          <>
            {apiKeys.map((key) => (
              <MobileCard
                key={key.id}
                apiKey={key}
                revoking={revoking}
                onRevoke={onRevoke}
              />
            ))}
            <div className="flex items-center justify-between px-1 pt-1">
              <p className="font-mono text-[11px] text-zinc-600">
                {apiKeys.length} key{apiKeys.length !== 1 ? "s" : ""} total
              </p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {apiKeys.filter((k) => k.status === "active").length} active
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  {apiKeys.filter((k) => k.status === "revoked").length} revoked
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
