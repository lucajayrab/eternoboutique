import { NextResponse } from "next/server"
import type { RegistrationFormData } from "@/lib/form-schema"

// HubSpot credentials
const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

// Make sure the RegistrationRequest interface extends the updated RegistrationFormData
interface RegistrationRequest extends RegistrationFormData {
  hutk?: string
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: RegistrationRequest = await request.json()

    // Log the incoming data
    console.log("Form submission received:", JSON.stringify(body, null, 2))

    // Get IP address from headers or use a fallback
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1" // Fallback IP address

    // Create the HubSpot payload with fields in the specified order
    const hubspotData: any = {
      fields: [
        // Personal Info
        { name: "firstname", value: body.firstname || "" },
        { name: "lastname", value: body.lastname || "" },
        // Only include age if it's provided
        ...(body.age !== undefined ? [{ name: "age", value: body.age.toString() }] : []),

        // Contact Details (in the requested order)
        { name: "email", value: body.email || "" },
        // Ensure phone number is in international format (it should already be from the component)
        { name: "phonecontact", value: body.phonecontact || "" },
        { name: "countrylocation", value: body.countrylocation || "" },
        { name: "city", value: body.city || "" },

        // Preferences
        { name: "industrysector", value: body.industrysector || "" },
      ],
      context: {
        pageUri: "https://eternotailoring.com",
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
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to submit your registration. Please try again later.",
          error: responseData.message || "Unknown error",
        },
        { status: 400 },
      )
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

    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process registration. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
