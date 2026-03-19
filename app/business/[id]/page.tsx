import Link from "next/link";
import { BusinessDetailsHeader } from "../../../components/BusinessDetailsHeader";
import { RatingStars } from "../../../components/RatingStars";
import { ReviewCard } from "../../../components/ReviewCard";
import { ReviewFormSection } from "../../../components/ReviewFormSection";
import { createSupabaseServer } from "../../../lib/supabase/server";
import type { BusinessCategory, BusinessLocation, Review } from "../../../lib/types";

function RatingRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="grid grid-cols-[90px_1fr_auto] items-center gap-3">
      <div className="text-sm font-medium text-zinc-700">{label}</div>
      <div className="h-2 rounded-full bg-zinc-200">
        <div
          className="h-2 rounded-full bg-amber-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-sm font-medium tabular-nums text-zinc-800">
        {value.toFixed(1)}
      </div>
    </div>
  );
}

export default async function BusinessDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServer();

  const { data: businessRow } = await supabase
    .from("businesses_public")
    .select(
      "id,name,category,location,short_description,address_line,average_rating,rating_count,avg_quality,avg_service,avg_value"
    )
    .eq("id", params.id)
    .maybeSingle();

  const business = businessRow
    ? {
        id: businessRow.id as string,
        name: businessRow.name as string,
        category: businessRow.category as BusinessCategory,
        location: businessRow.location as BusinessLocation,
        shortDescription: businessRow.short_description as string,
        addressLine: businessRow.address_line as string,
        averageRating: Number(businessRow.average_rating ?? 0),
        ratingCount: Number(businessRow.rating_count ?? 0),
        averageBreakdown: {
          quality: Number(businessRow.avg_quality ?? 0),
          service: Number(businessRow.avg_service ?? 0),
          value: Number(businessRow.avg_value ?? 0),
        },
      }
    : null;

  if (!business) {
    return (
      <main className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">
              Business not found
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Try going back to browse local businesses.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: reviewsRows } = await supabase
    .from("reviews")
    .select(
      `id,business_id,user_id,title,body,quality,service,value,overall,created_at,photo_url,
       profiles!inner(display_name)`
    )
    .eq("business_id", business.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const businessReviews: Review[] = (reviewsRows ?? []).map((r) => {
    const profile = (r.profiles as any) || {};
    return {
      id: r.id as string,
      businessId: r.business_id as string,
      authorName: profile?.display_name || "Anonymous",
      createdAtISO: new Date(r.created_at as string).toISOString(),
      ratings: {
        quality: Number(r.quality),
        service: Number(r.service),
        value: Number(r.value),
      },
      overall: Number(r.overall),
      title: r.title as string,
      body: r.body as string,
      photoUrl: (r.photo_url as string) || undefined,
      status: "approved" as const,
    };
  });

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950"
          >
            <span aria-hidden="true">←</span> Back
          </Link>
        </div>

        <BusinessDetailsHeader business={business} />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Rating breakdown
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Quality, service, and value averages
                </p>
              </div>
              <div className="shrink-0">
                <RatingStars value={business.averageRating} size="sm" showValue />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <RatingRow label="Quality" value={business.averageBreakdown.quality} />
              <RatingRow label="Service" value={business.averageBreakdown.service} />
              <RatingRow label="Value" value={business.averageBreakdown.value} />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("write-review");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              Write a review
            </button>
          </section>

          <section className="lg:col-span-2">
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-950">Reviews</h2>
              <div className="text-xs text-zinc-600 tabular-nums">
                {businessReviews.length} review{businessReviews.length === 1 ? "" : "s"}
              </div>
            </div>

            {businessReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <div className="text-sm font-semibold text-zinc-950">
                  No reviews yet
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Be the first to write a review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {businessReviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}

            <div className="mt-6">
              <ReviewFormSection businessName={business.name} businessId={business.id} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

