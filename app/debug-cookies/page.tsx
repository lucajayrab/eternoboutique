"use client"

import { useState, useEffect } from "react"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

export default function DebugCookiesPage() {
  const { cookiesAccepted, acceptCookies, resetCookieConsent } = useCookieConsent()
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(null)

  // Check localStorage on mount and when cookiesAccepted changes
  useEffect(() => {
    try {
      const value = localStorage.getItem("eterno_cookie_consent")
      setLocalStorageValue(value)
    } catch (error) {
      console.error("Error reading localStorage:", error)
      setLocalStorageValue("Error accessing localStorage")
    }
  }, [cookiesAccepted])

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Cookie Consent Debugging</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Current State</h2>
        <p className="mb-2">
          <strong>Cookies Accepted:</strong> {cookiesAccepted ? "Yes" : "No"}
        </p>
        <p className="mb-4">
          <strong>localStorage Value:</strong> {localStorageValue === null ? "null" : `"${localStorageValue}"`}
        </p>

        <div className="flex gap-4 mt-6">
          <button onClick={acceptCookies} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Accept Cookies
          </button>

          <button onClick={resetCookieConsent} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Reset Consent
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Use the <strong>Reset Consent</strong> button to clear the cookie consent from localStorage
          </li>
          <li>
            Use the <strong>Reload Page</strong> button to refresh and see if the banner appears
          </li>
          <li>
            Use the <strong>Accept Cookies</strong> button to manually set consent
          </li>
          <li>Check the browser console for additional debugging information</li>
        </ul>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> If the banner still doesn't appear after resetting consent and reloading, there might
            be an issue with localStorage access, browser permissions, or a JavaScript error. Check the browser console
            for more details.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  )
}
