"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { StarRatingInput } from "./StarRatingInput";
import { useAuth } from "./AuthProvider";
import { createSupabaseBrowser } from "../lib/supabase/browser";

type SubmitState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "error"; message: string };

export function ReviewFormSection({
  businessName,
  businessId,
}: {
  businessName: string;
  businessId: string;
}) {
  const pathname = usePathname();
  const { state } = useAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [quality, setQuality] = useState(0);
  const [service, setService] = useState(0);
  const [value, setValue] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  const previewUrl = useMemo(() => {
    if (!photo) return null;
    return URL.createObjectURL(photo);
  }, [photo]);

  const canSubmit =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    quality > 0 &&
    service > 0 &&
    value > 0 &&
    submit.status !== "pending" &&
    state.status === "authenticated";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmit({ status: "pending" });

    try {
      const supabase = createSupabaseBrowser();
      const userId = state.user.id;

      const overall = (quality + service + value) / 3;

      const { data: inserted, error: insertError } = await supabase
        .from("reviews")
        .insert({
          business_id: businessId,
          user_id: userId,
          title: title.trim(),
          body: body.trim(),
          quality,
          service,
          value,
          overall,
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      const reviewId = inserted.id as string;

      if (photo) {
        const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${businessId}/${userId}/${reviewId}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(path, photo, { upsert: true });

        if (!uploadError) {
          const { data: pub } = supabase.storage
            .from("review-photos")
            .getPublicUrl(path);

          const photoUrl = pub.publicUrl;
          await supabase.from("reviews").update({ photo_url: photoUrl }).eq("id", reviewId);
        }
      }

      setSubmit({ status: "success" });
      setTitle("");
      setBody("");
      setQuality(0);
      setService(0);
      setValue(0);
      setPhoto(null);
      if (fileRef.current) fileRef.current.value = "";

      window.setTimeout(() => setSubmit({ status: "idle" }), 3000);
    } catch (err) {
      setSubmit({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to submit review.",
      });
    }
  }

  return (
    <section
      id="write-review"
      className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Write a review</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Share your experience with <span className="font-medium">{businessName}</span>.
          </p>
        </div>
        <div className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-700">*</span> required fields
        </div>
      </div>

      {state.status !== "authenticated" ? (
        <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
          <div className="text-sm font-semibold text-zinc-950">Log in to write a review</div>
          <p className="mt-1 text-sm text-zinc-600">
            You’ll submit a review for admin approval before it is published.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Log in
            </Link>
            <Link
              href={`/signup?next=${encodeURIComponent(pathname)}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Sign up
            </Link>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs font-semibold text-zinc-700">
                Ratings <span className="text-zinc-500">(required)</span>
              </div>
              <div className="mt-3 space-y-2">
                <StarRatingInput label="Quality" value={quality} onChange={setQuality} />
                <StarRatingInput label="Service" value={service} onChange={setService} />
                <StarRatingInput label="Value" value={value} onChange={setValue} />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-zinc-700">Photo</div>
                  <div className="mt-1 text-xs text-zinc-500">Optional upload</div>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  Choose file
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setPhoto(f);
                }}
              />

              {photo ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt="Selected upload preview"
                        src={previewUrl}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-zinc-800">
                      {photo.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="mt-0.5 text-xs font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-white p-3 text-xs text-zinc-600">
                  Add an optional photo to your review.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <label className="block">
              <div className="text-xs font-semibold text-zinc-700">
                Title <span className="text-zinc-500">*</span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 placeholder:text-zinc-400 focus:ring-2"
              />
            </label>

            <label className="block">
              <div className="text-xs font-semibold text-zinc-700">
                Review <span className="text-zinc-500">*</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your review…"
                rows={6}
                className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 outline-none ring-blue-500/30 placeholder:text-zinc-400 focus:ring-2"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-zinc-500">
                Required ratings: quality, service, value
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submit.status === "pending" ? "Submitting…" : "Submit review"}
              </button>
            </div>

            {submit.status !== "idle" ? (
              <div
                className={`rounded-xl border p-3 text-sm ${
                  submit.status === "pending"
                    ? "border-blue-200 bg-blue-50 text-blue-800"
                    : submit.status === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
                role="status"
                aria-live="polite"
              >
                {submit.status === "pending"
                  ? "Submitting your review…"
                  : submit.status === "error"
                    ? submit.message
                    : "Review submitted. It’s pending admin approval."}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
}

