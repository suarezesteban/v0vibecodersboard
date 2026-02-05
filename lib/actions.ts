"use server"

import { revalidatePath } from "next/cache"
import { sql } from "./db"
import { getSession } from "./auth"
import { assignCoupon } from "./queries"

export async function joinBoard(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const bio = formData.get("bio") as string
  const stack = formData.get("stack") as string
  
  // Parse projects from individual fields
  const projects = []
  for (let i = 0; i < 5; i++) {
    const name = formData.get(`project_name_${i}`) as string
    const url = formData.get(`project_url_${i}`) as string
    if (name?.trim() && url?.trim()) {
      projects.push({ name: name.trim(), url: url.trim() })
    }
  }

  // Check if this is a new vibecoder or updating existing
  const existing = await sql`SELECT id FROM vibecoders WHERE user_id = ${session.id}`
  const isNew = existing.length === 0

  const result = await sql`
    INSERT INTO vibecoders (user_id, bio, stack, projects)
    VALUES (${session.id}, ${bio || null}, ${stack || null}, ${JSON.stringify(projects)}::jsonb)
    ON CONFLICT (user_id) DO UPDATE SET
      bio = ${bio || null},
      stack = ${stack || null},
      projects = ${JSON.stringify(projects)}::jsonb
    RETURNING id
  `

  // Assign coupon only for new vibecoders
  let couponCode: string | null = null
  if (isNew && result.length > 0) {
    couponCode = await assignCoupon(result[0].id)
  }

  revalidatePath("/")
  return { success: true, couponCode }
}

export async function endorseVibecoder(vibecoder_id: number) {
  console.log("[v0] endorseVibecoder called with:", vibecoder_id)
  const session = await getSession()
  console.log("[v0] session:", session)
  if (!session) {
    console.log("[v0] No session, returning error")
    return { error: "Not authenticated" }
  }

  try {
    console.log("[v0] Inserting endorsement:", session.id, vibecoder_id)
    await sql`
      INSERT INTO endorsements (endorser_id, vibecoder_id)
      VALUES (${session.id}, ${vibecoder_id})
    `
    console.log("[v0] Endorsement inserted successfully")
    revalidatePath("/")
    return { success: true }
  } catch (e) {
    console.log("[v0] Error inserting endorsement:", e)
    return { error: "Already endorsed" }
  }
}

export async function removeEndorsement(vibecoder_id: number) {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  await sql`
    DELETE FROM endorsements 
    WHERE endorser_id = ${session.id} AND vibecoder_id = ${vibecoder_id}
  `

  revalidatePath("/")
  return { success: true }
}

export async function leaveBoard() {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  // Delete endorsements given to this vibecoder
  await sql`
    DELETE FROM endorsements 
    WHERE vibecoder_id IN (SELECT id FROM vibecoders WHERE user_id = ${session.id})
  `

  // Delete the vibecoder profile
  await sql`
    DELETE FROM vibecoders WHERE user_id = ${session.id}
  `

  revalidatePath("/")
  return { success: true }
}
