"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function KlaviyoTestPage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [city, setCity] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/klaviyo-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          city,
          industrysector: "Test",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Successfully subscribed to Klaviyo!")
      } else {
        setStatus("error")
        setMessage(`Error: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Klaviyo Integration Test</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full"
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
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full" />
        </div>

        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Subscribing..." : "Subscribe to Klaviyo"}
        </Button>

        {message && (
          <div
            className={`p-3 rounded mt-4 ${
              status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <p className="text-sm">
          This page tests the Klaviyo integration. Make sure you have set the <code>KLAVIYO_API_KEY</code> environment
          variable in your Vercel project and replaced <code>YOUR_LIST_ID</code> in the API route with your actual
          Klaviyo list ID.
        </p>
      </div>
    </div>
  )
}
