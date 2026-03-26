import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// ── Nav Items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href:  "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
        <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "API Keys",
    href:  "/apikeys",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
        <path fillRule="evenodd" d="M8 7a5 5 0 1 1 3.61 4.804l-1.903 1.903A1 1 0 0 1 9 14H8v1a1 1 0 0 1-1 1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 .293-.707L7.196 10.39A5.002 5.002 0 0 1 8 7Zm5-3a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 7 .75.75 0 0 0 16 7a3 3 0 0 0-3-3Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Videos",
    href:  "/videos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
        <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href:  "/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

// ── NavLink ───────────────────────────────────────────────────────────────────

function NavLink({ item, active, onClick }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 rounded-xl px-3 py-2.5
        text-sm font-medium transition-all duration-200 select-none
        ${active
          ? "bg-cyan-500/10 text-cyan-300 shadow-sm ring-1 ring-cyan-500/20"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"}
      `}
    >
      {/* Active left bar */}
      <span
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full
          w-0.5 bg-cyan-400 transition-all duration-200
          ${active ? "h-5 opacity-100" : "h-0 opacity-0"}
        `}
      />

      {/* Icon */}
      <span
        className={`
          shrink-0 transition-colors duration-200
          ${active ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"}
        `}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span className="truncate tracking-tight">{item.label}</span>

      {/* Active dot */}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_2px_rgba(34,211,238,0.4)]" />
      )}
    </Link>
  );
}

// ── Sidebar Content ───────────────────────────────────────────────────────────

function SidebarContent({ pathname, onLinkClick }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Brand ── */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-[18px]">
        <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-cyan-400">
            <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" />
          </svg>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-lg ring-1 ring-cyan-400/20 animate-ping opacity-30" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-bold tracking-tight text-zinc-100">
            StreamAdmin
          </p>
          <p className="truncate text-[10px] text-zinc-600 tracking-wide">
            Management Console
          </p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600">
          Main Menu
        </p>
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                active={
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href + "/"))
                }
                onClick={onLinkClick}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User / Footer ── */}
      <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
        {/* User row */}
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-800 font-mono text-xs font-bold text-zinc-300 ring-1 ring-zinc-700/60">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs font-semibold text-zinc-300">Admin</p>
            <p className="truncate text-[10px] text-zinc-600">admin@example.com</p>
          </div>
          {/* Online indicator */}
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]"
            title="Online"
            aria-label="Online"
          />
        </div>

        {/* Version */}
        <p className="text-center font-mono text-[9px] text-zinc-700 tracking-widest">
          v1.0.0 · StreamAdmin
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Sidebar() {
  const router          = useRouter();
  const [open, setOpen] = useState(false);

  const close  = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Close on route change
  useEffect(() => {
    router.events?.on("routeChangeStart", close);
    return () => router.events?.off("routeChangeStart", close);
  }, [router.events, close]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-sidebar"
        className="
          fixed left-4 top-3.5 z-50
          grid h-9 w-9 place-items-center rounded-xl
          border border-white/10 bg-[#0d1117]/80 text-zinc-400
          shadow-lg shadow-black/30 backdrop-blur-md
          transition-all duration-200
          hover:border-white/20 hover:text-zinc-200
          md:hidden
        "
      >
        {/* Animated hamburger → X */}
        <span className="flex h-4 w-4 flex-col items-center justify-center gap-[5px]">
          <span
            className={`
              block h-px w-4 rounded-full bg-current
              transition-all duration-300 origin-center
              ${open ? "translate-y-[6px] rotate-45" : ""}
            `}
          />
          <span
            className={`
              block h-px rounded-full bg-current
              transition-all duration-200
              ${open ? "w-0 opacity-0" : "w-4 opacity-100"}
            `}
          />
          <span
            className={`
              block h-px w-4 rounded-full bg-current
              transition-all duration-300 origin-center
              ${open ? "-translate-y-[6px] -rotate-45" : ""}
            `}
          />
        </span>
      </button>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] md:hidden"
          style={{ animation: "backdropIn 0.2s ease-out" }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        id="mobile-sidebar"
        aria-label="Sidebar navigation"
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          border-r border-white/[0.06] bg-[#0d1117]
          shadow-2xl shadow-black/60
          transition-transform duration-300 ease-in-out
          md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent pathname={router.pathname} onLinkClick={close} />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        aria-label="Sidebar navigation"
        className="
          hidden md:flex w-60 shrink-0 flex-col
          border-r border-white/[0.06] bg-[#0d1117]
        "
      >
        <SidebarContent pathname={router.pathname} onLinkClick={undefined} />
      </aside>
    </>
  );
}
