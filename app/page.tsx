import { Header } from "@/components/header"
import { JoinForm } from "@/components/join-form"
import { VibecodersList } from "@/components/vibecoders-list"
import { getSession } from "@/lib/auth"
import { getVibecoders, getVibecoder, getUserEndorsements, getVibecoderCoupon } from "@/lib/queries"

export default async function Home() {
  const session = await getSession()
  
  // Parallel data fetching
  const [vibecoders, userVibecoder, userEndorsements] = await Promise.all([
    getVibecoders(),
    session ? getVibecoder(session.id) : null,
    session ? getUserEndorsements(session.id) : [],
  ])

  // Get user's coupon if they have a vibecoder profile
  const userCoupon = userVibecoder ? await getVibecoderCoupon(userVibecoder.id) : null

  // Build endorsement status map from single query result
  const endorsementStatus: Record<number, boolean> = {}
  for (const vibecoder_id of userEndorsements) {
    endorsementStatus[vibecoder_id] = true
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header user={session} />

      <section className="max-w-5xl mx-auto px-4 py-12">
        <JoinForm existingProfile={userVibecoder} isLoggedIn={!!session} existingCoupon={userCoupon} />

        <VibecodersList
          vibecoders={vibecoders}
          isLoggedIn={!!session}
          endorsementStatus={endorsementStatus}
          currentUserId={session?.id}
        />
      </section>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>
            created by{" "}
            <a
              href="https://x.com/estebansuarez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              @estebansuarez
            </a>
          </span>
          <span>·</span>
          <a
            href="https://v0.app/templates/vibe-card-component-lHOUBng45gO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            open this template in v0
          </a>
        </div>
      </footer>
    </main>
  )
}
