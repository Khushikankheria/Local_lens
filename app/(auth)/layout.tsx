export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-zinc-50">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}

