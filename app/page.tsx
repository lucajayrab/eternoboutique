"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import SlidingButton from "@/components/sliding-button"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import FromTheYarnSection from "@/components/from-the-yarn-section"
import BoutiqueTailoringSection from "@/components/boutique-tailoring-section"
import EternoManifestoSection from "@/components/eterno-manifesto-section"
import OurCollectionSection from "@/components/our-collection-section"

// Define a consistent logo size
const LOGO_SIZE = "45mm"

// Default fallback video URL
const FALLBACK_VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

export default function Home() {
  const router = useRouter()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isArrowClicked, setIsArrowClicked] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [hasTouched, setHasTouched] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check if device is mobile - memoized for performance
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Initialize mobile detection
  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [checkMobile])

  // Get the video URL from environment variable
  useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_VIDEO_URL

    if (envUrl) {
      setVideoUrl(envUrl)
    } else {
      setVideoUrl(FALLBACK_VIDEO_URL)
    }
  }, [])

  // Mouse tracking for button visibility (desktop only)
  useEffect(() => {
    if (isMobile) {
      setIsButtonVisible(true)
      return
    }

    const heroSection = heroSectionRef.current
    const buttonElement = buttonRef.current

    if (!heroSection || !buttonElement) return

    const handleMouseMove = (e: MouseEvent) => {
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

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  // Force video play on mobile devices and track touch for button visibility
  useEffect(() => {
    if (!isMobile) return

    // Function to attempt playing the video
    const attemptPlay = () => {
      const videoElements = document.querySelectorAll("video")
      videoElements.forEach((video) => {
        video.muted = true
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silent catch - we have multiple fallbacks
          })
        }
      })
    }

    // Try to play immediately
    attemptPlay()

    // Play on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptPlay()
      }
    }

    // Play on user interaction and show button
    const playOnInteraction = () => {
      attemptPlay()
      setHasTouched(true) // Set touch state to true when user interacts
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("touchstart", playOnInteraction)
    document.addEventListener("touchend", playOnInteraction)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("touchstart", playOnInteraction)
      document.removeEventListener("touchend", playOnInteraction)
    }
  }, [isMobile])

  // Navigation handlers
  const handleRegisterClick = useCallback(() => {
    router.push("/register")
  }, [router])

  const handleScrollDown = useCallback(() => {
    setIsArrowClicked(true)

    setTimeout(() => {
      setIsArrowClicked(false)
    }, 300)

    if (!aboutSectionRef.current) return

    if (isMobile) {
      // For mobile, calculate the exact position that ensures content isn't covered
      const stickyHeaderHeight = 70 // Height of sticky banner
      const extraPadding = 24 // The pt-6 we added (1.5rem = 24px)
      const targetPosition = aboutSectionRef.current.getBoundingClientRect().top + window.pageYOffset

      // Scroll to position with proper offset
      window.scrollTo({
        top: targetPosition - stickyHeaderHeight,
        behavior: "smooth",
      })
    } else {
      // Desktop behavior remains unchanged
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isMobile])

  // Video event handlers
  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true)
  }, [])

  const handleVideoError = useCallback(() => {
    setIsVideoError(true)
  }, [])

  return (
    <div className="relative">
      {/* Sticky Banner (visible on all devices) */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      {/* Mobile Menu (only visible on mobile) */}
      <MobileMenu />

      {/* HERO SECTION - Video Background */}
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
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            style={{ objectFit: "cover" }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Register Button - now with conditional visibility on desktop, always visible on mobile */}
        <div
          ref={buttonRef}
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 ${
            (isButtonVisible && !isMobile) || (isMobile && hasTouched && videoLoaded) ? "opacity-100" : "opacity-0"
          }`}
        >
          <SlidingButton
            onClick={handleRegisterClick}
            duration={1000}
            variant="light"
            className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] py-3 md:py-4 text-sm md:text-base"
          >
            REGISTER INTEREST
          </SlidingButton>
        </div>

        {/* Scroll down indicator - Now visible on both desktop and mobile with adjusted mobile position */}
        <div
          className={`absolute sm:bottom-6 bottom-10 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer arrow-container ${isArrowClicked ? "arrow-clicked" : ""}`}
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
            className="arrow-icon"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ROW 1: FROM THE YARN SECTION - Added extra padding with matching background */}
      <div ref={aboutSectionRef} className="md:pt-0 pt-6 bg-[#f9f8f5]">
        <FromTheYarnSection />
      </div>

      {/* ROW 2: OUR COLLECTION SECTION - Added extra padding with matching background */}
      <div className="md:pt-0 pt-6 bg-[#eeeeec]">
        <OurCollectionSection />
      </div>

      {/* ROW 3: BOUTIQUE LINEN TAILORING - Added extra padding with matching background */}
      <div className="md:pt-0 pt-6 bg-[#eeeeec]">
        <BoutiqueTailoringSection />
      </div>

      {/* ROW 4: ETERNO MANIFESTO - Added extra padding with matching background */}
      <div className="md:pt-0 pt-6 bg-[#f9f8f5]">
        <EternoManifestoSection />
      </div>

      {/* FINAL CTA SECTION - Added extra padding with matching background */}
      <div ref={contentRef} className="md:pt-0 pt-6 bg-eterno-sand">
        <section className="w-full py-6 md:py-8 bg-eterno-sand border-t border-[#e0ddd2]">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="max-w-xl mx-auto space-y-4 text-center">
              <h2 className="font-mulish text-base sm:text-lg font-light tracking-widest uppercase text-[#5a5a56]">
                Contact Eterno
              </h2>

              <div className="space-y-2">
                <a
                  href="mailto:enquiries@eternotailoring.com"
                  className="block text-sm sm:text-base font-mulish font-light text-[#5a5a56] hover:text-[#5a5a56]/80 transition-colors"
                >
                  enquiries@eternotailoring.com
                </a>

                <p className="text-xs sm:text-sm font-mulish text-[#5a5a56]/70">Clifford Street, London, W1S 4JY</p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#e0ddd2] text-[10px] text-[#5a5a56]/50 font-mulish">
                © {new Date().getFullYear()} ETERNO. All rights reserved.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
