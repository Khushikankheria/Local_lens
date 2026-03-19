import type { Business } from "../lib/types";
import { RatingStars } from "./RatingStars";

export function BusinessDetailsHeader({
  business,
}: {
  business: Business;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
              {business.name}
            </h1>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              {business.category}
            </span>
            <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700">
              {business.location}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-700">{business.shortDescription}</p>
          <p className="mt-1 text-sm text-zinc-500">{business.addressLine}</p>
        </div>

        <div className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-medium text-zinc-600">Average rating</div>
          <div className="mt-1 flex items-center gap-2">
            <RatingStars value={business.averageRating} showValue />
            <span className="text-xs text-zinc-600 tabular-nums">
              ({business.ratingCount})
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

