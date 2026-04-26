"use client";

import { useState, useEffect, useCallback } from "react";

interface PendingHall {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  hours: string | null;
  website: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [halls, setHalls] = useState<PendingHall[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionStates, setActionStates] = useState<Record<number, "approving" | "rejecting" | "done">>({});

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const data = await res.json();
        setHalls(data.halls ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (authed) fetchPending();
  }, [authed, fetchPending]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Try fetching to verify password
    const res = await fetch("/api/admin/pending", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      alert("Wrong password.");
    }
  }

  async function doAction(id: number, action: "approve" | "reject") {
    setActionStates((s) => ({ ...s, [id]: action === "approve" ? "approving" : "rejecting" }));
    await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, action }),
    });
    setActionStates((s) => ({ ...s, [id]: "done" }));
    setHalls((prev) => prev.filter((h) => h.id !== id));
  }

  if (!authed) {
    return (
      <main className="max-w-sm mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-800 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
          >
            Log in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin — Pending Listings</h1>
        <button
          onClick={fetchPending}
          className="text-sm text-purple-700 hover:underline"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}

      {!loading && halls.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No pending listings.</p>
          <p className="text-sm mt-1">All submissions have been reviewed.</p>
        </div>
      )}

      <div className="space-y-4">
        {halls.map((hall) => {
          const state = actionStates[hall.id];
          return (
            <div key={hall.id} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 mb-0.5">{hall.name}</h2>
                  <p className="text-gray-600 text-sm">
                    {hall.address}, {hall.city}, {hall.state} {hall.zip}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                    {hall.phone && <span>📞 {hall.phone}</span>}
                    {hall.hours && <span>🕐 {hall.hours}</span>}
                    {hall.website && (
                      <a href={hall.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline truncate max-w-[200px]">
                        🌐 {hall.website}
                      </a>
                    )}
                  </div>
                  {(hall.submitterName || hall.submitterEmail) && (
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted by: {hall.submitterName ?? "—"} {hall.submitterEmail ? `<${hall.submitterEmail}>` : ""}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Received: {new Date(hall.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => doAction(hall.id, "approve")}
                    disabled={!!state}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {state === "approving" ? "…" : "Approve"}
                  </button>
                  <button
                    onClick={() => doAction(hall.id, "reject")}
                    disabled={!!state}
                    className="bg-red-600 hover:bg-red-500 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {state === "rejecting" ? "…" : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
