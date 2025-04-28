"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EmailTestPage() {
  const [to, setTo] = useState("")
  const [firstName, setFirstName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setResult(null)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          firstName,
        }),
      })

      const data = await response.json()
      setStatus(data.success ? "success" : "error")
      setResult(data)
    } catch (error) {
      setStatus("error")
      setResult(error instanceof Error ? { message: error.message } : { message: "Unknown error" })
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Email Test Page</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium mb-1">
            To Email (required)
          </label>
          <Input
            id="to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            placeholder="recipient@example.com"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
          />
        </div>

        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Sending..." : "Send Test Email"}
        </Button>
      </form>

      {result && (
        <div
          className={`mt-6 p-4 rounded-md ${
            status === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">
            {status === "success" ? "Email Sent Successfully" : "Error Sending Email"}
          </h2>
          <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <p className="mb-2">
          This page tests the Resend email integration. Enter an email address and click "Send Test Email" to verify
          that the integration is working correctly.
        </p>
        <p className="text-sm text-gray-600">
          Make sure you have set the <code>RESEND_API_KEY</code> environment variable in your Vercel project.
        </p>
      </div>
    </div>
  )
}
