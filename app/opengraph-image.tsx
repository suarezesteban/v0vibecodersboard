import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "vibecoders.board"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          vibecoders.board
        </div>
        <div
          style={{
            color: "#71717a",
            fontSize: 28,
            marginTop: 24,
          }}
        >
          find and hire vibecoders for your next project
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
