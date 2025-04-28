"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

export default function CookieConsentBanner() {
  const { cookiesAccepted, acceptCookies } = useCookieConsent()
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    // Log for debugging
    console.log("CookieConsentBanner mounted, cookiesAccepted:", cookiesAccepted)

    // If cookies are already accepted, don't show the banner
    if (cookiesAccepted) {
      console.log("Cookies already accepted, not showing banner")
      return
    }

    // Set a timeout to show the banner after 2.5 seconds
    const timer = setTimeout(() => {
      console.log("Setting banner to visible")
      setIsVisible(true)
    }, 2500)

    return () => {
      clearTimeout(timer)
    }
  }, [cookiesAccepted])

  // If cookies are accepted, don't render anything
  if (cookiesAccepted) {
    return null
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="bg-[#f5f4f1] border-t border-[#e0ddd2] shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-5 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 pr-0 md:pr-4">
              <p className="font-mulish text-xs sm:text-sm text-[#5a5a56] leading-relaxed">
                ETERNO uses cookies to enhance your browsing experience and analyse site traffic. By clicking "Accept",
                you consent to our use of cookies as described in our{" "}
                <Link href="/cookie-policy" className="underline hover:text-eterno-accent transition-colors">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  console.log("Accept button clicked")
                  acceptCookies()
                }}
                className="w-full md:w-auto px-6 md:px-8 py-3 bg-[#5a5a56] text-white hover:bg-[#4a4a46] transition-colors font-mulish tracking-widest text-xs uppercase touch-manipulation"
                aria-label="Accept cookies"
                style={{ touchAction: "manipulation" }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
