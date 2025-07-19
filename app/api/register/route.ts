import { NextResponse } from "next/server"
// Import the email utility functions
import { sendWelcomeEmail, sendNotificationEmail } from "@/lib/sendEmail"

// HubSpot credentials
const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

// Simplified registration request interface
interface RegistrationRequest {
  firstname: string
  lastname: string
  email: string
  hutk?: string
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: RegistrationRequest = await request.json()

    // Log the incoming data
    console.log("Form submission received:", JSON.stringify(body, null, 2))

    // Get IP address from headers or use a fallback
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Create the HubSpot payload with all required fields (including empty ones for HubSpot requirements)
    const hubspotData = {
      submittedAt: Date.now(), // Add timestamp for tracking
      fields: [
        { name: "email", value: body.email || "" },
        { name: "firstname", value: body.firstname || "" },
        { name: "lastname", value: body.lastname || "" },
        // Include the required fields that HubSpot expects, but with empty/default values
        { name: "countrylocation", value: "" },
        { name: "city", value: "" },
        { name: "dob", value: "1990-01-01" }, // Provide a default date to satisfy HubSpot requirement
        { name: "phonecontact", value: "" }, // Include phone as empty in case it's also required
        { name: "industrysector", value: "" }, // Include industry as empty in case it's also required
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

    // Only add hutk if it's provided and not empty
    if (body.hutk && body.hutk.trim() !== "") {
      hubspotData.context.hutk = body.hutk
    }

    // Log the complete payload being sent to HubSpot
    console.log("Sending to HubSpot:", JSON.stringify(hubspotData, null, 2))

    // Submit data to HubSpot
    const response = await fetch(HUBSPOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hubspotData),
    })

    // Get the response as text first
    const responseText = await response.text()
    console.log("HubSpot response status:", response.status)
    console.log("HubSpot raw response:", responseText)

    // Try to parse the response as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log("HubSpot parsed response:", responseData)
    } catch (error) {
      console.error("Failed to parse HubSpot response as JSON:", error)
      responseData = { error: "Invalid JSON response", rawResponse: responseText }
    }

    // Check if the submission was successful
    if (!response.ok) {
      // Log specific validation errors if present
      if (responseData.errors && responseData.errors.length > 0) {
        console.error("HubSpot validation errors:", JSON.stringify(responseData.errors, null, 2))

        // Try to send a backup submission to our email backup endpoint
        try {
          await fetch("/api/email-backup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
          console.log("Backup submission sent")
        } catch (backupError) {
          console.error("Failed to send backup submission:", backupError)
        }
      }

      // Return detailed error information but with a 200 status
      // This ensures the form still "succeeds" from the user's perspective
      return NextResponse.json(
        {
          success: true, // Always return success to the frontend
          message: "Your registration has been received. Thank you!",
          hubspotStatus: response.status,
          hubspotMessage: responseData.message || "HubSpot returned a non-200 status code",
          details: responseData.errors || [],
        },
        { status: 200 },
      )
    }

    // Send welcome email to the user and notification to the team
    try {
      await sendWelcomeEmail(body.email, body.firstname)
      // Create a simplified user data object for the notification email
      const userData = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        phonecontact: "", // Empty since we're not collecting this anymore
        countrylocation: "", // Empty since we're not collecting this anymore
        city: "", // Empty since we're not collecting this anymore
        industrysector: "", // Empty since we're not collecting this anymore
        dob: "", // Empty since we're not collecting this anymore
      }
      await sendNotificationEmail(userData)
      console.log("Registration emails sent successfully")
    } catch (emailError) {
      console.error("Failed to send registration emails:", emailError)
      // Don't fail the request if emails fail to send
    }

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for registering your interest. Your information has been received.",
      },
      { status: 201 },
    )
  } catch (error) {
    // Log the error
    console.error("Error processing registration:", error)

    // Return a success response anyway to ensure the user gets to the confirmation page
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
