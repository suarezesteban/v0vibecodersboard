"use client"

import Link from "next/link"
import Image from "next/image"
import type { Vibecoder } from "@/lib/types"
import { endorseVibecoder, removeEndorsement } from "@/lib/actions"
import { useState, useTransition } from "react"

interface VibeCardProps {
  vibecoder: Vibecoder
  isLoggedIn: boolean
  hasEndorsed: boolean
  isOwnCard: boolean
  variant?: "grid" | "compact" | "list"
}

export function VibeCard({ vibecoder, isLoggedIn, hasEndorsed, isOwnCard, variant = "grid" }: VibeCardProps) {
  const [isPending, startTransition] = useTransition()
  const [showAllEndorsers, setShowAllEndorsers] = useState(false)

  const handleEndorse = () => {
    if (!isLoggedIn) {
      window.location.href = "/api/auth/twitter"
      return
    }
    startTransition(async () => {
      if (hasEndorsed) {
        await removeEndorsement(vibecoder.id)
      } else {
        await endorseVibecoder(vibecoder.id)
      }
    })
  }

  const endorsers = vibecoder.endorsers || []

  const endorseButton = !isOwnCard ? (
    <button
      onClick={handleEndorse}
      disabled={isPending}
      className={`text-xs transition-colors ${
        hasEndorsed 
          ? 'text-green-500 hover:text-red-500' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {isPending ? '...' : hasEndorsed ? '[endorsed]' : '[endorse]'}
    </button>
  ) : (
    <span className="text-xs text-muted-foreground">[you]</span>
  )

  // -- LIST variant: single horizontal row --
  if (variant === "list") {
    return (
      <div className="border border-border px-4 py-3 flex items-center gap-4">
        {vibecoder.twitter_avatar ? (
          <Image
            src={vibecoder.twitter_avatar || "/placeholder.svg"}
            alt={vibecoder.twitter_handle || ""}
            width={32}
            height={32}
            className="rounded-full shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
        )}
        <Link 
          href={`https://x.com/${vibecoder.twitter_handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground text-sm font-medium hover:underline shrink-0 w-36 truncate"
        >
          @{vibecoder.twitter_handle}
        </Link>
        <span className="text-muted-foreground text-xs truncate hidden sm:inline flex-1">
          {vibecoder.stack || "-"}
        </span>
        <span className="text-muted-foreground text-xs shrink-0 hidden md:inline">
          {vibecoder.endorsement_count || 0} endorsed
        </span>
        {endorseButton}
      </div>
    )
  }

  // -- COMPACT variant: smaller card, less detail --
  if (variant === "compact") {
    return (
      <div className="border border-border p-3 flex flex-col h-full">
        <div className="flex items-center gap-2 pb-2">
          {vibecoder.twitter_avatar ? (
            <Image
              src={vibecoder.twitter_avatar || "/placeholder.svg"}
              alt={vibecoder.twitter_handle || ""}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-muted" />
          )}
          <Link 
            href={`https://x.com/${vibecoder.twitter_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground text-sm font-medium hover:underline truncate"
          >
            @{vibecoder.twitter_handle}
          </Link>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
            {vibecoder.bio || ""}
          </p>
          <div className="text-xs">
            <span className="text-muted-foreground">skills: </span>
            <span className="text-foreground line-clamp-1">{vibecoder.stack || "-"}</span>
          </div>
        </div>
        <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{vibecoder.endorsement_count || 0} endorsed</span>
          {endorseButton}
        </div>
      </div>
    )
  }

  // -- GRID variant (default): full card --
  return (
    <div className="border border-border p-5 flex flex-col h-full">
      {/* Header with avatar and handle */}
      <div className="flex items-center gap-3 pb-3">
        {vibecoder.twitter_avatar ? (
          <Image
            src={vibecoder.twitter_avatar || "/placeholder.svg"}
            alt={vibecoder.twitter_handle || ""}
            width={44}
            height={44}
            className="rounded-full"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-muted" />
        )}
        <Link 
          href={`https://x.com/${vibecoder.twitter_handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground text-lg font-medium hover:underline"
        >
          @{vibecoder.twitter_handle}
        </Link>
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        {vibecoder.bio && (
          <p className="text-muted-foreground text-sm leading-relaxed">{'"'}{vibecoder.bio}{'"'}</p>
        )}
        
        <div className="text-sm">
          <span className="text-muted-foreground">skills: </span>
          <span className="text-foreground">{vibecoder.stack || "-"}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">vibecoded: </span>
          {vibecoder.projects && vibecoder.projects.length > 0 ? (
            vibecoder.projects.map((p, i) => (
              <span key={p.url}>
                <Link
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  {p.name}
                </Link>
                {i < vibecoder.projects!.length - 1 && ", "}
              </span>
            ))
          ) : (
            <span className="text-foreground">-</span>
          )}
        </div>
      </div>

      {/* Endorsements - only show if there are endorsers */}
      {endorsers.length > 0 && (
        <div className="pt-4 mt-4 border-t border-dashed border-border/50">
          <div className="text-sm">
            <span className="text-muted-foreground">endorsed by: </span>
            {(showAllEndorsers ? endorsers : endorsers.slice(0, 3)).map((e, i, arr) => (
              <span key={e.handle}>
                <Link
                  href={`https://x.com/${e.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  @{e.handle}
                </Link>
                {i < arr.length - 1 && ", "}
              </span>
            ))}
            {endorsers.length > 3 && (
              <button
                onClick={() => setShowAllEndorsers(!showAllEndorsers)}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                {showAllEndorsers ? "[see less]" : "[see more]"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
        <Link
          href={`https://x.com/${vibecoder.twitter_handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          [x profile]
        </Link>
        {endorseButton}
      </div>
    </div>
  )
}
