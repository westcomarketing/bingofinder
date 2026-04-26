"use client";

import { useState } from "react";
import Link from "next/link";

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

type Status = "idle" | "submitting" | "success" | "error";

export default function SubmitPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        form.reset();
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link> &rsaquo;{" "}
        <span className="text-gray-900">Submit a Listing</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Bingo Hall</h1>
      <p className="text-gray-600 mb-8">
        Know a bingo hall that&apos;s not listed? Submit it here. All submissions are reviewed before going live.
      </p>

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-green-900 mb-1">Submission received!</h2>
          <p className="text-green-800 text-sm">
            Thanks for contributing. Your listing will be reviewed and published within 2–3 business days.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-3 text-sm text-green-700 underline"
          >
            Submit another listing
          </button>
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hall info */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Hall Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hall Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                maxLength={200}
                placeholder="e.g. VFW Post 1234 Bingo"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                maxLength={300}
                placeholder="e.g. 123 Main St"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  maxLength={100}
                  placeholder="e.g. Springfield"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select…</option>
                  {US_STATES.map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>{abbr} — {name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  maxLength={10}
                  pattern="\d{5}(-\d{4})?"
                  placeholder="e.g. 90210"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  maxLength={20}
                  placeholder="e.g. (555) 123-4567"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bingo Hours</label>
              <input
                type="text"
                name="hours"
                maxLength={200}
                placeholder="e.g. Fri 6pm, Sat 2pm & 6pm"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                maxLength={300}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Submitter info */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Your Information <span className="text-xs text-gray-500 font-normal">(optional)</span></h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="submitterName"
                  maxLength={100}
                  placeholder="Jane Doe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  name="submitterEmail"
                  maxLength={200}
                  placeholder="jane@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-purple-800 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {status === "submitting" ? "Submitting…" : "Submit Listing"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            All submissions are reviewed by our team before being published. We typically respond within 2–3 business days.
          </p>
        </form>
      )}
    </main>
  );
}
