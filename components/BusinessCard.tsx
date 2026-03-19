import Link from "next/link";
import type { Business } from "../lib/types";
import { RatingStars } from "./RatingStars";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      href={`/business/${business.id}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-950">
            {business.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {business.shortDescription}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {business.category}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700">
          {business.location}
        </span>
        <div className="flex items-center gap-2">
          <RatingStars value={business.averageRating} size="sm" />
          <span className="text-xs text-zinc-600 tabular-nums">
            {business.averageRating.toFixed(1)} ({business.ratingCount})
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-500">{business.addressLine}</div>

      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:text-blue-800">
        View details
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

