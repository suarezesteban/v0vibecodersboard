import { NextResponse } from "next/server"

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  
  const response = NextResponse.redirect(`${baseUrl}/`, { status: 303 })
  
  // Delete session cookie
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
