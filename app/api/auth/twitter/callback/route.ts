import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const cookieStore = await cookies()
  const codeVerifier = cookieStore.get("code_verifier")?.value

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`)
  }

  if (!codeVerifier) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code_verifier`)
  }

  const clientId = process.env.TWITTER_CLIENT_ID!
  const clientSecret = process.env.TWITTER_CLIENT_SECRET!
  const redirectUri = `${baseUrl}/api/auth/twitter/callback`

  // Exchange code for token
  const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    console.log("[v0] Token exchange failed:", errorText)
    return NextResponse.redirect(`${baseUrl}/?error=token_exchange_failed`)
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  // Get user info
  const userResponse = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!userResponse.ok) {
    return NextResponse.redirect(`${baseUrl}/?error=user_fetch_failed`)
  }

  const userData = await userResponse.json()
  const twitterUser = userData.data

  // Upsert profile
  await sql`
    INSERT INTO profiles (id, twitter_handle, twitter_avatar, name)
    VALUES (${twitterUser.id}, ${twitterUser.username}, ${twitterUser.profile_image_url}, ${twitterUser.name})
    ON CONFLICT (id) DO UPDATE SET
      twitter_handle = ${twitterUser.username},
      twitter_avatar = ${twitterUser.profile_image_url},
      name = ${twitterUser.name}
  `

  // Create session token
  const sessionToken = crypto.randomUUID()
  const sessionValue = `${twitterUser.id}:${sessionToken}`

  // Create response with redirect
  const response = NextResponse.redirect(`${baseUrl}/`)
  
  // Delete code_verifier cookie
  response.cookies.set("code_verifier", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  
  // Set session cookie
  response.cookies.set("session", sessionValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  console.log("[v0] Session created for user:", twitterUser.username, "id:", twitterUser.id)

  return response
}
