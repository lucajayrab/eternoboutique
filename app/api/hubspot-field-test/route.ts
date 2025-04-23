import { NextResponse } from "next/server"

// HubSpot credentials
const PORTAL_ID = "145973953"
const FORM_ID = "87c8ab28-e698-4394-bc1f-c1da5b434622"
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

export async function GET(request: Request) {
  try {
    // Generate a unique test email
    const testEmail = `test-${Date.now()}@example.com`
    const testPhone = "+44 7700900000"

    // Create test submissions with different phone field names
    const testFields = [
      // Test multiple phone field variations
      [
        { name: "email", value: `${testEmail}-1` },
        { name: "firstname", value: "Test1" },
        { name: "phone", value: testPhone },
      ],
      [
        { name: "email", value: `${testEmail}-2` },
        { name: "firstname", value: "Test2" },
        { name: "mobilephone", value: testPhone },
      ],
      [
        { name: "email", value: `${testEmail}-3` },
        { name: "firstname", value: "Test3" },
        { name: "phonecontact", value: testPhone },
      ],
      [
        { name: "email", value: `${testEmail}-4` },
        { name: "firstname", value: "Test4" },
        { name: "phone_number", value: testPhone },
      ],
    ]

    const results = []

    // Send each test submission
    for (const fields of testFields) {
      const testData = {
        submittedAt: Date.now(),
        fields,
        context: {
          pageUri: "https://eternotailoring.com/test",
          pageName: "Field Test",
        },
      }

      console.log(`Testing field name: ${fields[2].name}`)
      console.log("Sending test data to HubSpot:", JSON.stringify(testData, null, 2))

      try {
        const response = await fetch(HUBSPOT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        })

        const status = response.status
        const responseText = await response.text()

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          responseData = { text: responseText }
        }

        results.push({
          fieldName: fields[2].name,
          status,
          success: response.ok,
          response: responseData,
        })

        console.log(`Result for ${fields[2].name}: ${status} ${response.ok ? "Success" : "Failed"}`)
      } catch (error) {
        results.push({
          fieldName: fields[2].name,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        console.error(`Error testing ${fields[2].name}:`, error)
      }
    }

    // Return all test results
    return NextResponse.json({
      success: true,
      message: "Phone field tests completed",
      results,
      nextSteps: "Check your HubSpot contacts to see which field name worked correctly",
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
