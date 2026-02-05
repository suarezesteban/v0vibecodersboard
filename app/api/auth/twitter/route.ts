import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.TWITTER_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`

  const state = crypto.randomUUID()
  const codeVerifier = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "")

  const authUrl = new URL("https://twitter.com/i/oauth2/authorize")
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("scope", "tweet.read users.read")
  authUrl.searchParams.set("state", state)
  authUrl.searchParams.set("code_challenge", codeVerifier)
  authUrl.searchParams.set("code_challenge_method", "plain")

  const response = NextResponse.redirect(authUrl.toString())
  
  // Store code verifier in cookie for PKCE
  response.cookies.set("code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  })

  return response
}
