"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CookieConsentContextType = {
  cookiesAccepted: boolean
  acceptCookies: () => void
  resetCookieConsent: () => void // Add a function to reset consent (for testing)
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    // Check if consent has been given previously
    try {
      const storedConsent = localStorage.getItem("eterno_cookie_consent")
      console.log("Cookie consent from localStorage:", storedConsent)
      if (storedConsent === "accepted") {
        setCookiesAccepted(true)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // If localStorage is not available, we'll show the banner
    }
    setIsLoaded(true)
  }, [])

  const acceptCookies = () => {
    try {
      localStorage.setItem("eterno_cookie_consent", "accepted")
      console.log("Cookie consent saved to localStorage")
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
    setCookiesAccepted(true)
  }

  // Function to reset cookie consent (for testing)
  const resetCookieConsent = () => {
    try {
      localStorage.removeItem("eterno_cookie_consent")
      console.log("Cookie consent reset")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
    setCookiesAccepted(false)
  }

  return (
    <CookieConsentContext.Provider value={{ cookiesAccepted, acceptCookies, resetCookieConsent }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider")
  }
  return context
}
