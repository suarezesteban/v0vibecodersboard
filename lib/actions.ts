"use server"

import { revalidatePath } from "next/cache"
import { sql } from "./db"
import { getSession } from "./auth"
import { assignCoupon } from "./queries"

const MAX_BIO_LENGTH = 500
const MAX_STACK_LENGTH = 200
const MAX_PROJECT_NAME_LENGTH = 100
const MAX_PROJECT_URL_LENGTH = 500
const MAX_PROJECTS = 5

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function joinBoard(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const bio = (formData.get("bio") as string)?.trim() ?? ""
  const stack = (formData.get("stack") as string)?.trim() ?? ""

  // Validate bio length
  if (bio.length > MAX_BIO_LENGTH) {
    return { error: `Bio must be ${MAX_BIO_LENGTH} characters or fewer` }
  }

  // Validate stack length
  if (stack.length > MAX_STACK_LENGTH) {
    return { error: `Stack must be ${MAX_STACK_LENGTH} characters or fewer` }
  }

  // Parse and validate projects
  const projects = []
  for (let i = 0; i < MAX_PROJECTS; i++) {
    const name = (formData.get(`project_name_${i}`) as string)?.trim()
    const url = (formData.get(`project_url_${i}`) as string)?.trim()
    if (name && url) {
      if (name.length > MAX_PROJECT_NAME_LENGTH) {
        return { error: `Project name must be ${MAX_PROJECT_NAME_LENGTH} characters or fewer` }
      }
      if (url.length > MAX_PROJECT_URL_LENGTH) {
        return { error: `Project URL must be ${MAX_PROJECT_URL_LENGTH} characters or fewer` }
      }
      if (!isValidUrl(url)) {
        return { error: `"${name}" has an invalid URL. Please use a full URL starting with http:// or https://` }
      }
      projects.push({ name, url })
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
  if (!Number.isInteger(vibecoder_id) || vibecoder_id <= 0) {
    return { error: "Invalid vibecoder ID" }
  }

  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  try {
    await sql`
      INSERT INTO endorsements (endorser_id, vibecoder_id)
      VALUES (${session.id}, ${vibecoder_id})
    `
    revalidatePath("/")
    return { success: true }
  } catch {
    return { error: "Already endorsed" }
  }
}

export async function removeEndorsement(vibecoder_id: number) {
  if (!Number.isInteger(vibecoder_id) || vibecoder_id <= 0) {
    return { error: "Invalid vibecoder ID" }
  }

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
