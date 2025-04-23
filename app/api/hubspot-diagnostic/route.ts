import { NextResponse } from "next/server"

// HubSpot credentials
const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

export async function GET(request: Request) {
  try {
    // Create a unique test email
    const testEmail = `test-${Date.now()}@example.com`

    // Get IP address from request headers
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Create test data with the correct field identifiers
    const testData = {
      submittedAt: Date.now(),
      fields: [
        { name: "email", value: testEmail },
        { name: "firstname", value: "Test" },
        // HubSpot UI label is 'phone' but the API requires field name "0-2/phone"
        { name: "0-2/phone", value: "+44 1234567890" }, // Using the exact field identifier
        { name: "lastname", value: "User" },
        { name: "countrylocation", value: "Test Country" },
        { name: "city", value: "Test City" },
        { name: "industrysector", value: "Test Industry" },
        { name: "dob", value: "2000-01-01" },
      ],
      context: {
        pageUri: "https://eternotailoring.com/diagnostic",
        pageName: "ETERNŌ Diagnostic Test",
        ipAddress: ipAddress,
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to allow ETERNŌ to store and process my personal data.",
        },
      },
    }

    console.log("Diagnostic test - sending to HubSpot:", JSON.stringify(testData, null, 2))

    // Submit test data to HubSpot
    const response = await fetch(HUBSPOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    // Get response as text
    const responseText = await response.text()
    console.log("HubSpot diagnostic response status:", response.status)
    console.log("HubSpot diagnostic raw response:", responseText)

    // Try to parse as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (error) {
      responseData = { error: "Invalid JSON response", text: responseText }
    }

    // Return diagnostic results
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      testEmail: testEmail,
      ipAddress: ipAddress,
      requestHeaders: Object.fromEntries([...request.headers.entries()]),
      hubspotPayload: testData,
      hubspotResponse: responseData,
      nextSteps: response.ok
        ? "Check your HubSpot contacts for the test email to confirm all fields are showing correctly."
        : "Review the error response and make necessary adjustments to your integration.",
    })
  } catch (error) {
    console.error("Diagnostic test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
