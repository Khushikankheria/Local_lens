"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "../lib/supabase/browser";

export type AuthRole = "user" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
};

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authenticated"; user: AuthUser };

type AuthContextValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function loadProfileRole(user: User): Promise<AuthRole> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return "user";
  return (data?.role === "admin" ? "admin" : "user") as AuthRole;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    let cancelled = false;

    async function init() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      if (!user) {
        if (!cancelled) setState({ status: "guest" });
        return;
      }
      const role = await loadProfileRole(user);
      if (!cancelled)
        setState({
          status: "authenticated",
          user: { id: user.id, email: user.email ?? "", role },
        });
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      if (!u) {
        setState({ status: "guest" });
        return;
      }
      const role = await loadProfileRole(u);
      setState({
        status: "authenticated",
        user: { id: u.id, email: u.email ?? "", role },
      });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isValidEmail(email)) throw new Error("Please enter a valid email.");
    if (password.trim().length < 6) throw new Error("Password must be at least 6 characters.");
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (error) throw new Error(error.message);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    if (!isValidEmail(email)) throw new Error("Please enter a valid email.");
    if (password.trim().length < 6) throw new Error("Password must be at least 6 characters.");
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {},
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  const logout = useCallback(() => {
    const supabase = createSupabaseBrowser();
    void supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ state, login, signup, logout }),
    [state, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider.");
  return ctx;
}

