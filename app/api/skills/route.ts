import { getUniqueSkills } from "@/lib/queries"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""
  
  const skills = await getUniqueSkills()
  
  // Filter by query if provided
  const filtered = query 
    ? skills.filter(s => s.skill.toLowerCase().includes(query))
    : skills
  
  return NextResponse.json(filtered.slice(0, 20))
}
