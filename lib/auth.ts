import { cookies } from "next/headers"
import { sql } from "./db"
import type { Profile } from "./types"

export async function getSession(): Promise<Profile | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  console.log("[v0] getSession - cookie value:", session?.value ? "exists" : "empty")

  if (!session?.value) {
    return null
  }

  const [userId] = session.value.split(":")
  console.log("[v0] getSession - userId:", userId)

  const result = await sql`
    SELECT * FROM profiles WHERE id = ${userId}
  `

  console.log("[v0] getSession - profile found:", result.length > 0)

  if (result.length === 0) {
    return null
  }

  return result[0] as Profile
}
