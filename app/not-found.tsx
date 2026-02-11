import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-border bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
