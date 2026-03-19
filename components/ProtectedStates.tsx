"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function RequireAuth({
  children,
  title = "Sign in required",
  description = "Please log in to continue.",
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const { state } = useAuth();
  const pathname = usePathname();

  if (state.status === "loading") {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="text-sm font-semibold text-zinc-950">Loading…</div>
        <p className="mt-1 text-sm text-zinc-600">Checking your session.</p>
      </div>
    );
  }

  if (state.status === "guest") {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
        <div className="text-sm font-semibold text-zinc-950">{title}</div>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
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
    );
  }

  return <>{children}</>;
}

export function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useAuth();

  if (state.status === "authenticated" && state.user.role === "admin") {
    return <>{children}</>;
  }

  if (state.status === "authenticated" && state.user.role !== "admin") {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
        <div className="text-sm font-semibold text-zinc-950">Admin access only</div>
        <p className="mt-1 text-sm text-zinc-600">
          You’re signed in, but you don’t have permission to view this page.
        </p>
        <div className="mt-3 text-xs text-zinc-500">
          Signed in as <span className="font-medium">{state.user.email}</span> (

          {state.user.role})
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
      <div className="text-sm font-semibold text-zinc-950">Admin access only</div>
      <p className="mt-1 text-sm text-zinc-600">Please log in to access this page.</p>
    </div>
  );
}

