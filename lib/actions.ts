"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "./db"
import { getSession } from "./auth"
import { assignCoupon } from "./queries"

const projectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  url: z.string().trim().url(),
})

const joinBoardSchema = z.object({
  bio: z.string().max(500).optional().default(""),
  stack: z.string().max(200).optional().default(""),
  projects: z.array(projectSchema).max(5),
})

const vibecoderIdSchema = z.number().int().positive()

export async function joinBoard(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const rawBio = formData.get("bio") as string
  const rawStack = formData.get("stack") as string

  // Parse projects from individual fields
  const rawProjects = []
  for (let i = 0; i < 5; i++) {
    const name = formData.get(`project_name_${i}`) as string
    const url = formData.get(`project_url_${i}`) as string
    if (name?.trim() && url?.trim()) {
      rawProjects.push({ name: name.trim(), url: url.trim() })
    }
  }

  const parsed = joinBoardSchema.safeParse({
    bio: rawBio || "",
    stack: rawStack || "",
    projects: rawProjects,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { bio, stack, projects } = parsed.data

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
  const parsed = vibecoderIdSchema.safeParse(vibecoder_id)
  if (!parsed.success) {
    return { error: "Invalid vibecoder ID" }
  }

  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  try {
    await sql`
      INSERT INTO endorsements (endorser_id, vibecoder_id)
      VALUES (${session.id}, ${parsed.data})
    `
    revalidatePath("/")
    return { success: true }
  } catch {
    return { error: "Already endorsed" }
  }
}

export async function removeEndorsement(vibecoder_id: number) {
  const parsed = vibecoderIdSchema.safeParse(vibecoder_id)
  if (!parsed.success) {
    return { error: "Invalid vibecoder ID" }
  }

  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  await sql`
    DELETE FROM endorsements 
    WHERE endorser_id = ${session.id} AND vibecoder_id = ${parsed.data}
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
