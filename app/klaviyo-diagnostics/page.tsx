"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function KlaviyoDiagnosticsPage() {
  const [email, setEmail] = useState("")
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [envVarStatus, setEnvVarStatus] = useState<"checking" | "present" | "missing">("checking")

  // Check if environment variable is set
  useEffect(() => {
    const checkEnvVar = async () => {
      try {
        const res = await fetch("/api/klaviyo-debug?checkEnvOnly=true")
        const data = await res.json()
        setEnvVarStatus(data.apiKeyPresent ? "present" : "missing")
      } catch (error) {
        console.error("Error checking environment variable:", error)
        setEnvVarStatus("missing")
      }
    }

    checkEnvVar()
  }, [])

  const runTest = async () => {
    setLoading(true)
    setTestResults(null)

    try {
      const testEmail = email || `test-${Date.now()}@example.com`
      const res = await fetch(`/api/klaviyo-debug?email=${encodeURIComponent(testEmail)}`)
      const data = await res.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Klaviyo Integration Diagnostics</h1>

      {/* Environment Variable Status */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variable Check</h2>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              envVarStatus === "checking" ? "bg-yellow-500" : envVarStatus === "present" ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>
            {envVarStatus === "checking"
              ? "Checking KLAVIYO_API_KEY..."
              : envVarStatus === "present"
                ? "KLAVIYO_API_KEY is set"
                : "KLAVIYO_API_KEY is missing"}
          </span>
        </div>
        {envVarStatus === "missing" && (
          <p className="text-red-600 mt-2 text-sm">
            Please add the KLAVIYO_API_KEY environment variable to your Vercel project.
          </p>
        )}
      </div>

      {/* Test Runner */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Run Diagnostic Test</h2>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Email for test (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={runTest} disabled={loading}>
            {loading ? "Running Test..." : "Run Test"}
          </Button>
        </div>
        <p className="text-sm text-gray-600">This will attempt to add a test profile to your Klaviyo list.</p>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>

          <div
            className={`p-3 rounded mb-4 ${
              testResults.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <strong>{testResults.success ? "Success!" : "Failed"}</strong>:
            {testResults.success
              ? " Test profile was successfully added to your Klaviyo list."
              : ` Could not add test profile. Status: ${testResults.status || "Unknown"}`}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Test Details</h3>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Email: {testResults.email}</li>
                <li>List ID: {testResults.listId}</li>
                <li>API Key Present: {testResults.apiKeyPresent ? "Yes" : "No"}</li>
                {testResults.apiKeyPrefix && <li>API Key Prefix: {testResults.apiKeyPrefix}...</li>}
              </ul>
            </div>

            {!testResults.success && (
              <div>
                <h3 className="font-medium text-red-800">Error Information</h3>
                <div className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                  <pre className="text-xs">{JSON.stringify(testResults.response || testResults.error, null, 2)}</pre>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium">Next Steps</h3>
              <p className="mt-1">{testResults.nextSteps}</p>
            </div>
          </div>
        </div>
      )}

      {/* Common Issues */}
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Invalid API Key</strong>: Ensure your Klaviyo API key is correct and has write permissions.
          </li>
          <li>
            <strong>Incorrect List ID</strong>: Verify that "SsLL3C" is the correct list ID in your Klaviyo account.
          </li>
          <li>
            <strong>API Format</strong>: The Klaviyo API expects a specific format. Check the response for format
            errors.
          </li>
          <li>
            <strong>Rate Limiting</strong>: Klaviyo may rate-limit requests. Check for 429 status codes.
          </li>
          <li>
            <strong>Network Issues</strong>: Ensure your Vercel deployment can reach the Klaviyo API.
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Return to Home
        </Button>
      </div>
    </div>
  )
}
