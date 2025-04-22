import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email") || `test-${Date.now()}@example.com`
  const checkEnvOnly = searchParams.get("checkEnvOnly") === "true"

  console.log("Starting Klaviyo debug test...")

  try {
    // 1. Get API key from environment or use the provided one
    const apiKey = process.env.KLAVIYO_API_KEY || "pk_8175d440292244baacd6fa6f30d05e68d2"

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "No Klaviyo API key available",
          apiKeyPresent: false,
        },
        { status: 500 },
      )
    }

    // If only checking environment variable
    if (checkEnvOnly) {
      return NextResponse.json({
        success: true,
        apiKeyPresent: true,
        apiKeyPrefix: apiKey.substring(0, 5),
        apiKeyType: apiKey.startsWith("pk_") ? "Public Key" : "Private Key",
      })
    }

    // Determine key type
    const keyType = apiKey.startsWith("pk_") ? "Public Key" : "Private Key"
    console.log(`API Key found (${keyType}), first 5 chars:`, apiKey.substring(0, 5))

    // 2. Prepare test data for Klaviyo using current API format
    // IMPORTANT: Klaviyo no longer accepts 'consent' directly in attributes
    const profileDataPayload = {
      data: {
        type: "profile",
        attributes: {
          email: email,
          first_name: "Debug",
          last_name: "Test",
          phone_number: "+44 7700900000",
          location: {
            city: "Test City",
            country: "Test Country",
          },
          properties: {
            city: "Test City",
            country: "Test Country",
            source: "Debug API",
            consent_method: "Signup Form",
            consent_timestamp: new Date().toISOString(),
            has_email_consent: true,
            email_consent: true,
            marketing_consent: true,
          },
        },
      },
    }

    console.log("Sending test data to Klaviyo:", JSON.stringify(profileDataPayload, null, 2))

    // 3. Create or update profile
    const profileResponse = await fetch("https://a.klaviyo.com/api/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Revision: "2023-09-15", // Updated to latest API revision
        Authorization: `Klaviyo-API-Key ${apiKey}`,
      },
      body: JSON.stringify(profileDataPayload),
    })

    const profileStatus = profileResponse.status
    const profileResponseText = await profileResponse.text()
    console.log("Klaviyo profile response status:", profileStatus)
    console.log("Klaviyo profile raw response:", profileResponseText)

    let profileId = ""
    let duplicateProfileFound = false

    // Parse profile response
    let profileData
    try {
      profileData = JSON.parse(profileResponseText)

      // Handle successful profile creation
      if (profileResponse.ok) {
        profileId = profileData.data?.id
        console.log("Profile ID:", profileId)
      }
      // Handle duplicate profile error (409 Conflict)
      else if (profileStatus === 409) {
        if (
          profileData.errors &&
          profileData.errors[0] &&
          profileData.errors[0].code === "duplicate_profile" &&
          profileData.errors[0].meta &&
          profileData.errors[0].meta.duplicate_profile_id
        ) {
          profileId = profileData.errors[0].meta.duplicate_profile_id
          duplicateProfileFound = true
          console.log("Found existing profile ID:", profileId)
        }
      }
    } catch (e) {
      profileData = { text: profileResponseText }
      console.error("Error parsing profile response:", e)
    }

    // If profile creation failed and it's not a duplicate profile, return error
    if (!profileResponse.ok && !duplicateProfileFound) {
      return NextResponse.json({
        success: false,
        status: profileStatus,
        email: email,
        apiKeyType: keyType,
        apiKeyPrefix: apiKey.substring(0, 5),
        requestPayload: profileDataPayload,
        response: profileData,
        rawResponse: profileResponseText,
        error: "Failed to create/update profile",
        nextSteps: "Check the error response and make necessary adjustments",
      })
    }

    // 4. Add profile to list if profile was created successfully or found as duplicate
    let listResponse = null
    let listStatus = null
    let listText = ""
    let listData = null

    if (profileId) {
      // Verify list ID
      const listId = "SsLL3C"
      console.log("Using Klaviyo list ID:", listId)

      // Using the correct endpoint for adding profiles to lists
      const subscribeEndpoint = `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles`

      const listSubscriptionData = {
        data: [
          {
            type: "profile",
            id: profileId,
          },
        ],
      }

      console.log("Klaviyo list subscription payload:", JSON.stringify(listSubscriptionData, null, 2))
      console.log("Using subscription endpoint:", subscribeEndpoint)

      listResponse = await fetch(subscribeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Revision: "2023-09-15", // Updated to latest API revision
          Authorization: `Klaviyo-API-Key ${apiKey}`,
        },
        body: JSON.stringify(listSubscriptionData),
      })

      listStatus = listResponse.status
      listText = await listResponse.text()

      console.log("Klaviyo list subscription status:", listStatus)
      console.log("Klaviyo list subscription response:", listText)

      try {
        listData = JSON.parse(listText)
      } catch (e) {
        listData = { text: listText }
        console.error("Error parsing list response:", e)
      }
    }

    // 5. Return comprehensive debug information
    return NextResponse.json({
      success: (profileResponse.ok || duplicateProfileFound) && (listResponse ? listResponse.ok : true),
      profileStatus: profileStatus,
      duplicateProfileFound: duplicateProfileFound,
      listStatus: listStatus,
      email: email,
      profileId: profileId,
      listId: "SsLL3C",
      apiKeyPresent: true,
      apiKeyType: keyType,
      apiKeyPrefix: apiKey.substring(0, 5),
      profilePayload: profileDataPayload,
      profileResponse: profileData,
      listPayload: listResponse ? { listId: "SsLL3C", profileId } : null,
      listResponse: listData,
      nextSteps:
        profileResponse.ok || duplicateProfileFound
          ? listResponse && listResponse.ok
            ? "Check your Klaviyo list to confirm the test email was added"
            : "Profile created/found but list subscription failed. Check list ID and permissions."
          : "Review the error response and make necessary adjustments",
    })
  } catch (error) {
    console.error("Klaviyo debug error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        apiKeyPresent: !!process.env.KLAVIYO_API_KEY,
      },
      { status: 500 },
    )
  }
}
