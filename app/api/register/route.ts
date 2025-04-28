import { NextResponse } from "next/server"
import type { RegistrationFormData } from "@/lib/form-schema"
// Import the email utility functions at the top of the file
import { sendWelcomeEmail, sendRegistrationNotification } from "@/lib/email"

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
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Format the phone number - ensure it's a string and clean it up
    const phoneValue = body.phonecontact ? String(body.phonecontact).trim() : ""

    // Create the HubSpot payload with the EXACT field identifiers HubSpot is expecting
    const hubspotData = {
      submittedAt: Date.now(), // Add timestamp for tracking
      fields: [
        { name: "email", value: body.email || "" },
        { name: "firstname", value: body.firstname || "" },
        // HubSpot UI label is 'phone' but the API requires field name "0-2/phone"
        { name: "0-2/phone", value: phoneValue },
        { name: "lastname", value: body.lastname || "" },
        { name: "countrylocation", value: body.countrylocation || "" },
        { name: "city", value: body.city || "" },
        { name: "industrysector", value: body.industrysector || "" },
        ...(body.dob ? [{ name: "dob", value: body.dob }] : []), // Using the field name confirmed by the user
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

    // KLAVIYO INTEGRATION - Using current API with consent
    try {
      // Get API key from environment or use the provided one
      const apiKey = process.env.KLAVIYO_API_KEY || "pk_8175d440292244baacd6fa6f30d05e68d2"

      if (apiKey) {
        console.log("Sending data to Klaviyo using current API...")

        // Determine key type
        const keyType = apiKey.startsWith("pk_") ? "Public Key" : "Private Key"
        console.log(`Using ${keyType} for Klaviyo API`)

        // Verify list ID
        const listId = "SsLL3C"
        console.log("Using Klaviyo list ID:", listId)

        // Step 1: Create or update profile with consent
        // IMPORTANT: Klaviyo no longer accepts 'consent' directly in attributes
        const profileData = {
          data: {
            type: "profile",
            attributes: {
              email: body.email,
              first_name: body.firstname || "",
              last_name: body.lastname || "",
              phone_number: phoneValue,
              location: {
                city: body.city || "",
                country: body.countrylocation || "",
              },
              properties: {
                city: body.city || "",
                country: body.countrylocation || "",
                sector: body.industrysector || "",
                dob: body.dob || "",
                source: "Registration Form",
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

        console.log("Klaviyo profile response status:", profileStatus)
        console.log("Klaviyo profile raw response:", profileResponseText)

        let profileId = ""
        let profileResult = null

        // Handle successful profile creation
        if (profileResponse.ok) {
          try {
            profileResult = JSON.parse(profileResponseText)
            profileId = profileResult.data?.id
            console.log("Klaviyo profile created successfully. Profile ID:", profileId)
          } catch (parseError) {
            console.error("Error parsing successful profile response:", parseError)
            console.error("Raw successful response:", profileResponseText)
          }
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
            }
          } catch (parseError) {
            console.error("Error parsing duplicate profile response:", parseError)
            console.error("Raw response:", profileResponseText)
          }
        } else {
          console.error(`Klaviyo profile error (${profileStatus}):`, profileResponseText)

          // Try to parse the error response
          try {
            const errorData = JSON.parse(profileResponseText)
            console.error("Klaviyo error details:", JSON.stringify(errorData, null, 2))
          } catch (parseError) {
            console.error("Could not parse error response")
          }
        }

        // Step 2: Add profile to list (only if we have a profile ID)
        if (profileId) {
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

          const listStatus = listResponse.status
          const listText = await listResponse.text()

          console.log("Klaviyo list subscription status:", listStatus)
          console.log("Klaviyo list subscription response:", listText)

          if (!listResponse.ok) {
            console.error(`Klaviyo list subscription error (${listStatus}):`, listText)

            // Try to parse the error response
            try {
              const errorData = JSON.parse(listText)
              console.error("Klaviyo list error details:", JSON.stringify(errorData, null, 2))
            } catch (parseError) {
              console.error("Could not parse list error response")
            }
          } else {
            console.log("Klaviyo list subscription successful")
          }
        } else {
          console.error("No profile ID available for Klaviyo list subscription")
        }
      } else {
        console.warn("No Klaviyo API key available - skipping Klaviyo integration")
      }
    } catch (klaviyoError) {
      console.error("Error sending to Klaviyo:", klaviyoError)
      console.error("Klaviyo error stack:", klaviyoError instanceof Error ? klaviyoError.stack : "No stack trace")
      // Don't fail the whole request if Klaviyo fails
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
      await sendWelcomeEmail(body.email, body.firstname || "Customer")
      await sendRegistrationNotification(body)
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
