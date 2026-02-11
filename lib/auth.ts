import { cookies } from "next/headers"
import { sql } from "./db"
import type { Profile } from "./types"

export async function getSession(): Promise<Profile | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session?.value) {
    return null
  }

  const [userId] = session.value.split(":")

  const result = await sql`
    SELECT * FROM profiles WHERE id = ${userId}
  `

  if (result.length === 0) {
    return null
  }

  return result[0] as Profile
}
