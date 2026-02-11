export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header skeleton */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-5 w-40 bg-muted animate-pulse" />
          <div className="h-4 w-24 bg-muted animate-pulse" />
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Join form skeleton */}
        <div className="border-2 border-dashed border-muted-foreground/50 p-6 text-center mb-8">
          <div className="h-6 w-40 bg-muted animate-pulse mx-auto mb-2" />
          <div className="h-3 w-52 bg-muted animate-pulse mx-auto" />
        </div>

        {/* Controls skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-3 w-20 bg-muted animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-12 bg-muted animate-pulse" />
              <div className="h-3 w-16 bg-muted animate-pulse" />
              <div className="h-3 w-12 bg-muted animate-pulse" />
            </div>
          </div>
        </div>

        {/* Cards skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-muted animate-pulse mb-2" />
                  <div className="h-3 w-48 bg-muted animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-3 w-full bg-muted animate-pulse" />
                <div className="h-3 w-3/4 bg-muted animate-pulse" />
                <div className="h-3 w-1/2 bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
