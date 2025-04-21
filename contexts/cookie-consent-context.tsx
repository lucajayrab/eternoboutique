"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CookieConsentContextType = {
  cookiesAccepted: boolean
  acceptCookies: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    // Check if consent has been given previously
    const storedConsent = localStorage.getItem("eterno_cookie_consent")
    if (storedConsent === "accepted") {
      setCookiesAccepted(true)
    }
    setIsLoaded(true)
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("eterno_cookie_consent", "accepted")
    setCookiesAccepted(true)
  }

  return (
    <CookieConsentContext.Provider value={{ cookiesAccepted, acceptCookies }}>{children}</CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider")
  }
  return context
}
