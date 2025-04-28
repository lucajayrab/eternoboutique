import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || "re_Qa3Vzhhi_9SiVF69hWAxkcZmPjuLtirB")

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { to, subject, html, from = "ETERNO <no-reply@eternotailoring.com>" } = body

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: to, subject, or html" },
        { status: 400 },
      )
    }

    console.log(`Sending email to ${to} with subject: ${subject}`)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to send email", error: error.message },
        { status: 500 },
      )
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data,
    })
  } catch (error) {
    console.error("Error sending email:", error)
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
