"use client";

import type { Business } from "../lib/types";
import { RatingStars } from "./RatingStars";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function AdminReviewRow({
  review,
  business,
  actions,
}: {
  review: {
    authorName: string;
    createdAtISO: string;
    ratings: { quality: number; service: number; value: number };
    overall: number;
    title: string;
    body: string;
    status?: "pending" | "approved" | "rejected";
    photoUrl?: string;
  };
  business: Business | undefined;
  actions?: React.ReactNode;
}) {
  const statusBadgeColor = {
    pending: "bg-amber-50 border-amber-200 text-amber-800",
    approved: "bg-emerald-50 border-emerald-200 text-emerald-800",
    rejected: "bg-red-50 border-red-200 text-red-800",
  };

  const statusBadgeLabel = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  const statusColor = review.status ? statusBadgeColor[review.status] : "";
  const statusLabel = review.status ? statusBadgeLabel[review.status] : "";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="text-sm font-semibold text-zinc-950">
              {business?.name ?? "Unknown business"}
            </div>
            <span className="text-xs text-zinc-500">•</span>
            <div className="text-xs text-zinc-600">{review.authorName}</div>
            <span className="text-xs text-zinc-500">•</span>
            <div className="text-xs text-zinc-500">{formatDate(review.createdAtISO)}</div>
            {review.status ? (
              <>
                <span className="text-xs text-zinc-500">•</span>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor}`}>
                  {statusLabel}
                </span>
              </>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RatingStars value={review.overall} size="sm" showValue />
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Quality: {review.ratings.quality.toFixed(1)}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Service: {review.ratings.service.toFixed(1)}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Value: {review.ratings.value.toFixed(1)}
            </span>
          </div>

          <div className="mt-3 text-sm font-semibold text-zinc-950">{review.title}</div>
          <div className="mt-1 text-sm leading-6 text-zinc-700">{review.body}</div>

          {review.photoUrl ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
              <img
                src={review.photoUrl}
                alt={review.title}
                className="max-h-48 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

