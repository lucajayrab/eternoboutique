"use client"

import { useState, useEffect } from "react"
import NavigationMenu from "@/components/navigation-menu"
import SectionedRegistrationForm from "@/components/sectioned-registration-form"
import MobileMenu from "@/components/main-menu"

// Define a consistent logo size
const LOGO_SIZE = "45mm"

export default function RegisterPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    // Slight delay before showing the form
    const formTimer = setTimeout(() => setShowForm(true), 300)

    // Ensure the page starts at the top
    window.scrollTo(0, 0)

    return () => {
      clearTimeout(formTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-eterno-grey-beige">
      {/* Mobile Menu - only visible on mobile */}
      <MobileMenu />

      <NavigationMenu logoWidth="45mm" />
      <div className={`pt-[70px] transition-all duration-1000 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div
          className={`transition-all duration-1000 ease-out ${showForm ? "opacity-100 transform-none" : "opacity-0 translate-y-8"}`}
        >
          <SectionedRegistrationForm />
        </div>
      </div>
    </div>
  )
}
