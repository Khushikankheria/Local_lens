import { Suspense } from "react";
import { AuthCard } from "../../components/AuthCard";

export default function LoginPage() {
  return (
    <main className="bg-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-8">
        <Suspense
          fallback={
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
              <div className="mt-4 h-10 w-full animate-pulse rounded bg-zinc-200" />
              <div className="mt-3 h-10 w-full animate-pulse rounded bg-zinc-200" />
              <div className="mt-4 h-10 w-full animate-pulse rounded bg-zinc-200" />
            </div>
          }
        >
          <AuthCard mode="login" />
        </Suspense>
      </div>
    </main>
  );
}


