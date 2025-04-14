"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import EternoLogo from "@/components/eterno-logo"
import SlidingButton from "@/components/sliding-button"
import StickyBanner from "@/components/sticky-banner"
import InteractiveButtonArea from "@/components/interactive-button-area"

// Define a consistent smaller logo size to use in both places
const LOGO_SIZE = "45mm"

export default function Home() {
  const router = useRouter()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  // Get the video URL from environment variable
  useEffect(() => {
    // Access the environment variable after component mounts (client-side)
    const url = process.env.NEXT_PUBLIC_VIDEO_URL
    if (url) {
      setVideoUrl(url)
    } else {
      console.error("NEXT_PUBLIC_VIDEO_URL environment variable is not set")
      setIsVideoError(true)
    }
  }, [])

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleScrollDown = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle video loaded event
  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  // Handle video error
  const handleVideoError = () => {
    console.error("Video failed to load")
    setIsVideoError(true)
  }

  return (
    <div className="relative">
      {/* Sticky Banner with smaller logo */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      {/* CURRENT LANDING STRUCTURE - Keep as-is at top of homepage */}
      <section ref={heroSectionRef} className="relative h-screen w-screen overflow-hidden bg-black">
        {/* Fallback background while video loads or if video fails */}
        {(!videoLoaded || isVideoError) && (
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
            {isVideoError && <p className="text-white/50 text-sm">Video loading failed. Please check the video URL.</p>}
          </div>
        )}

        {/* Background Video with optimized loading */}
        {videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* ETERNO Logo - now smaller */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <EternoLogo width={LOGO_SIZE} inverted={true} />
        </div>

        {/* Register Button - using the interactive component */}
        <InteractiveButtonArea className="absolute inset-0 flex items-center justify-center z-10">
          <SlidingButton onClick={handleRegisterClick} duration={1000}>
            REGISTER INTEREST
          </SlidingButton>
        </InteractiveButtonArea>

        {/* Scroll down indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer animate-bounce"
          onClick={handleScrollDown}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Rest of the page content remains unchanged */}
      <div ref={contentRef}>{/* Content sections remain the same */}</div>
    </div>
  )
}
