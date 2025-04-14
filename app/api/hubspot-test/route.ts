import { NextResponse } from "next/server"

// Updated with your actual credentials
const DEFAULT_PORTAL_ID = "145973953"
const DEFAULT_FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"

export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url)
  const portalId = searchParams.get("portalId") || DEFAULT_PORTAL_ID
  const formId = searchParams.get("formId") || DEFAULT_FORM_ID

  const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

  try {
    // Create a simple test payload
    const testPayload = {
      submittedAt: Date.now(),
      fields: [
        { name: "firstname", value: "Test" },
        { name: "lastname", value: "User" },
        { name: "email", value: `test-${Date.now()}@example.com` },
        { name: "phone", value: "1234567890" },
        { name: "country", value: "Test Country" },
        { name: "city", value: "Test City" },
        { name: "age", value: "30" },
        { name: "industry", value: "Test Industry" },
      ],
      context: {
        pageUri: "https://eternotailoring.com/test",
        pageName: "HubSpot API Test",
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to allow ETERNO to store and process my personal data.",
        },
      },
    }

    // Send test submission to HubSpot
    const response = await fetch(HUBSPOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    })

    // Get response text
    const responseText = await response.text()

    // Try to parse as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { text: responseText }
    }

    // Return test results
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      url: HUBSPOT_API_URL,
      payload: testPayload,
      response: responseData,
      rawResponse: responseText,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
