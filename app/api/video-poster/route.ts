import { NextResponse } from "next/server"

export async function GET() {
  // Create a simple black image as a fallback
  const canvas = new OffscreenCanvas(1920, 1080)
  const ctx = canvas.getContext("2d")

  if (ctx) {
    // Fill with black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, 1920, 1080)

    // Add some text
    ctx.fillStyle = "#333333"
    ctx.font = "30px Arial"
    ctx.fillText("Loading video...", 50, 50)
  }

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 })

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
