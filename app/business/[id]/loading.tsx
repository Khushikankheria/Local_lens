export default function LoadingBusinessDetails() {
  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="h-6 w-20 animate-pulse rounded bg-zinc-200" />

        <div className="mt-4 animate-pulse rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="h-6 w-64 rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-5/6 rounded bg-zinc-200" />
          <div className="mt-2 h-4 w-2/3 rounded bg-zinc-200" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="h-4 w-40 rounded bg-zinc-200" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full rounded bg-zinc-200" />
              <div className="h-3 w-full rounded bg-zinc-200" />
              <div className="h-3 w-full rounded bg-zinc-200" />
            </div>
            <div className="mt-5 h-10 w-full rounded bg-zinc-200" />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4"
              >
                <div className="h-4 w-40 rounded bg-zinc-200" />
                <div className="mt-3 h-3 w-full rounded bg-zinc-200" />
                <div className="mt-2 h-3 w-5/6 rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

