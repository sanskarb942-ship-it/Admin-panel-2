import { useState } from "react";

function BellIcon() {
  return <span>🔔</span>;
}

function SearchIcon() {
  return <span>🔍</span>;
}

function NotificationButton() {
  return (
    <button className="px-2 py-1 border rounded">
      <BellIcon />
    </button>
  );
}

function ProfileButton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-gray-500 rounded-full" />
      <span className="text-sm">Admin</span>
    </div>
  );
}

export default function Topbar({ title = "Dashboard" }) {
  const [search, setSearch] = useState("");

  return (
    <header className="flex justify-between items-center p-3 border-b">
      <h1 className="font-bold">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="flex items-center border px-2">
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="outline-none ml-1"
          />
        </div>

        <NotificationButton />
        <ProfileButton />
      </div>
    </header>
  );
}