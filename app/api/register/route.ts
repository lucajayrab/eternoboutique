import { NextResponse } from "next/server"
import { sendWelcomeEmail, sendNotificationEmail } from "@/lib/sendEmail"

const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

interface RegistrationRequest {
  firstname: string
  lastname: string
  email: string
  hutk?: string
}

export async function POST(request: Request) {
  try {
    const body: RegistrationRequest = await request.json()
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    const hubspotData = {
      submittedAt: Date.now(),
      fields: [
        { name: "email", value: body.email || "" },
        { name: "firstname", value: body.firstname || "" },
        { name: "lastname", value: body.lastname || "" },
        { name: "countrylocation", value: "" },
        { name: "city", value: "" },
        { name: "dob", value: "1990-01-01" },
        { name: "phonecontact", value: "" },
        { name: "industrysector", value: "" },
      ],
      context: {
        pageUri: "https://eternotailoring.com/register",
        pageName: "ETERNŌ Boutique Registration",
        ipAddress: ipAddress,
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to allow ETERNŌ to store and process my personal data.",
        },
      },
    }

    if (body.hutk && body.hutk.trim() !== "") {
      hubspotData.context.hutk = body.hutk
    }

    const response = await fetch(HUBSPOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hubspotData),
    })

    const responseText = await response.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (error) {
      responseData = { error: "Invalid JSON response", rawResponse: responseText }
    }

    if (!response.ok) {
      if (responseData.errors && responseData.errors.length > 0) {
        try {
          await fetch("/api/email-backup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
        } catch (backupError) {
          // Backup failed, but continue
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Your registration has been received. Thank you!",
          hubspotStatus: response.status,
          hubspotMessage: responseData.message || "HubSpot returned a non-200 status code",
          details: responseData.errors || [],
        },
        { status: 200 },
      )
    }

    try {
      await sendWelcomeEmail(body.email, body.firstname)
      const userData = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        phonecontact: "",
        countrylocation: "",
        city: "",
        industrysector: "",
        dob: "",
      }
      await sendNotificationEmail(userData)
    } catch (emailError) {
      // Email failed, but continue
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for registering your interest. Your information has been received.",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: "Your registration has been received. Thank you!",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    )
  }
}
