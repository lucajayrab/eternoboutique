"use client"

import { useState, useEffect } from "react"
import EternoLogo from "@/components/eterno-logo"
import MobileMenu from "@/components/main-menu"
import StickyBanner from "@/components/sticky-banner"

export default function ConfirmationPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const LOGO_SIZE = "45mm"

  // Properly formatted video URL - ensuring there are no typos or extra spaces
  const videoUrl =
    "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

  useEffect(() => {
    setIsLoaded(true)

    // Staggered animation for text
    const messageTimer = setTimeout(() => setShowMessage(true), 1500)

    return () => {
      clearTimeout(messageTimer)
    }
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white overflow-hidden">
      {/* Sticky Banner */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Background video - simplified implementation */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-50"
          poster="/video-poster.jpg" // Fallback image while video loads
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-md text-center">
        <div className={`transition-all duration-1000 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <EternoLogo width="60mm" inverted={true} className="mx-auto mb-8" />
        </div>

        <p
          className={`font-mulish text-white text-base font-light leading-relaxed tracking-wide transition-all duration-1000 ease-out ${
            showMessage ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          }`}
        >
          EXCLUSIVELY YOUR
        </p>
      </div>
    </main>
  )
}
