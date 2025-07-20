"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import DesktopNavigation from "@/components/desktop-navigation"
import SlidingButton from "@/components/sliding-button"

export default function ThankYouPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleReturnHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyBanner logoWidth="45mm" />
      <MobileMenu />
      <DesktopNavigation />

      <div className="pt-[70px]">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-4xl py-16">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] uppercase text-[#5a5a56] mb-6">
                Thank You
              </h1>
              <p className="text-lg font-light text-[#5a5a56]/80 mb-4 max-w-2xl mx-auto">
                Your registration has been successfully submitted.
              </p>
              <p className="text-base font-light text-[#5a5a56]/70 max-w-2xl mx-auto">
                We will be in touch soon with details about your bespoke ETERNO experience.
              </p>
            </div>

            <div className="mt-12">
              <SlidingButton onClick={handleReturnHome} variant="dark" duration={800} className="px-8 py-3 text-sm">
                RETURN HOME
              </SlidingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
