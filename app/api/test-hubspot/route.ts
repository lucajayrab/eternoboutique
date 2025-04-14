import { NextResponse } from "next/server"

// HubSpot credentials
const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

export async function GET(request: Request) {
  try {
    // Create a test submission with a unique email
    const testEmail = `test-${Date.now()}@example.com`

    const testData = {
      fields: [
        { name: "firstname", value: "Test" },
        { name: "lastname", value: "User" },
        { name: "email", value: testEmail },
        { name: "phonecontact", value: "1234567890" },
        { name: "countrylocation", value: "Test Country" },
        { name: "city", value: "Test City" },
        { name: "age", value: "30" },
        { name: "industrysector", value: "Test Industry" },
      ],
      context: {
        pageUri: "https://eternotailoring.com",
        pageName: "ETERNŌ Boutique Registration Test",
        hutk: "test-cookie-for-hubspot", // Add a test hutk value
      },
    }

    console.log("Sending test submission to HubSpot:", JSON.stringify(testData, null, 2))

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
    console.log("HubSpot test response status:", response.status)
    console.log("HubSpot test raw response:", responseText)

    // Try to parse as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (error) {
      responseData = { error: "Invalid JSON response", text: responseText }
    }

    // Return test results
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      testEmail: testEmail,
      message: response.ok
        ? "Test submission successful! Check your HubSpot contacts for this test email."
        : "Test submission failed. See details below.",
      details: responseData,
    })
  } catch (error) {
    console.error("Test submission error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Test submission failed due to an error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
