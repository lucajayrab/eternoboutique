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

    // Prepare data for Klaviyo
    const klaviyoData = {
      profiles: [
        {
          email,
          first_name: firstName || "",
          last_name: lastName || "",
          phone_number: phonecontact || "",
          custom_properties: {
            city: city || "",
            country: countrylocation || "",
            sector: industrysector || "",
            fitting_preference: fittingPreference || "Not specified",
          },
        },
      ],
    }

    // Send to Klaviyo
    const klaviyoResponse = await fetch(`https://a.klaviyo.com/api/v2/list/TetS7r/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KLAVIYO_API_KEY}`,
      },
      body: JSON.stringify(klaviyoData),
    })

    if (!klaviyoResponse.ok) {
      const error = await klaviyoResponse.text()
      console.error("Klaviyo Error:", error)
      return NextResponse.json({ message: "Failed to subscribe user", error }, { status: 500 })
    }

    const responseData = await klaviyoResponse.json()
    console.log("Klaviyo subscription successful:", responseData)

    return NextResponse.json({ message: "User successfully subscribed to Klaviyo" }, { status: 200 })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
