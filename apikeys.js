import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ApiKeyTable from "../components/ApiKeyTable";

// ── Constants ─────────────────────────────────────────────────────────────────

const MESSAGE_DURATION_MS = 5000;

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent, icon, loading }) {
  const accentMap = {
    blue: {
      border:  "border-blue-500/25 hover:border-blue-400/50",
      shadow:  "hover:shadow-blue-500/10",
      glow:    "bg-blue-500",
      value:   "text-blue-300",
      icon:    "text-blue-400",
    },
    green: {
      border:  "border-emerald-500/25 hover:border-emerald-400/50",
      shadow:  "hover:shadow-emerald-500/10",
      glow:    "bg-emerald-500",
      value:   "text-emerald-300",
      icon:    "text-emerald-400",
    },
    red: {
      border:  "border-red-500/25 hover:border-red-400/50",
      shadow:  "hover:shadow-red-500/10",
      glow:    "bg-red-500",
      value:   "text-red-300",
      icon:    "text-red-400",
    },
  };

  const a = accentMap[accent] ?? accentMap.blue;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border bg-[#0d1117] p-5
        transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
        ${a.border} ${a.shadow}
      `}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-20 ${a.glow}`}
      />
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
        <span className={`text-lg ${a.icon}`}>{icon}</span>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-16 animate-pulse rounded-md bg-zinc-800" />
      ) : (
        <p className={`mt-3 font-mono text-3xl font-bold tabular-nums ${a.value}`}>
          {value ?? 0}
        </p>
      )}
    </div>
  );
}

// ── Message Banner ────────────────────────────────────────────────────────────

function MessageBanner({ message, onDismiss }) {
  if (!message) return null;

  const isError = message.type === "error";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm
        transition-all duration-300
        ${isError
          ? "border-red-500/30 bg-red-950/40 text-red-300"
          : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"}
      `}
      style={{ animation: "slideDown 0.25s ease-out" }}
    >
      <span className="mt-px shrink-0 font-bold">{isError ? "✗" : "✓"}</span>
      <p className="flex-1 font-mono text-xs leading-relaxed">{message.text}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

// ── New Key Reveal Banner ─────────────────────────────────────────────────────

function NewKeyBanner({ keyValue, onDismiss }) {
  const [copied, setCopied] = useState(false);

  if (!keyValue) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  return (
    <div
      className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4"
      style={{ animation: "slideDown 0.3s ease-out" }}
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
        ✓ Key created — copy it now. It will not be shown again.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-emerald-800/40 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-emerald-300">
          {keyValue}
        </code>
        <button
          onClick={handleCopy}
          className={`
            shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold
            transition-all duration-200
            ${copied
              ? "border-emerald-500/50 text-emerald-400"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"}
          `}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-500 transition-all hover:border-zinc-600 hover:text-zinc-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ── Create Key Form ───────────────────────────────────────────────────────────

function CreateKeyForm({ label, onLabelChange, onSubmit, generating }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-[#0d1117] p-5">
      <div className="mb-4">
        <h2 className="font-mono text-sm font-bold text-zinc-100">Generate New Key</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Provide a descriptive label to identify this key.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="key-label"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500"
          >
            Key Label
          </label>
          <input
            id="key-label"
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="e.g. Production Server, CI/CD Pipeline…"
            maxLength={64}
            disabled={generating}
            autoComplete="off"
            className="
              w-full rounded-lg border border-zinc-700/60 bg-zinc-900/80
              px-4 py-2.5 font-mono text-sm text-zinc-200
              placeholder-zinc-600 outline-none
              transition-all duration-200
              focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
              disabled:cursor-not-allowed disabled:opacity-50
            "
          />
          <div className="mt-1 flex justify-between">
            <span className="text-[10px] text-zinc-600">Must be unique and descriptive</span>
            <span className="font-mono text-[10px] text-zinc-600">{label.length}/64</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!label.trim() || generating}
          className="
            flex items-center justify-center gap-2 rounded-lg
            bg-cyan-600 px-5 py-2.5 font-mono text-sm font-bold text-white
            shadow-lg shadow-cyan-500/10 transition-all duration-200
            hover:bg-cyan-500 hover:shadow-cyan-500/20
            active:scale-95
            disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
            sm:self-auto
          "
        >
          {generating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating…
            </>
          ) : (
            <>
              <span aria-hidden="true">⚡</span>
              Generate Key
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ApiKeysPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [apiKeys,     setApiKeys]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [generating,  setGenerating]  = useState(false);
  const [revoking,    setRevoking]    = useState(null);   // id of key being revoked
  const [label,       setLabel]       = useState("");
  const [message,     setMessage]     = useState(null);   // { type, text }
  const [newKeyValue, setNewKeyValue] = useState(null);   // revealed after creation

  const messageTimerRef = useRef(null);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = {
    total:   apiKeys.length,
    active:  apiKeys.filter((k) => k.status === "active").length,
    revoked: apiKeys.filter((k) => k.status === "revoked").length,
  };

  // ── Message helpers ────────────────────────────────────────────────────────
  const showMessage = useCallback((text, type = "success") => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage({ type, text });
    messageTimerRef.current = setTimeout(() => setMessage(null), MESSAGE_DURATION_MS);
  }, []);

  const clearMessage = useCallback(() => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(messageTimerRef.current), []);

  // ── Fetch all keys ─────────────────────────────────────────────────────────
  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/keys");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Server error ${res.status}`);
      }
      const data = await res.json();
      // Support both { keys: [...] } and bare array shapes
      setApiKeys(Array.isArray(data) ? data : data.keys ?? []);
    } catch (err) {
      showMessage(`Failed to load API keys: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  // ── Create key ─────────────────────────────────────────────────────────────
  const handleCreate = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;

    setGenerating(true);
    clearMessage();
    setNewKeyValue(null);

    try {
      const res = await fetch("/api/keys", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ label: trimmed }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.message || `Server error ${res.status}`);
      }

      // Prepend new key and reveal its raw value
      setApiKeys((prev) => [body, ...prev]);
      setNewKeyValue(body.key ?? body.value ?? null);
      setLabel("");
      showMessage(`Key "${trimmed}" created successfully.`, "success");
    } catch (err) {
      showMessage(`Failed to create key: ${err.message}`, "error");
    } finally {
      setGenerating(false);
    }
  }, [label, clearMessage, showMessage]);

  // ── Revoke key ─────────────────────────────────────────────────────────────
  const handleRevoke = useCallback(async (id) => {
    if (!id) return;

    setRevoking(id);
    clearMessage();

    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.message || `Server error ${res.status}`);
      }

      // Optimistically update the status in local state
      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, status: "revoked", revokedAt: new Date().toISOString() } : k
        )
      );
      showMessage("API key revoked successfully.", "success");
    } catch (err) {
      showMessage(`Failed to revoke key: ${err.message}`, "error");
    } finally {
      setRevoking(null);
    }
  }, [clearMessage, showMessage]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-[#080b10] font-mono text-zinc-300">

        {/* ── Sidebar ── */}
        <Sidebar />

        {/* ── Main column ── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* ── Topbar ── */}
          <Topbar title="API Keys" />

          {/* ── Scrollable content ── */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

              {/* ── Page header ── */}
              <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400" aria-hidden="true">⚿</span>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                      API Keys
                    </h1>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Manage authentication keys for your streaming static app.
                  </p>
                </div>

                <button
                  onClick={fetchKeys}
                  disabled={loading}
                  aria-label="Refresh key list"
                  title="Refresh"
                  className="
                    self-start rounded-lg border border-zinc-700/60 bg-zinc-800/60
                    px-3 py-2 text-xs text-zinc-400
                    transition-all duration-200
                    hover:border-zinc-600 hover:text-zinc-200
                    disabled:cursor-not-allowed disabled:opacity-40
                    sm:self-auto
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
                      Refreshing…
                    </span>
                  ) : (
                    "↻ Refresh"
                  )}
                </button>
              </div>

              {/* ── Stats ── */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Keys"   value={stats.total}   accent="blue"  icon="🗝" loading={loading} />
                <StatCard label="Active Keys"  value={stats.active}  accent="green" icon="✓"  loading={loading} />
                <StatCard label="Revoked Keys" value={stats.revoked} accent="red"   icon="⊘"  loading={loading} />
              </div>

              {/* ── Create key form ── */}
              <div className="mb-6">
                <CreateKeyForm
                  label={label}
                  onLabelChange={setLabel}
                  onSubmit={handleCreate}
                  generating={generating}
                />
              </div>

              {/* ── New key reveal banner ── */}
              {newKeyValue && (
                <div className="mb-6">
                  <NewKeyBanner
                    keyValue={newKeyValue}
                    onDismiss={() => setNewKeyValue(null)}
                  />
                </div>
              )}

              {/* ── Status message ── */}
              {message && (
                <div className="mb-6">
                  <MessageBanner message={message} onDismiss={clearMessage} />
                </div>
              )}

              {/* ── Section divider ── */}
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  All Keys
                  {!loading && ` · ${stats.total} total`}
                </span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {/* ── Key table ── */}
              <ApiKeyTable
                apiKeys={apiKeys}
                loading={loading}
                revoking={revoking}
                onRevoke={handleRevoke}
              />

              {/* ── Footer ── */}
              <p className="mt-8 text-center font-mono text-[10px] text-zinc-700">
                Keys are hashed at rest · Revoked keys are permanently invalidated · Last refreshed{" "}
                {new Date().toLocaleTimeString()}
              </p>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}
