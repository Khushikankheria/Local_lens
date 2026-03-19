"use client";

import type { BusinessCategory, BusinessLocation } from "../lib/types";

export type SearchFiltersValue = {
  query: string;
  category: BusinessCategory | "All";
  location: BusinessLocation | "All";
};

export function SearchFilters({
  value,
  categories,
  locations,
  onChange,
}: {
  value: SearchFiltersValue;
  categories: Array<BusinessCategory>;
  locations: Array<BusinessLocation>;
  onChange: (next: SearchFiltersValue) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Search</span>
          <input
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder="Search businesses…"
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 placeholder:text-zinc-400 focus:ring-2"
          />
        </label>

        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Category</span>
          <select
            value={value.category}
            onChange={(e) =>
              onChange({
                ...value,
                category: e.target.value as SearchFiltersValue["category"],
              })
            }
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Location</span>
          <select
            value={value.location}
            onChange={(e) =>
              onChange({
                ...value,
                location: e.target.value as SearchFiltersValue["location"],
              })
            }
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
          >
            <option value="All">All</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

