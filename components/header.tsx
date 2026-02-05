import Link from "next/link"
import type { Profile } from "@/lib/types"

interface HeaderProps {
  user: Profile | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-foreground hover:text-muted-foreground transition-colors">
          vibecoders.board
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">@{user.twitter_handle}</span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  [logout]
                </button>
              </form>
            </>
          ) : (
            <Link 
              href="/api/auth/twitter"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              [login with x]
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
