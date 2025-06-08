"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import FromTheYarnSection from "@/components/from-the-yarn-section"
import EternoManifestoSection from "@/components/eterno-manifesto-section"
import OurCollectionSection from "@/components/our-collection-section"
import SlidingButton from "@/components/sliding-button"
import NavigationMenu from "@/components/navigation-menu"

// Define a consistent logo size
const LOGO_SIZE = "45mm"

// Video URLs - using the new video for both desktop and mobile
const DESKTOP_VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/515853_Drone_Boat_Sea_Woman_By_Rassvet_Production_Artlist_HD-uyfJr0lWhMqJwG1BWUM1LdnraoMdxe.mov"
const MOBILE_VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/515853_Drone_Boat_Sea_Woman_By_Rassvet_Production_Artlist_HD-uyfJr0lWhMqJwG1BWUM1LdnraoMdxe.mov"
const FALLBACK_IMAGE = "/images/hero.jpg"

export default function HomePage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isArrowClicked, setIsArrowClicked] = useState(false)
  const [videoAttempts, setVideoAttempts] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check if device is mobile
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    return mobile
  }, [])

  // Initialize mobile detection
  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [checkMobile])

  // Video loading and playback logic
  const attemptVideoPlay = useCallback(async () => {
    const video = videoRef.current
    if (!video || isVideoError || videoAttempts > 3) return

    try {
      // Set video properties for mobile optimization
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      video.loop = true
      video.preload = "auto"

      // Mobile-specific attributes
      if (isMobile) {
        video.setAttribute("playsinline", "")
        video.setAttribute("webkit-playsinline", "")
        video.setAttribute("x5-playsinline", "")
      }

      // Load the appropriate video source immediately
      const videoUrl = isMobile ? MOBILE_VIDEO_URL : DESKTOP_VIDEO_URL
      video.src = videoUrl
      video.load()

      // Attempt to play immediately
      const playPromise = video.play()
      if (playPromise !== undefined) {
        await playPromise
        setIsVideoLoaded(true)
      }
    } catch (error) {
      console.warn("Video play attempt failed:", error)
      setVideoAttempts((prev) => prev + 1)

      // Retry with exponential backoff
      if (videoAttempts < 3) {
        setTimeout(attemptVideoPlay, 500 * Math.pow(2, videoAttempts))
      } else {
        setIsVideoError(true)
      }
    }
  }, [isMobile, isVideoError, videoAttempts])

  // Initialize video on mount
  useEffect(() => {
    setIsMounted(true)

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      attemptVideoPlay()
    }, 100)

    return () => clearTimeout(timer)
  }, [attemptVideoPlay])

  // Handle user interactions for mobile autoplay restrictions
  useEffect(() => {
    if (!isMobile || isVideoLoaded) return

    const handleUserInteraction = () => {
      attemptVideoPlay()
    }

    // Add event listeners for user interaction
    const events = ["touchstart", "touchend", "click", "scroll"]
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [isMobile, isVideoLoaded, attemptVideoPlay])

  // Video event handlers
  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true)
    setIsVideoError(false)
  }, [])

  const handleVideoError = useCallback(() => {
    console.error("Video failed to load")
    setIsVideoError(true)
    setIsVideoLoaded(false)
  }, [])

  const handleScrollDown = useCallback(() => {
    setIsArrowClicked(true)

    setTimeout(() => {
      setIsArrowClicked(false)
    }, 300)

    if (!aboutSectionRef.current) return

    // For mobile, ensure we scroll to the "From The Yarn" section with precise positioning
    if (isMobile) {
      const fromTheYarnSection = document.getElementById("from-the-yarn")
      if (fromTheYarnSection) {
        // Get the position of the section
        const sectionTop = fromTheYarnSection.getBoundingClientRect().top + window.pageYOffset

        // Calculate the sticky header height - ensure header is visible
        const stickyHeaderHeight = 70

        // Scroll to position the section header right below the navigation
        window.scrollTo({
          top: sectionTop - stickyHeaderHeight,
          behavior: "smooth",
        })
      }
    } else {
      // Desktop behavior - just enough to make the sticky banner colored
      const heroHeight = window.innerHeight
      const stickyBannerActivationPoint = heroHeight - 50

      window.scrollTo({
        top: stickyBannerActivationPoint,
        behavior: "smooth",
      })
    }
  }, [isMobile])

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navigation Menu */}
      <NavigationMenu logoWidth="45mm" />

      {/* HERO SECTION - Video Background */}
      <section ref={heroSectionRef} className="relative h-screen w-screen overflow-hidden bg-black" id="home">
        {/* Background Video - Always visible */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlaybook
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{ objectFit: "cover", filter: "brightness(0.7)" }}
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoLoaded}
          onError={handleVideoError}
        >
          <source src={isMobile ? MOBILE_VIDEO_URL : DESKTOP_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Only show loading on mobile if video hasn't loaded yet */}
        {isMobile && !isVideoLoaded && !isVideoError && (
          <div className="absolute inset-0 z-20 bg-black flex items-center justify-center">
            <div className="text-white/70 text-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        )}

        {/* Down Arrow Button - Higher position on mobile with black arrow */}
        <div className={`absolute ${isMobile ? "bottom-20" : "bottom-8"} left-1/2 transform -translate-x-1/2 z-30`}>
          <button
            onClick={handleScrollDown}
            className={`arrow-container ${isArrowClicked ? "arrow-clicked" : ""} p-4 hover:bg-black/10 rounded-full transition-all duration-300`}
            aria-label="Scroll down to content"
          >
            <svg
              className="arrow-icon w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Content Sections */}
      <div ref={aboutSectionRef} className="bg-[#f9f8f5]">
        <FromTheYarnSection />
      </div>

      <div className="bg-[#eeeeec]">
        <OurCollectionSection />
      </div>

      <div className="bg-[#eeeeec]">
        <section className="w-full bg-[#eeeeec] py-12 sm:py-16 md:py-20" id="shop-now">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4">
                  Explore Our Collection
                </h2>
                <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-2xl mx-auto mb-8">
                  Discover our curated selection of handcrafted linen pieces. Mix and match colors, add personal
                  touches, and create your perfect ensemble.
                </p>
              </div>

              <SlidingButton
                onClick={() => router.push("/shop")}
                variant="dark"
                duration={1000}
                className="px-8 py-4 text-sm"
              >
                SHOP NOW
              </SlidingButton>
            </div>
          </div>
        </section>
      </div>

      {/* Our Philosophy Section - Warm Cream Background */}
      <div className="bg-[#faf9f7]">
        <div className="[&>section]:!bg-[#faf9f7]">
          <EternoManifestoSection />
        </div>
      </div>

      {/* Footer */}
      <div ref={contentRef} className="bg-eterno-sand">
        <section className="w-full py-8 md:py-12 bg-eterno-sand border-t border-[#e0ddd2]">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <h2 className="font-mulish text-lg sm:text-xl font-light tracking-widest uppercase text-[#5a5a56]">
                Contact Eterno
              </h2>

              <div className="py-4 max-w-xs mx-auto">
                <SlidingButton
                  onClick={() => (window.location.href = "mailto:enquiries@eternotailoring.com")}
                  variant="dark"
                  duration={1000}
                  className="w-full py-4 text-sm"
                >
                  ENQUIRE
                </SlidingButton>
              </div>

              <div className="pt-4 mt-6 border-t border-[#e0ddd2] text-xs text-[#5a5a56]/50 font-mulish">
                © {new Date().getFullYear()} ETERNO. All rights reserved.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
