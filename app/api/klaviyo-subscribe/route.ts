import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, firstName, lastName, city, countrylocation, industrysector, fittingPreference, phonecontact } = body

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    console.log("Attempting to subscribe to Klaviyo:", email)

    // Get API key from environment or use the provided one
    const apiKey = process.env.KLAVIYO_API_KEY || "pk_8175d440292244baacd6fa6f30d05e68d2"

    if (!apiKey) {
      return NextResponse.json({ message: "Klaviyo API key is not available" }, { status: 500 })
    }

    // Verify list ID
    const listId = "SsLL3C"
    console.log("Using Klaviyo list ID:", listId)

    // Step 1: Create or update profile with consent
    // IMPORTANT: Klaviyo no longer accepts 'consent' directly in attributes
    const profileData = {
      data: {
        type: "profile",
        attributes: {
          email: email,
          first_name: firstName || "",
          last_name: lastName || "",
          phone_number: phonecontact || "",
          location: {
            city: city || "",
            country: countrylocation || "",
          },
          properties: {
            city: city || "",
            country: countrylocation || "",
            sector: industrysector || "",
            fitting_preference: fittingPreference || "Not specified",
            source: "Klaviyo Test Form",
            consent_method: "Signup Form",
            consent_timestamp: new Date().toISOString(),
            has_email_consent: true,
            email_consent: true,
            marketing_consent: true,
          },
        },
      },
    }

    console.log("Klaviyo profile payload:", JSON.stringify(profileData, null, 2))

    // Create or update profile
    const profileResponse = await fetch("https://a.klaviyo.com/api/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Revision: "2023-09-15", // Updated to latest API revision
        Authorization: `Klaviyo-API-Key ${apiKey}`,
      },
      body: JSON.stringify(profileData),
    })

    const profileStatus = profileResponse.status
    const profileResponseText = await profileResponse.text()

    let profileId = ""

    // Handle successful profile creation
    if (profileResponse.ok) {
      const profileResult = JSON.parse(profileResponseText)
      profileId = profileResult.data?.id
      console.log("Klaviyo profile created successfully. Profile ID:", profileId)
    }
    // Handle duplicate profile error (409 Conflict)
    else if (profileStatus === 409) {
      try {
        const errorData = JSON.parse(profileResponseText)
        // Extract the duplicate profile ID from the error response
        if (
          errorData.errors &&
          errorData.errors[0] &&
          errorData.errors[0].code === "duplicate_profile" &&
          errorData.errors[0].meta &&
          errorData.errors[0].meta.duplicate_profile_id
        ) {
          profileId = errorData.errors[0].meta.duplicate_profile_id
          console.log("Found existing Klaviyo profile. Using profile ID:", profileId)
        } else {
          console.error("Unexpected format in duplicate profile error:", profileResponseText)
          return NextResponse.json(
            { message: "Failed to process duplicate profile", error: profileResponseText },
            { status: 500 },
          )
        }
      } catch (parseError) {
        console.error("Error parsing duplicate profile response:", parseError)
        console.error("Raw response:", profileResponseText)
        return NextResponse.json(
          { message: "Failed to parse profile response", error: profileResponseText },
          { status: 500 },
        )
      }
    } else {
      console.error(`Klaviyo profile error (${profileStatus}):`, profileResponseText)
      return NextResponse.json({ message: "Failed to create profile", error: profileResponseText }, { status: 500 })
    }

    if (!profileId) {
      return NextResponse.json({ message: "Failed to get profile ID from response" }, { status: 500 })
    }

    // Step 2: Add profile to list
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

    const listResponse = await fetch(subscribeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Revision: "2023-09-15", // Updated to latest API revision
        Authorization: `Klaviyo-API-Key ${apiKey}`,
      },
      body: JSON.stringify(listSubscriptionData),
    })

    if (!listResponse.ok) {
      const error = await listResponse.text()
      console.error("Klaviyo List Subscription Error:", error)
      return NextResponse.json({ message: "Profile created but list subscription failed", error }, { status: 500 })
    }

    const listResult = await listResponse.json()
    console.log("Klaviyo subscription successful:", listResult)

    return NextResponse.json(
      {
        message:
          profileStatus === 409
            ? "User already exists and was added to the list"
            : "User successfully subscribed to Klaviyo",
      },
      { status: 200 },
    )
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
