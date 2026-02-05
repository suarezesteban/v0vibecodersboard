"use client"

import { useState, useMemo } from "react"
import { VibeCard } from "./vibe-card"
import type { Vibecoder } from "@/lib/types"

type SortOption = "default" | "endorsed" | "recent"

// Calculate profile completeness (bio + skills + projects = 3 max)
function getCompletenessScore(v: Vibecoder): number {
  let score = 0
  if (v.bio && v.bio.trim()) score++
  if (v.stack && v.stack.trim()) score++
  if (v.projects && Array.isArray(v.projects) && v.projects.length > 0) score++
  return score
}

interface VibecordersListProps {
  vibecoders: Vibecoder[]
  isLoggedIn: boolean
  endorsementStatus: Record<number, boolean>
  currentUserId?: string
}

export function VibecodersList({
  vibecoders,
  isLoggedIn,
  endorsementStatus,
  currentUserId,
}: VibecordersListProps) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortOption>("default")

  const filteredVibecoders = useMemo(() => {
    let result = vibecoders

    if (query.trim()) {
      const search = query.toLowerCase().trim()
      result = result.filter((v) => {
        const matchStack = v.stack?.toLowerCase().includes(search)
        const matchBio = v.bio?.toLowerCase().includes(search)
        const matchHandle = v.twitter_handle?.toLowerCase().includes(search)
        const matchName = v.name?.toLowerCase().includes(search)
        return matchStack || matchBio || matchHandle || matchName
      })
    }

    if (sort === "recent") {
      return [...result].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    
    if (sort === "endorsed") {
      return [...result].sort((a, b) => 
        (b.endorsement_count || 0) - (a.endorsement_count || 0)
      )
    }
    
    // Default: complete - profiles with bio+skills+projects first, then by endorsements
    return [...result].sort((a, b) => {
      const scoreA = getCompletenessScore(a)
      const scoreB = getCompletenessScore(b)
      // First: completely filled profiles (bio+skills+projects = score 3)
      const aComplete = scoreA === 3 ? 1 : 0
      const bComplete = scoreB === 3 ? 1 : 0
      if (bComplete !== aComplete) return bComplete - aComplete
      // Then by completeness score
      if (scoreB !== scoreA) return scoreB - scoreA
      // Finally by endorsements
      return (b.endorsement_count || 0) - (a.endorsement_count || 0)
    })
  }, [vibecoders, query, sort])

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <p className="text-muted-foreground text-xs">
          {filteredVibecoders.length} vibecoder{filteredVibecoders.length !== 1 ? "s" : ""}{" "}
          {query.trim() ? `matching "${query}"` : "on the board"}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSort("default")}
            className={sort === "default" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            [default]
          </button>
          <button
            type="button"
            onClick={() => setSort("endorsed")}
            className={sort === "endorsed" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            [top endorsed]
          </button>
          <button
            type="button"
            onClick={() => setSort("recent")}
            className={sort === "recent" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            [recent]
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search..."
            className="w-32 bg-transparent border border-border px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              [x]
            </button>
          )}
        </div>
      </div>

      {filteredVibecoders.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {query.trim() ? "no vibecoders match your search." : "no vibecoders yet. be the first to join."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVibecoders.map((vibecoder) => (
            <VibeCard
              key={vibecoder.id}
              vibecoder={vibecoder}
              isLoggedIn={isLoggedIn}
              hasEndorsed={endorsementStatus[vibecoder.id] || false}
              isOwnCard={currentUserId === vibecoder.user_id}
            />
          ))}
        </div>
      )}
    </>
  )
}
