"use client";

import { useMemo, useState } from "react";
import type { Business, BusinessCategory, BusinessLocation } from "../lib/types";

type Draft = {
  name: string;
  category: BusinessCategory;
  location: BusinessLocation;
  shortDescription: string;
  addressLine: string;
};

export function BusinessFormModal({
  open,
  mode,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "add" | "edit";
  initial?: Business;
  onClose: () => void;
  onSave: (draft: Draft) => void;
}) {
  const defaults = useMemo<Draft>(
    () => ({
      name: initial?.name ?? "",
      category: (initial?.category ?? "Cafes") as BusinessCategory,
      location: (initial?.location ?? "Connaught Place") as BusinessLocation,
      shortDescription: initial?.shortDescription ?? "",
      addressLine: initial?.addressLine ?? "",
    }),
    [initial]
  );

  const [draft, setDraft] = useState<Draft>(() => defaults);

  const canSave =
    draft.name.trim().length > 0 &&
    draft.shortDescription.trim().length > 0 &&
    draft.addressLine.trim().length > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-zinc-950">
              {mode === "add" ? "Add business" : "Edit business"}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Manage local businesses
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <div className="text-xs font-semibold text-zinc-700">Name</div>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
                placeholder="Business name"
              />
            </label>

            <label>
              <div className="text-xs font-semibold text-zinc-700">Category</div>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    category: e.target.value as BusinessCategory,
                  })
                }
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
              >
                {(["Restaurants", "Cafes", "Salons & Spas", "Grocery Stores", "Repair Services", "Gyms & Fitness", "Clinics & Pharmacies", "Local Shops"] as const).map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <div className="text-xs font-semibold text-zinc-700">Location</div>
              <select
                value={draft.location}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    location: e.target.value as BusinessLocation,
                  })
                }
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
              >
                {(["Old Delhi", "Connaught Place", "Rajouri Garden", "Dwarka", "Lajpat Nagar", "Saket", "Karol Bagh", "Janakpuri"] as const).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2">
              <div className="text-xs font-semibold text-zinc-700">Address</div>
              <input
                value={draft.addressLine}
                onChange={(e) => setDraft({ ...draft, addressLine: e.target.value })}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
                placeholder="Street, neighborhood"
              />
            </label>

            <label className="sm:col-span-2">
              <div className="text-xs font-semibold text-zinc-700">Short description</div>
              <textarea
                value={draft.shortDescription}
                onChange={(e) =>
                  setDraft({ ...draft, shortDescription: e.target.value })
                }
                rows={3}
                className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
                placeholder="What makes this business stand out?"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(draft)}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

