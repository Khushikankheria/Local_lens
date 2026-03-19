"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const { login, signup, state } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    return isValidEmail(email) ? null : "Enter a valid email address.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return password.length >= 6 ? null : "Password must be at least 6 characters.";
  }, [password]);

  const canSubmit =
    status !== "pending" &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    !emailError &&
    !passwordError;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("pending");
    setError(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push(next);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setStatus((s) => (s === "error" ? "error" : "idle"));
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
            {mode === "login" ? "Log in" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {mode === "login"
              ? "Use your email and password to continue."
              : "Sign up with your email and password."}
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          Sign in to LocalLens
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <div className="text-xs font-semibold text-zinc-700">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            placeholder="you@example.com"
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 placeholder:text-zinc-400 focus:ring-2"
          />
          {emailError ? (
            <div className="mt-1 text-xs text-red-600">{emailError}</div>
          ) : null}
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-zinc-700">Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="At least 6 characters"
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 placeholder:text-zinc-400 focus:ring-2"
          />
          {passwordError ? (
            <div className="mt-1 text-xs text-red-600">{passwordError}</div>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "pending"
            ? mode === "login"
              ? "Logging in…"
              : "Creating account…"
            : mode === "login"
              ? "Log in"
              : "Sign up"}
        </button>

        {error ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            role="status"
            aria-live="polite"
          >
            {error}
          </div>
        ) : null}

        <div className="text-xs text-zinc-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <Link
                href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="font-medium text-blue-700 hover:text-blue-800"
              >
                Sign up
              </Link>
              .
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="font-medium text-blue-700 hover:text-blue-800"
              >
                Log in
              </Link>
              .
            </>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
          <div className="font-semibold text-zinc-800">Admin access</div>
          <div className="mt-1">
            Admin role is read from your <span className="font-medium">profile</span> in the database.
          </div>
          {state.status === "authenticated" ? (
            <div className="mt-2 text-zinc-600">
              Signed in as{" "}
              <span className="font-medium">{state.user.email}</span> (
              {state.user.role})
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}

