 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const { state, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white">
            LL
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-950">
            LocalLens
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Browse
          </Link>
          <Link
            href="/admin"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Admin
          </Link>

          <div className="ml-1 h-6 w-px bg-zinc-200" aria-hidden="true" />

          {state.status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-200" />
          ) : state.status === "guest" ? (
            <>
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              >
                Log in
              </Link>
              <Link
                href={`/signup?next=${encodeURIComponent(pathname)}`}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-xs text-zinc-600 sm:inline">
                {state.user.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

