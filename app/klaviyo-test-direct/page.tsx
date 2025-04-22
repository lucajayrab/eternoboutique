"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function KlaviyoTestDirectPage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("Test")
  const [lastName, setLastName] = useState("User")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      // Get API key from environment or use the provided one
      const apiKey = "pk_8175d440292244baacd6fa6f30d05e68d2" // This is just for testing

      // Step 1: Create or update profile with consent
      const profileData = {
        data: {
          type: "profile",
          attributes: {
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone_number: "+44 7700900000",
            location: {
              city: "Test City",
              country: "Test Country",
            },
            properties: {
              city: "Test City",
              country: "Test Country",
              source: "Direct Test",
              consent_method: "Test Form",
              consent_timestamp: new Date().toISOString(),
              has_email_consent: true,
            },
            consent: ["email"], // Add explicit consent for email marketing
          },
        },
      }

      console.log("Sending test data to Klaviyo:", JSON.stringify(profileData, null, 2))

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

      let profileResult
      try {
        profileResult = JSON.parse(profileResponseText)
      } catch (e) {
        profileResult = { text: profileResponseText }
      }

      setResult({
        status: profileStatus,
        success: profileResponse.ok,
        data: profileResult,
        raw: profileResponseText,
      })
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Klaviyo Direct API Test</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email (required)
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="test@example.com"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Test" />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="User" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Testing..." : "Test Klaviyo API Directly"}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div
          className={`p-4 ${result.success ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"} border rounded-md`}
        >
          <h2 className="text-lg font-semibold mb-2">API Response</h2>
          <div className="mb-2">
            <span className="font-medium">Status:</span> {result.status} ({result.success ? "Success" : "Failed"})
          </div>

          <div className="overflow-auto max-h-96 bg-gray-50 p-3 rounded-md">
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting Tips</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure your Klaviyo API key is valid and has the correct permissions</li>
          <li>Check that the email address format is correct</li>
          <li>Verify that the API endpoint and headers are correct</li>
          <li>Look for specific error messages in the response</li>
          <li>Check the Klaviyo API documentation for any recent changes</li>
        </ul>
      </div>
    </div>
  )
}
