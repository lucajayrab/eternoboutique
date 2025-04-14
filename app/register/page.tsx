"use client"

import { useState, useEffect } from "react"
import SectionedRegistrationForm from "@/components/sectioned-registration-form"
import StickyBanner from "@/components/sticky-banner"

// Define a consistent logo size to match the home page
const LOGO_SIZE = "45mm"

export default function RegisterPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    // Slight delay before showing the form
    const formTimer = setTimeout(() => setShowForm(true), 300)

    return () => {
      clearTimeout(formTimer)
    }
  }, [])

  return (
    <>
      {/* Add the StickyBanner component */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      <main className="flex min-h-screen flex-col items-center justify-start pt-16 p-4 bg-[#f5f4f1]">
        <div
          className={`w-full max-w-xl transition-all duration-1000 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`transition-all duration-1000 ease-out ${showForm ? "opacity-100 transform-none" : "opacity-0 translate-y-8"}`}
          >
            <SectionedRegistrationForm />
          </div>
        </div>
      </main>
    </>
  )
}
