import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()

    // Log the submission data
    console.log("Email backup submission:", JSON.stringify(body, null, 2))

    // In a real implementation, you would send this data via email
    // or store it in a database as a backup

    return NextResponse.json({
      success: true,
      message: "Backup submission received",
    })
  } catch (error) {
    console.error("Backup submission error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process backup submission",
      },
      { status: 500 },
    )
  }
}
