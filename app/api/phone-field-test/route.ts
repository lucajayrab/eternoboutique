import { NextResponse } from "next/server"

// HubSpot credentials
const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

export async function GET(request: Request) {
  try {
    // Create a test submission with the exact field name format
    const testData = {
      fields: [
        { name: "email", value: `test-${Date.now()}@example.com` },
        { name: "firstname", value: "Test" },
        // HubSpot UI label is 'phone' but the API requires field name "0-2/phone"
        { name: "0-2/phone", value: "+44 1234567890" }, // Using the exact field identifier from the error message
        { name: "lastname", value: "User" },
        { name: "countrylocation", value: "Test Country" },
        { name: "city", value: "Test City" },
        { name: "industrysector", value: "Test Industry" },
      ],
      context: {
        pageUri: "https://eternotailoring.com/test",
        pageName: "Phone Field Test",
      },
    }

    console.log("Sending test data to HubSpot:", JSON.stringify(testData, null, 2))

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
      testData: testData,
      response: responseData,
      rawResponse: responseText,
    })
  } catch (error) {
    console.error("Test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
