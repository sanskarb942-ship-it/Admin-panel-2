import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  {
    title:   "Total API Keys",
    value:   "12",
    delta:   "+2 this week",
    up:      true,
    accent:  "blue",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M8 7a5 5 0 1 1 3.61 4.804l-1.903 1.903A1 1 0 0 1 9 14H8v1a1 1 0 0 1-1 1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 .293-.707L7.196 10.39A5.002 5.002 0 0 1 8 7Zm5-3a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 7 .75.75 0 0 0 16 7a3 3 0 0 0-3-3Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title:  "Active Keys",
    value:  "9",
    delta:  "75% of total",
    up:     true,
    accent: "green",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title:  "Revoked Keys",
    value:  "3",
    delta:  "25% of total",
    up:     false,
    accent: "red",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
        <path d="M8.28 10.22a.75.75 0 0 0-1.06 1.06L8.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 13l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 11.94 8.28 10.22Z" />
      </svg>
    ),
  },
];

const ACTIVITY = [
  {
    id:     1,
    type:   "created",
    label:  "New key generated",
    detail: "Production Server · sk_live_a3f9••••",
    time:   "2 minutes ago",
    icon:   "⚡",
    color:  "cyan",
  },
  {
    id:     2,
    type:   "revoked",
    label:  "Key revoked",
    detail: "Old CI Pipeline · sk_live_7c2d••••",
    time:   "1 hour ago",
    icon:   "⊘",
    color:  "red",
  },
  {
    id:     3,
    type:   "created",
    label:  "New key generated",
    detail: "Staging Environment · sk_live_b81e••••",
    time:   "3 hours ago",
    icon:   "⚡",
    color:  "cyan",
  },
  {
    id:     4,
    type:   "revoked",
    label:  "Key revoked",
    detail: "Dev Laptop · sk_live_9f3a••••",
    time:   "Yesterday at 14:32",
    icon:   "⊘",
    color:  "red",
  },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ title, value, delta, up, accent, icon }) {
  const theme = {
    blue: {
      ring:   "ring-blue-500/20",
      border: "border-blue-500/20 hover:border-blue-400/40",
      glow:   "bg-blue-500",
      icon:   "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
      value:  "text-blue-300",
      delta:  "text-blue-400/70",
      shadow: "hover:shadow-blue-500/10",
    },
    green: {
      ring:   "ring-emerald-500/20",
      border: "border-emerald-500/20 hover:border-emerald-400/40",
      glow:   "bg-emerald-500",
      icon:   "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
      value:  "text-emerald-300",
      delta:  "text-emerald-400/70",
      shadow: "hover:shadow-emerald-500/10",
    },
    red: {
      ring:   "ring-red-500/20",
      border: "border-red-500/20 hover:border-red-400/40",
      glow:   "bg-red-500",
      icon:   "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
      value:  "text-red-300",
      delta:  "text-red-400/70",
      shadow: "hover:shadow-red-500/10",
    },
  }[accent];

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border bg-[#0d1117] p-6
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl
        ${theme.border} ${theme.shadow}
      `}
    >
      {/* Corner glow */}
      <div
        className={`
          pointer-events-none absolute -right-10 -top-10
          h-32 w-32 rounded-full blur-3xl opacity-10
          transition-opacity duration-300 group-hover:opacity-20
          ${theme.glow}
        `}
      />

      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
          {title}
        </p>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${theme.icon}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className={`font-mono text-4xl font-bold tabular-nums ${theme.value}`}>
        {value}
      </p>

      {/* Delta */}
      <p className={`mt-2 flex items-center gap-1 font-mono text-xs ${theme.delta}`}>
        <span>{up ? "↑" : "↓"}</span>
        {delta}
      </p>
    </div>
  );
}

// ── Activity Row ──────────────────────────────────────────────────────────────

function ActivityRow({ item, isLast }) {
  const isCreated = item.type === "created";

  return (
    <div className={`flex items-start gap-4 py-4 ${!isLast ? "border-b border-zinc-800/60" : ""}`}>
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={`
            grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm
            ${isCreated
              ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20"
              : "bg-red-500/10  text-red-400  ring-1 ring-red-500/20"}
          `}
        >
          {item.icon}
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 bg-zinc-800/80" />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-zinc-200">{item.label}</p>
        <p className="mt-0.5 truncate font-mono text-xs text-zinc-600">{item.detail}</p>
      </div>

      {/* Time */}
      <p className="shrink-0 font-mono text-[11px] text-zinc-600 pt-0.5">{item.time}</p>
    </div>
  );
}

// ── Quick Actions ─────────────────────────────────────────────────────────────

function QuickActions() {
  const actions = [
    { label: "Generate Key",   icon: "⚡", href: "/apikeys", color: "cyan"    },
    { label: "View All Keys",  icon: "⚿", href: "/apikeys", color: "blue"    },
    { label: "Manage Videos",  icon: "▶", href: "/videos",  color: "purple"  },
    { label: "Settings",       icon: "⚙", href: "/settings", color: "zinc"  },
  ];

  const colorMap = {
    cyan:   "border-cyan-500/20   bg-cyan-500/5   text-cyan-400   hover:border-cyan-400/40   hover:bg-cyan-500/10",
    blue:   "border-blue-500/20   bg-blue-500/5   text-blue-400   hover:border-blue-400/40   hover:bg-blue-500/10",
    purple: "border-purple-500/20 bg-purple-500/5 text-purple-400 hover:border-purple-400/40 hover:bg-purple-500/10",
    zinc:   "border-zinc-700/40   bg-zinc-800/30  text-zinc-400   hover:border-zinc-600/60   hover:bg-zinc-800/60",
  };

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-[#0d1117] p-5">
      <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map((a) => (
          <a
            key={a.label}
            href={a.href}
            className={`
              flex flex-col items-center gap-2 rounded-xl border px-3 py-4
              text-center transition-all duration-200
              hover:scale-[1.03] active:scale-[0.98]
              ${colorMap[a.color]}
            `}
          >
            <span className="text-xl">{a.icon}</span>
            <span className="font-mono text-xs font-semibold leading-tight">{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#080b10] font-mono text-zinc-300">

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title="Dashboard" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

            {/* ── Page header ── */}
            <div className="mb-7">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400" aria-hidden="true">⊞</span>
                <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                  Dashboard
                </h1>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Welcome back — here's what's happening with your streaming app.
              </p>
            </div>

            {/* ── Stat cards ── */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((s) => (
                <StatCard key={s.title} {...s} />
              ))}
            </div>

            {/* ── Bottom grid: activity + actions ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

              {/* Recent Activity (wider) */}
              <div className="lg:col-span-3 rounded-2xl border border-zinc-800/60 bg-[#0d1117] p-5">
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                    Recent Activity
                  </h2>
                  <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 font-mono text-[10px] text-zinc-500 ring-1 ring-zinc-700/50">
                    {ACTIVITY.length} events
                  </span>
                </div>

                <div className="mt-3">
                  {ACTIVITY.map((item, i) => (
                    <ActivityRow
                      key={item.id}
                      item={item}
                      isLast={i === ACTIVITY.length - 1}
                    />
                  ))}
                </div>

                <div className="mt-4 border-t border-zinc-800/60 pt-4">
                  <a
                    href="/apikeys"
                    className="font-mono text-xs text-cyan-500 transition-colors hover:text-cyan-400"
                  >
                    View all API key activity →
                  </a>
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Quick Actions */}
                <QuickActions />

                {/* System Status */}
                <div className="rounded-2xl border border-zinc-800/60 bg-[#0d1117] p-5">
                  <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                    System Status
                  </h2>
                  {[
                    { label: "API Gateway",    status: "Operational", ok: true  },
                    { label: "Key Store",       status: "Operational", ok: true  },
                    { label: "Stream Service",  status: "Operational", ok: true  },
                    { label: "Auth Service",    status: "Degraded",    ok: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-zinc-800/50 last:border-0">
                      <span className="text-xs text-zinc-400">{s.label}</span>
                      <span className={`flex items-center gap-1.5 font-mono text-[11px] font-semibold ${s.ok ? "text-emerald-400" : "text-amber-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center font-mono text-[10px] text-zinc-700">
              StreamAdmin · Management Console · v1.0.0
            </p>

          </div>
        </main>
      </div>
    </div>
  );
}
