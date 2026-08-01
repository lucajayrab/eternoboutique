import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

// This route no longer receives the file itself. It only issues a short-lived
// token so the browser can upload directly to Vercel Blob, which bypasses the
// serverless request body size limit and supports very large video files.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"],
        maximumSizeInBytes: 1024 * 1024 * 1024, // 1GB
        addRandomSuffix: true,
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log("[v0] Hero video uploaded to blob:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 })
  }
}
