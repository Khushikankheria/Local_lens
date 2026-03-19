"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminReviewRow } from "../../components/AdminReviewRow";
import { BusinessFormModal } from "../../components/BusinessFormModal";
import { RequireAdmin, RequireAuth } from "../../components/ProtectedStates";
import { StatCard } from "../../components/StatCard";
import type { Business } from "../../lib/types";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

type AdminReviewRowType = {
  id: string;
  businessId: string;
  userId: string;
  authorName: string;
  createdAtISO: string;
  ratings: { quality: number; service: number; value: number };
  overall: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  photoUrl?: string;
};

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<AdminReviewRowType[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Business | undefined>(undefined);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      const [{ data: biz, error: bizErr }, { data: rev, error: revErr }] =
        await Promise.all([
          supabase
            .from("businesses_public")
            .select("id,name,category,location,short_description,address_line,average_rating,rating_count,avg_quality,avg_service,avg_value")
            .order("name", { ascending: true }),
          supabase
            .from("reviews")
            .select(
              `id,business_id,user_id,title,body,quality,service,value,overall,status,created_at,photo_url,
               profiles!inner(display_name)`
            )
            .order("created_at", { ascending: false }),
        ]);

      if (cancelled) return;

      if (bizErr || revErr) {
        setError(bizErr?.message || revErr?.message || "Failed to load admin data.");
      }

      const mappedBusinesses: Business[] = (biz ?? []).map((b) => ({
        id: (b as { id: string }).id,
        name: (b as { name: string }).name,
        category: (b as { category: Business["category"] }).category,
        location: (b as { location: Business["location"] }).location,
        shortDescription: (b as { short_description: string }).short_description,
        addressLine: (b as { address_line: string }).address_line,
        averageRating: Number((b as { average_rating: number | null }).average_rating ?? 0),
        ratingCount: Number((b as { rating_count: number | null }).rating_count ?? 0),
        averageBreakdown: {
          quality: Number((b as { avg_quality: number | null }).avg_quality ?? 0),
          service: Number((b as { avg_service: number | null }).avg_service ?? 0),
          value: Number((b as { avg_value: number | null }).avg_value ?? 0),
        },
      }));

      const mappedReviews: AdminReviewRowType[] = (rev ?? []).map((r) => {
        const profile = (r as any).profiles || {};
        return {
          id: (r as { id: string }).id,
          businessId: (r as { business_id: string }).business_id,
          userId: (r as { user_id: string }).user_id,
          authorName: profile?.display_name || "Anonymous",
          createdAtISO: new Date((r as { created_at: string }).created_at).toISOString(),
          ratings: {
            quality: Number((r as { quality: number }).quality),
            service: Number((r as { service: number }).service),
            value: Number((r as { value: number }).value),
          },
          overall: Number((r as { overall: number }).overall),
          title: (r as { title: string }).title,
          body: (r as { body: string }).body,
          status: (r as { status: AdminReviewRowType["status"] }).status,
          photoUrl: (r as { photo_url: string | null }).photo_url || undefined,
        };
      });

      setBusinesses(mappedBusinesses);
      setReviews(mappedReviews);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const businessById = useMemo(() => {
    const map = new Map<string, Business>();
    for (const b of businesses) map.set(b.id, b);
    return map;
  }, [businesses]);

  const pending = useMemo(
    () => reviews.filter((r) => r.status === "pending").slice().sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [reviews]
  );
  const approved = useMemo(
    () => reviews.filter((r) => r.status === "approved").slice().sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [reviews]
  );
  const rejectedCount = useMemo(
    () => reviews.filter((r) => r.status === "rejected").length,
    [reviews]
  );

  async function setReviewStatus(id: string, status: AdminReviewRowType["status"]) {
    const supabase = createSupabaseBrowser();
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) {
      setError(error.message);
    }
  }

  function openAddBusiness() {
    setModalMode("add");
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEditBusiness(b: Business) {
    setModalMode("edit");
    setEditing(b);
    setModalOpen(true);
  }

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <RequireAuth
          title="Admin dashboard"
          description="Log in to access admin moderation and management tools."
        >
          <RequireAdmin>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                  Admin dashboard
                </h1>
                <p className="mt-1 text-sm text-zinc-600">
                  Approve or reject reviews, and manage local businesses.
                </p>
              </div>
            </div>

            {error ? (
              <div
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                role="status"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}

            <section className="mt-6">
              <h2 className="text-sm font-semibold text-zinc-950">Dashboard stats</h2>
              {isLoading ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[96px] animate-pulse rounded-2xl border border-zinc-200 bg-white"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Businesses" value={businesses.length} />
                  <StatCard
                    label="Pending reviews"
                    value={pending.length}
                    hint="Awaiting moderation"
                  />
                  <StatCard label="Approved reviews" value={approved.length} />
                  <StatCard label="Rejected reviews" value={rejectedCount} />
                </div>
              )}
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <section>
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-sm font-semibold text-zinc-950">Pending reviews</h2>
                  <div className="text-xs text-zinc-600 tabular-nums">
                    {isLoading ? "Loading…" : `${pending.length} pending`}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white"
                      />
                    ))
                  ) : pending.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                      <div className="text-sm font-semibold text-zinc-950">
                        No pending reviews
                      </div>
                      <p className="mt-1 text-sm text-zinc-600">
                        Everything is up to date.
                      </p>
                    </div>
                  ) : (
                    pending.map((r) => (
                      <AdminReviewRow
                        key={r.id}
                        review={r}
                        business={businessById.get(r.businessId)}
                        actions={
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => setReviewStatus(r.id, "approved")}
                              className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewStatus(r.id, "rejected")}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                            >
                              Reject
                            </button>
                          </div>
                        }
                      />
                    ))
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-sm font-semibold text-zinc-950">
                    Approved reviews
                  </h2>
                  <div className="text-xs text-zinc-600 tabular-nums">
                    {isLoading ? "Loading…" : `${approved.length} approved`}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white"
                      />
                    ))
                  ) : approved.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                      <div className="text-sm font-semibold text-zinc-950">
                        No approved reviews
                      </div>
                      <p className="mt-1 text-sm text-zinc-600">
                        Approve pending reviews to publish them.
                      </p>
                    </div>
                  ) : (
                    approved.map((r) => (
                      <AdminReviewRow
                        key={r.id}
                        review={r}
                        business={businessById.get(r.businessId)}
                      />
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="mt-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-950">Businesses</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Add, edit, or delete local businesses (demo UI only).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddBusiness}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Add business
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-4 py-3">
                              <div className="h-4 w-48 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-20 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-24 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-56 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="ml-auto h-8 w-40 rounded bg-zinc-200" />
                            </td>
                          </tr>
                        ))
                      ) : businesses.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center">
                            <div className="text-sm font-semibold text-zinc-950">
                              No businesses
                            </div>
                            <div className="mt-1 text-sm text-zinc-600">
                              Add a business to get started.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        businesses.map((b) => (
                          <tr key={b.id} className="align-top">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-zinc-950">{b.name}</div>
                              <div className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                                {b.shortDescription}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                                {b.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700">
                                {b.location}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-700">{b.addressLine}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditBusiness(b)}
                                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ok = window.confirm(
                                      `Delete “${b.name}”?`
                                    );
                                    if (!ok) return;
                                    const supabase = createSupabaseBrowser();
                                    setError(null);
                                    setBusinesses((prev) => prev.filter((x) => x.id !== b.id));
                                    void supabase.from("businesses").delete().eq("id", b.id).then(({ error }) => {
                                      if (error) setError(error.message);
                                    });
                                  }}
                                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </RequireAdmin>
        </RequireAuth>
      </div>

      <BusinessFormModal
        key={`${modalMode}:${editing?.id ?? "new"}`}
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={async (draft) => {
          const supabase = createSupabaseBrowser();
          setError(null);
          setIsLoading(true);
          try {
            if (modalMode === "add") {
              const { data, error } = await supabase
                .from("businesses")
                .insert({
                  name: draft.name.trim(),
                  category: draft.category,
                  location: draft.location,
                  short_description: draft.shortDescription.trim(),
                  address_line: draft.addressLine.trim(),
                })
                .select("id,name,category,location,short_description,address_line")
                .single();
              if (error) throw error;

              const created: Business = {
                id: data.id,
                name: data.name,
                category: data.category,
                location: data.location,
                shortDescription: data.short_description,
                addressLine: data.address_line,
                averageRating: 0,
                ratingCount: 0,
                averageBreakdown: { quality: 0, service: 0, value: 0 },
              };
              setBusinesses((prev) => [created, ...prev]);
            } else if (modalMode === "edit" && editing) {
              const { data, error } = await supabase
                .from("businesses")
                .update({
                  name: draft.name.trim(),
                  category: draft.category,
                  location: draft.location,
                  short_description: draft.shortDescription.trim(),
                  address_line: draft.addressLine.trim(),
                })
                .eq("id", editing.id)
                .select("id,name,category,location,short_description,address_line")
                .single();
              if (error) throw error;

              setBusinesses((prev) =>
                prev.map((b) =>
                  b.id === editing.id
                    ? {
                        ...b,
                        name: data.name,
                        category: data.category,
                        location: data.location,
                        shortDescription: data.short_description,
                        addressLine: data.address_line,
                      }
                    : b
                )
              );
            }
            setModalOpen(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save business.");
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </main>
  );
}

