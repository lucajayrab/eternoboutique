"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import FromTheYarnSection from "@/components/from-the-yarn-section"
import EternoManifestoSection from "@/components/eterno-manifesto-section"
import SlidingButton from "@/components/sliding-button"
import NavigationMenu from "@/components/navigation-menu"
import MinimalistFooter from "@/components/minimalist-footer"

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
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false)
  const [userHasInteracted, setUserHasInteracted] = useState(false)
  const [showRegisterButton, setShowRegisterButton] = useState(false)

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

  // Show register button after video loads with delay
  useEffect(() => {
    if (isVideoLoaded) {
      const timer = setTimeout(() => {
        setShowRegisterButton(true)
      }, 2000) // 2 second delay after video loads
      return () => clearTimeout(timer)
    }
  }, [isVideoLoaded])

  // Track user interactions to prevent auto-scroll if user is actively engaging
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserHasInteracted(true)
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setUserHasInteracted(true)
      }
    }

    // Track various user interactions
    const events = ["click", "touchstart", "keydown", "wheel"]
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { passive: true })
    })

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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

  // Auto-scroll functionality when video loop completes
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isVideoLoaded || hasAutoScrolled || userHasInteracted) return

    const handleTimeUpdate = () => {
      // Check if we're approaching the end of the video (within 2 seconds)
      if (video.duration && video.currentTime >= video.duration - 2) {
        // Only auto-scroll if user hasn't interacted and we haven't auto-scrolled yet
        if (!userHasInteracted && !hasAutoScrolled) {
          setHasAutoScrolled(true)
          // Add a small delay to make the transition feel natural
          setTimeout(() => {
            handleScrollDown()
          }, 200)
        }
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [isVideoLoaded, hasAutoScrolled, userHasInteracted])

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
    setUserHasInteracted(true) // Mark as interacted when scroll is triggered

    setTimeout(() => {
      setIsArrowClicked(false)
    }, 300)

    if (!aboutSectionRef.current) return

    // For mobile, position the sticky banner just above the "CRAFTED IN ITALY" title
    if (isMobile) {
      // Find the "CRAFTED IN ITALY" title element
      const craftedTitle = document.querySelector("#from-the-yarn h2")

      if (craftedTitle) {
        // Get the position of the title relative to the document
        const titleRect = craftedTitle.getBoundingClientRect()
        const titlePosition = titleRect.top + window.pageYOffset

        // Position so the bottom of the sticky banner (70px height) sits just above the title
        const stickyHeaderHeight = 70
        const targetScrollPosition = titlePosition - stickyHeaderHeight

        window.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        })
      } else {
        // Fallback if title not found - scroll to approximate position
        const heroHeight = window.innerHeight
        const stickyHeaderHeight = 70
        const approximateOffset = 50 // Small buffer for section padding

        window.scrollTo({
          top: heroHeight + approximateOffset - stickyHeaderHeight,
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

        {/* Register Interest Button - Fade in over video */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000 ${
            showRegisterButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center">
            <SlidingButton
              onClick={() => router.push("/register")}
              variant="light"
              duration={1000}
              className="px-8 py-4 text-sm"
            >
              REGISTER INTEREST
            </SlidingButton>
          </div>
        </div>

        {/* Down Arrow Button - Higher position on mobile with black arrow */}
        <div className={`absolute ${isMobile ? "bottom-20" : "bottom-8"} left-1/2 transform -translate-x-1/2 z-30`}>
          <button
            onClick={handleScrollDown}
            className={`arrow-container ${isArrowClicked ? "arrow-clicked" : ""} p-4 hover:bg-black/10 rounded-full transition-all duration-300`}
            aria-label="Scroll down to content"
          >
            <svg
              className="arrow-icon w-6 h-6 text-white"
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

      {/* Content Sections - Alternating Colors Pattern */}
      <div className="bg-white">
        <section className="w-full py-12 sm:py-16 md:py-20" id="exclusive-access">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4">
                  Exclusive Early Access
                </h2>
                <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-2xl mx-auto mb-8">
                  Register your interest for exclusive access to our early public sale of the Black & White monochrome
                  linen set collection. Selected individuals will be invited to an exclusive European event.
                </p>
              </div>

              <SlidingButton
                onClick={() => router.push("/register")}
                variant="dark"
                duration={1000}
                className="px-8 py-4 text-sm"
              >
                REGISTER INTEREST
              </SlidingButton>
            </div>
          </div>
        </section>
      </div>

      <div ref={aboutSectionRef} className="bg-eterno-cream">
        <FromTheYarnSection />
      </div>

      <div className="bg-white">
        <EternoManifestoSection />
      </div>

      <div className="bg-eterno-cream">
        <section className="w-full py-12 sm:py-16 md:py-20" id="shop-now">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4">
                  Private Boutique
                </h2>
                <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-2xl mx-auto mb-8">
                  Access our exclusive collection of handcrafted linen pieces. An intimate preview of our finest work,
                  available only to our inner circle.
                </p>
              </div>

              <SlidingButton
                onClick={() => router.push("/shop")}
                variant="dark"
                duration={1000}
                className="px-8 py-4 text-sm"
              >
                ENTER BOUTIQUE
              </SlidingButton>
            </div>
          </div>
        </section>
      </div>

      <MinimalistFooter />
    </div>
  )
}
