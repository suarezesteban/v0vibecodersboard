"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="border border-border p-8 max-w-md text-center">
        <h2 className="text-foreground text-lg mb-2">something went wrong</h2>
        <p className="text-muted-foreground text-sm mb-6">
          there was an error loading the board. please try again.
        </p>
        <button
          onClick={reset}
          className="text-sm text-foreground border border-border px-4 py-2 hover:bg-muted transition-colors"
        >
          try again
        </button>
      </div>
    </main>
  )
}
