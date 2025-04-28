import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/sendEmail"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { to, firstName } = body

    // Validate required fields
    if (!to) {
      return NextResponse.json({ success: false, message: "Email address is required" }, { status: 400 })
    }

    // Send the welcome email
    const result = await sendWelcomeEmail(to, firstName)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send email", error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: result.data,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error sending email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
