"use client"

import { joinBoard, leaveBoard } from "@/lib/actions"
import { useTransition, useState } from "react"
import type { Vibecoder } from "@/lib/types"

interface JoinFormProps {
  existingProfile?: Vibecoder | null
  isLoggedIn: boolean
  existingCoupon?: string | null
}

export function JoinForm({ existingProfile, isLoggedIn, existingCoupon }: JoinFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [couponCode, setCouponCode] = useState<string | null>(existingCoupon || null)
  const [showCouponModal, setShowCouponModal] = useState(false)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await joinBoard(formData)
      if (result.couponCode) {
        setCouponCode(result.couponCode)
        setShowCouponModal(true)
      }
      setIsOpen(false)
    })
  }

  const handleLeave = () => {
    setShowLeaveModal(true)
  }

  const confirmLeave = () => {
    startTransition(async () => {
      await leaveBoard()
      setShowLeaveModal(false)
      setIsOpen(false)
    })
  }

  // Get existing projects as array of 5
  const existingProjects = existingProfile?.projects || []
  const projectSlots = [0, 1, 2, 3, 4]

  const formContent = (
    <form action={handleSubmit} className="mt-4 border border-border p-4 space-y-4">
      <div>
        <label className="text-xs text-muted-foreground block mb-1">bio (max 100 chars)</label>
        <input
          name="bio"
          maxLength={100}
          defaultValue={existingProfile?.bio || ""}
          placeholder="building cool stuff with ai"
          className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">skills</label>
        <input
          name="stack"
          defaultValue={existingProfile?.stack || ""}
          placeholder="v0, AI Gateway, AI SDK, Supabase"
          className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
        />
      </div>
      
      <div>
        <label className="text-xs text-muted-foreground block mb-2">top 5 vibecoded projects</label>
        <div className="space-y-2">
          {projectSlots.map((i) => (
            <div key={i} className="flex gap-2">
              <input
                name={`project_name_${i}`}
                defaultValue={existingProjects[i]?.name || ""}
                placeholder="project name"
                className="w-1/3 bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
              />
              <input
                name={`project_url_${i}`}
                type="url"
                defaultValue={existingProjects[i]?.url || ""}
                placeholder="https://myproject.com"
                className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="text-sm text-foreground border border-border px-4 py-2 hover:bg-muted transition-colors"
      >
        {isPending ? "saving..." : existingProfile ? "[save]" : "[join]"}
      </button>
    </form>
  )

  const couponModal = showCouponModal && couponCode && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="border border-border bg-background p-6 max-w-md w-full mx-4 text-center">
        <p className="text-foreground text-lg mb-2">welcome to the board!</p>
        <p className="text-muted-foreground text-sm mb-4">a little gift so you can keep building:</p>
        <div className="bg-muted/30 border border-green-500/50 p-4 mb-4">
          <code className="text-green-500 text-xl font-bold select-all">{couponCode}</code>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          redeem at{" "}
          <a 
            href="https://v0.dev/chat/settings/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            v0.dev/chat/settings/billing
          </a>
        </p>
        <button
          type="button"
          onClick={() => setShowCouponModal(false)}
          className="text-sm text-foreground border border-border px-4 py-2 hover:bg-muted transition-colors"
        >
          [got it]
        </button>
      </div>
    </div>
  )

  const leaveModal = showLeaveModal && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="border border-border bg-background p-6 max-w-sm w-full mx-4">
        <p className="text-foreground mb-6">are you sure you want to leave the board?</p>
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => setShowLeaveModal(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            [cancel]
          </button>
          <button
            type="button"
            onClick={confirmLeave}
            disabled={isPending}
            className="text-sm text-red-500 hover:text-red-400"
          >
            {isPending ? "[leaving...]" : "[leave]"}
          </button>
        </div>
      </div>
    </div>
  )

  if (existingProfile) {
    return (
      <>
        {couponModal}
        {leaveModal}
        <div className="border border-border p-4 mb-8">
          <p className="text-sm text-muted-foreground mb-2">you are on the board</p>
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-sm text-foreground hover:underline"
            >
              [{isOpen ? "close" : "edit profile"}]
            </button>
            {couponCode && (
              <button
                type="button"
                onClick={() => setShowCouponModal(true)}
                className="text-sm text-green-500 hover:underline"
              >
                [view v0 credit]
              </button>
            )}
            <button
              type="button"
              onClick={handleLeave}
              disabled={isPending}
              className="text-sm text-muted-foreground hover:text-red-500 hover:underline"
            >
              [leave board]
            </button>
          </div>
          {isOpen && formContent}
        </div>
      </>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="mb-8">
        <a
          href="/api/auth/twitter"
          className="block w-full border-2 border-dashed border-muted-foreground/50 p-6 text-center hover:border-foreground hover:bg-muted/20 transition-colors"
        >
          <span className="text-foreground text-lg">+ join the board</span>
          <p className="text-xs text-muted-foreground mt-1">login with x to add yourself</p>
        </a>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-2 border-dashed border-muted-foreground/50 p-6 text-center hover:border-foreground hover:bg-muted/20 transition-colors"
      >
        <span className="text-foreground text-lg">+ join the board</span>
        <p className="text-xs text-muted-foreground mt-1">click to add yourself</p>
      </button>
      {isOpen && formContent}
    </div>
  )
}
