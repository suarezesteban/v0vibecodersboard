"use client"

import Link from "next/link"
import type { Profile } from "@/lib/types"
import { useState, useEffect, useCallback } from "react"

interface HeaderProps {
  user: Profile | null
}

export function Header({ user }: HeaderProps) {
  const [showModal, setShowModal] = useState(false)

  const close = useCallback(() => setShowModal(false), [])

  useEffect(() => {
    if (!showModal) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [showModal, close])

  return (
    <>
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-foreground hover:text-muted-foreground transition-colors">
            vibecoders.board
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              [what is this?]
            </button>
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

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="What is this?"
        >
          <div
            className="border border-border bg-background max-w-md w-full mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-medium">what is this?</h2>
              <button
                onClick={close}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                [x]
              </button>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                every week someone DMs me: {'"'}got any vibecoders for hire?{'"'}
              </p>
              <p>
                <span className="text-foreground">vibecoders.board</span> fixes that. it{"'"}s a free, open board where vibecoders can showcase their work and where hiring people can find them in one place.
              </p>
              <p>
                if you build with v0, list yourself here. if you need a vibecoder, browse the board and DM the ones whose work clicks.
              </p>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              created by{" "}
              <a
                href="https://x.com/estebansuarez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                @estebansuarez
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
