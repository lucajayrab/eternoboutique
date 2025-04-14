import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename") || "video.mp4"

    // Get the file from the request
    const file = await request.blob()

    // Check file size (max 500MB for standard uploads)
    const maxSize = 500 * 1024 * 1024 // 500MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds the 500MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)` },
        { status: 413 },
      )
    }

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Return the URL to the uploaded file
    return NextResponse.json(blob)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
