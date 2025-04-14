"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import SlidingButton from "@/components/sliding-button"
import StickyBanner from "@/components/sticky-banner"
import TailoringSection from "@/components/tailoring-section"
import ImageCarouselSection from "@/components/image-carousel-section"
import ProcessSteps from "@/components/process-steps"
import MainMenu from "@/components/main-menu"

// Define a consistent logo size
const LOGO_SIZE = "45mm"

export default function Home() {
  const router = useRouter()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const tailoringSectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // State for button visibility
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

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

  // Mouse tracking for button visibility (desktop only)
  useEffect(() => {
    if (isMobile) {
      setIsButtonVisible(true) // Always show button on mobile
      return
    }

    const heroSection = heroSectionRef.current
    const buttonElement = buttonRef.current

    if (!heroSection || !buttonElement) return

    const handleMouseMove = (e: MouseEvent) => {
      // Get hero section dimensions and position
      const heroRect = heroSection.getBoundingClientRect()
      const buttonRect = buttonElement.getBoundingClientRect()

      // Calculate center of hero section
      const centerX = heroRect.left + heroRect.width / 2
      const centerY = heroRect.top + heroRect.height / 2

      // Calculate distance from mouse to center
      const mouseX = e.clientX
      const mouseY = e.clientY
      const distanceFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

      // Calculate radius threshold (30% of the smaller dimension)
      const radius = Math.min(heroRect.width, heroRect.height) * 0.3

      // Check if mouse is over button
      const isOverButton =
        mouseX >= buttonRect.left &&
        mouseX <= buttonRect.right &&
        mouseY >= buttonRect.top &&
        mouseY <= buttonRect.bottom

      // Show button if mouse is within radius or over button
      setIsButtonVisible(distanceFromCenter <= radius || isOverButton)
    }

    // Add mouse move listener
    window.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMobile])

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleScrollDown = () => {
    if (tailoringSectionRef.current) {
      tailoringSectionRef.current.scrollIntoView({ behavior: "smooth" })
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
      {/* Sticky Banner (visible on all devices) */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      {/* Main Menu (visible on all devices) */}
      <MainMenu />

      {/* CURRENT LANDING STRUCTURE - Keep as-is at top of homepage */}
      <section ref={heroSectionRef} className="relative h-screen w-screen overflow-hidden bg-black pt-[70px]" id="home">
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

        {/* Register Button - now with conditional visibility on desktop, always visible on mobile */}
        <div
          ref={buttonRef}
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 ${
            isButtonVisible || isMobile ? "opacity-100" : "opacity-0"
          }`}
        >
          <SlidingButton
            onClick={handleRegisterClick}
            duration={1000}
            variant="light"
            className="min-w-[200px] py-4 text-base"
          >
            REGISTER INTEREST
          </SlidingButton>
        </div>

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

      {/* TAILORING SECTION */}
      <div ref={tailoringSectionRef} id="tailoring">
        <TailoringSection />
      </div>

      {/* IMAGE CAROUSEL SECTION */}
      <div id="collection">
        <ImageCarouselSection />
      </div>

      {/* PROCESS STEPS SECTION */}
      <div id="process">
        <ProcessSteps />
      </div>

      {/* FINAL CTA SECTION - updated background color */}
      <div ref={contentRef}>
        {/* Slimmer Register Interest CTA */}
        <section className="py-12 md:py-16 bg-[#eae8e3]">
          <div className="container mx-auto px-8 text-center">
            <div
              className="max-w-2xl mx-auto space-y-4 opacity-0 animate-[fadeIn_1s_ease-in-out_forwards]"
              style={{ animationDelay: "0.3s" }}
            >
              <div>
                <SlidingButton
                  onClick={handleRegisterClick}
                  variant="dark"
                  duration={1000}
                  className="min-w-[200px] py-4 text-base"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>
              <p className="text-sm font-mulish text-[#5a5a56]/60 mt-4">
                Be the first to access our bespoke pieces, private fittings, and upcoming events.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
