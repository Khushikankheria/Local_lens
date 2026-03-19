"use client";

import { useEffect, useMemo, useState } from "react";
import { BusinessCard } from "../../components/BusinessCard";
import { SearchFilters, type SearchFiltersValue } from "../../components/SearchFilters";
import type { BusinessCategory, BusinessLocation } from "../../lib/types";

function uniqSorted<T extends string>(items: T[]): T[] {
  return Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
}

// Default categories and locations for filter dropdowns
const DEFAULT_CATEGORIES: BusinessCategory[] = [
  "Restaurants",
  "Cafes",
  "Salons & Spas",
  "Grocery Stores",
  "Repair Services",
  "Gyms & Fitness",
  "Clinics & Pharmacies",
  "Local Shops",
];

const DEFAULT_LOCATIONS: BusinessLocation[] = [
  "Old Delhi",
  "Connaught Place",
  "Rajouri Garden",
  "Dwarka",
  "Lajpat Nagar",
  "Saket",
  "Karol Bagh",
  "Janakpuri",
];

export type BusinessListItem = {
  id: string;
  name: string;
  category: BusinessCategory;
  location: BusinessLocation;
  shortDescription: string;
  addressLine: string;
  averageRating: number;
  ratingCount: number;
  averageBreakdown: { quality: number; service: number; value: number };
};

export function HomePage({ businesses }: { businesses: BusinessListItem[] }) {
  // Use unique values from data, or fall back to defaults
  const categories = useMemo(() => {
    const unique = uniqSorted(
      businesses
        .map((b) => b.category)
        .filter((c: BusinessCategory) => c)
    );
    return unique.length > 0 ? unique : DEFAULT_CATEGORIES;
  }, [businesses]);

  const locations = useMemo(() => {
    const unique = uniqSorted(
      businesses
        .map((b) => b.location)
        .filter((l: BusinessLocation) => l)
    );
    return unique.length > 0 ? unique : DEFAULT_LOCATIONS;
  }, [businesses]);

  const [filters, setFilters] = useState<SearchFiltersValue>({
    query: "",
    category: "All",
    location: "All",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Only show loading briefly after mount or when filters change
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    // If no data, return empty
    if (!businesses || businesses.length === 0) {
      return [];
    }

    const q = filters.query.trim().toLowerCase();

    return businesses.filter((b) => {
      // Filter by category
      if (filters.category !== "All") {
        if (b.category !== filters.category) return false;
      }

      // Filter by location
      if (filters.location !== "All") {
        if (b.location !== filters.location) return false;
      }

      // Filter by search query
      if (q.length > 0) {
        return (
          b.name.toLowerCase().includes(q) ||
          b.shortDescription.toLowerCase().includes(q) ||
          b.addressLine.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [filters, businesses]);

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Crowdsourced reviews for local businesses
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-base">
              Browse nearby places, filter by category or location, and read real reviews
              from the community.
            </p>
          </div>
          <div className="mt-6">
            <SearchFilters
              value={filters}
              categories={categories}
              locations={locations}
              onChange={(next) => {
                setFilters(next);
              }}
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-sm font-semibold text-zinc-950">Local businesses</h2>
            <div className="text-xs text-zinc-600 tabular-nums">
              {isLoading
                ? "Loading…"
                : businesses.length === 0
                  ? "0 results"
                  : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white p-4"
                >
                  <div className="h-4 w-2/3 rounded bg-zinc-200" />
                  <div className="mt-3 h-3 w-full rounded bg-zinc-200" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-zinc-200" />
                  <div className="mt-4 h-6 w-40 rounded bg-zinc-200" />
                </div>
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div className="text-sm font-semibold text-zinc-950">
                No businesses found
              </div>
              <p className="mt-1 text-sm text-zinc-600">
                Please try again in a few moments.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div className="text-sm font-semibold text-zinc-950">No matches</div>
              <p className="mt-1 text-sm text-zinc-600">
                Try adjusting your search, category, or location filters.
              </p>
              <button
                onClick={() =>
                  setFilters({ query: "", category: "All", location: "All" })
                }
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b) => (
                <BusinessCard
                  key={b.id}
                  business={{
                    id: b.id,
                    name: b.name,
                    category: b.category,
                    location: b.location,
                    shortDescription: b.shortDescription,
                    addressLine: b.addressLine,
                    averageRating: b.averageRating,
                    ratingCount: b.ratingCount,
                    averageBreakdown: b.averageBreakdown,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

