import { sql } from "./db"
import type { Vibecoder, Endorsement } from "./types"

export async function getVibecoders(): Promise<Vibecoder[]> {
  const result = await sql`
    SELECT 
      v.*,
      p.twitter_handle,
      p.twitter_avatar,
      p.name,
      (SELECT COUNT(*) FROM endorsements e WHERE e.vibecoder_id = v.id) as endorsement_count,
      (
        SELECT COALESCE(json_agg(json_build_object('handle', ep.twitter_handle)), '[]'::json)
        FROM endorsements e2
        JOIN profiles ep ON ep.id = e2.endorser_id
        WHERE e2.vibecoder_id = v.id
      ) as endorsers
    FROM vibecoders v
    JOIN profiles p ON p.id = v.user_id
    ORDER BY endorsement_count DESC, v.created_at DESC
  `
  return result as Vibecoder[]
}

export async function getVibecoder(userId: string): Promise<Vibecoder | null> {
  const result = await sql`
    SELECT * FROM vibecoders WHERE user_id = ${userId}
  `
  return result.length > 0 ? (result[0] as Vibecoder) : null
}

export async function getEndorsements(vibecoder_id: number): Promise<Endorsement[]> {
  const result = await sql`
    SELECT 
      e.*,
      p.twitter_handle as endorser_handle,
      p.twitter_avatar as endorser_avatar
    FROM endorsements e
    JOIN profiles p ON p.id = e.endorser_id
    WHERE e.vibecoder_id = ${vibecoder_id}
    ORDER BY e.created_at DESC
  `
  return result as Endorsement[]
}

export async function hasEndorsed(endorserId: string, vibecoder_id: number): Promise<boolean> {
  const result = await sql`
    SELECT 1 FROM endorsements 
    WHERE endorser_id = ${endorserId} AND vibecoder_id = ${vibecoder_id}
  `
  return result.length > 0
}

// Batch query to get all endorsements by a user - avoids N+1 problem
export async function getUserEndorsements(endorserId: string): Promise<number[]> {
  const result = await sql`
    SELECT vibecoder_id FROM endorsements WHERE endorser_id = ${endorserId}
  `
  return result.map((r: { vibecoder_id: number }) => r.vibecoder_id)
}

// Assign a coupon to a vibecoder (called when they join)
export async function assignCoupon(vibecoder_id: number): Promise<string | null> {
  const result = await sql`
    UPDATE coupons 
    SET vibecoder_id = ${vibecoder_id}, assigned_at = NOW()
    WHERE id = (
      SELECT id FROM coupons 
      WHERE vibecoder_id IS NULL 
      ORDER BY id 
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING code
  `
  return result.length > 0 ? result[0].code : null
}

// Get the coupon assigned to a vibecoder
export async function getVibecoderCoupon(vibecoder_id: number): Promise<string | null> {
  const result = await sql`
    SELECT code FROM coupons WHERE vibecoder_id = ${vibecoder_id}
  `
  return result.length > 0 ? result[0].code : null
}

// Get unique skills from all vibecoders, ordered by usage frequency
export async function getUniqueSkills(): Promise<{ skill: string; count: number }[]> {
  const result = await sql`
    SELECT 
      TRIM(LOWER(skill)) as skill_normalized,
      TRIM(skill) as skill,
      COUNT(*) as count
    FROM vibecoders, unnest(string_to_array(stack, ',')) as skill
    WHERE stack IS NOT NULL AND TRIM(skill) != ''
    GROUP BY TRIM(LOWER(skill)), TRIM(skill)
    ORDER BY count DESC, skill ASC
  `
  
  // Dedupe by normalized name, keeping the most common casing
  const seen = new Map<string, { skill: string; count: number }>()
  for (const row of result) {
    const normalized = row.skill_normalized as string
    const existing = seen.get(normalized)
    if (!existing || (row.count as number) > existing.count) {
      seen.set(normalized, { skill: row.skill as string, count: row.count as number })
    }
  }
  
  return Array.from(seen.values()).sort((a, b) => b.count - a.count)
}
