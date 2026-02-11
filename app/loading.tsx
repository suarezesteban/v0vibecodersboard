export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header skeleton */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Join form skeleton */}
        <div className="mb-12 rounded-lg border border-border p-6">
          <div className="h-6 w-48 animate-pulse rounded bg-muted mb-4" />
          <div className="h-4 w-full animate-pulse rounded bg-muted mb-2" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted mb-2" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-3 w-full animate-pulse rounded bg-muted mb-2" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
