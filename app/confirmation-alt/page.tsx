"use client"

import { useState, useEffect } from "react"
import EternoLogo from "@/components/eterno-logo"

export default function ConfirmationAltPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const messageTimer = setTimeout(() => setShowMessage(true), 1500)
    return () => clearTimeout(messageTimer)
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white overflow-hidden">
      {/* Background video using iframe as a fallback approach */}
      <div className="absolute inset-0 z-0 bg-black">
        <iframe
          src="https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"
          className="w-full h-full border-0 opacity-50"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-md text-center">
        <div className={`transition-all duration-1000 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <EternoLogo width="60mm" inverted={true} className="mx-auto mb-8" />
        </div>

        <p
          className={`font-outfit text-white text-lg md:text-xl tracking-wide font-light transition-all duration-1000 ease-out ${
            showMessage ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          }`}
        >
          EXCLUSIVELY YOURS
        </p>
      </div>
    </main>
  )
}
