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

// Video URLs - reverted to the original Croatia boat sailing video for both desktop and mobile
const DESKTOP_VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_HD-K76mJKem8ZBUjscwppFegs0RJxNhwO.mp4"
const MOBILE_VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_HD-K76mJKem8ZBUjscwppFegs0RJxNhwO.mp4"
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
  const [videoInitialized, setVideoInitialized] = useState(false)

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

  // Enhanced video loading and playback logic for mobile
  const attemptVideoPlay = useCallback(async () => {
    const video = videoRef.current
    if (!video || isVideoError || videoAttempts > 3 || videoInitialized) return

    try {
      // Set video properties for mobile optimization
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      video.loop = true
      video.preload = "metadata" // Changed from "auto" to reduce initial load

      // Mobile-specific attributes to prevent flashing
      if (isMobile) {
        video.setAttribute("playsinline", "")
        video.setAttribute("webkit-playsinline", "")
        video.setAttribute("x5-playsinline", "")
        video.setAttribute("x5-video-player-type", "h5")
        video.setAttribute("x5-video-player-fullscreen", "true")

        // Prevent video from showing controls or poster flashing
        video.controls = false
        video.poster = ""

        // Set initial opacity to prevent flash
        video.style.opacity = "0"
        video.style.transition = "opacity 0.5s ease-in-out"
      }

      // Load the appropriate video source
      const videoUrl = isMobile ? MOBILE_VIDEO_URL : DESKTOP_VIDEO_URL

      // Only set src if it's different to prevent reloading
      if (video.src !== videoUrl) {
        video.src = videoUrl
      }

      setVideoInitialized(true)

      // Load the video
      video.load()

      // Wait for the video to be ready before attempting to play
      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          video.removeEventListener("canplay", handleCanPlay)
          video.removeEventListener("error", handleError)
          resolve(true)
        }

        const handleError = (e: any) => {
          video.removeEventListener("canplay", handleCanPlay)
          video.removeEventListener("error", handleError)
          reject(e)
        }

        video.addEventListener("canplay", handleCanPlay, { once: true })
        video.addEventListener("error", handleError, { once: true })
      })

      // Attempt to play
      const playPromise = video.play()
      if (playPromise !== undefined) {
        await playPromise

        // Fade in the video smoothly on mobile
        if (isMobile) {
          video.style.opacity = "0.7" // Match the filter brightness
        }

        setIsVideoLoaded(true)
        setIsVideoError(false)
      }
    } catch (error) {
      console.warn("Video play attempt failed:", error)
      setVideoAttempts((prev) => prev + 1)

      // Retry with exponential backoff, but fewer attempts on mobile
      const maxAttempts = isMobile ? 2 : 3
      if (videoAttempts < maxAttempts) {
        setTimeout(attemptVideoPlay, 1000 * Math.pow(2, videoAttempts))
      } else {
        setIsVideoError(true)
        // On mobile, hide the video element to prevent flashing
        if (isMobile && video) {
          video.style.display = "none"
        }
      }
    }
  }, [isMobile, isVideoError, videoAttempts, videoInitialized])

  // Initialize video on mount with mobile-specific handling
  useEffect(() => {
    setIsMounted(true)

    // Longer delay for mobile to ensure DOM is fully ready
    const timer = setTimeout(
      () => {
        attemptVideoPlay()
      },
      isMobile ? 300 : 100,
    )

    return () => clearTimeout(timer)
  }, [attemptVideoPlay, isMobile])

  // Handle user interactions for mobile autoplay restrictions
  useEffect(() => {
    if (!isMobile || isVideoLoaded || videoInitialized) return

    const handleUserInteraction = () => {
      if (!videoInitialized) {
        attemptVideoPlay()
      }
    }

    // Add event listeners for user interaction
    const events = ["touchstart", "touchend", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [isMobile, isVideoLoaded, attemptVideoPlay, videoInitialized])

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

    // Ensure smooth fade-in on mobile
    if (isMobile && videoRef.current) {
      videoRef.current.style.opacity = "0.7"
    }
  }, [isMobile])

  const handleVideoError = useCallback(() => {
    console.error("Video failed to load")
    setIsVideoError(true)
    setIsVideoLoaded(false)

    // Hide video element on mobile to prevent flashing
    if (isMobile && videoRef.current) {
      videoRef.current.style.display = "none"
    }
  }, [isMobile])

  const handleScrollDown = useCallback(() => {
    setIsArrowClicked(true)
    setUserHasInteracted(true) // Mark as interacted when scroll is triggered

    setTimeout(() => {
      setIsArrowClicked(false)
    }, 300)

    if (!aboutSectionRef.current) return

    // For mobile, position the sticky banner just above the "CRAFTED IN ITALY" title
    if (isMobile) {
      // Find the "EXCLUSIVE EARLY ACCESS" title element
      const exclusiveTitle = document.querySelector("#exclusive-access h2")

      if (exclusiveTitle) {
        // Get the position of the title relative to the document
        const titleRect = exclusiveTitle.getBoundingClientRect()
        const titlePosition = titleRect.top + window.pageYOffset

        // Position so the bottom of the sticky banner (70px height) sits just above the title
        const stickyHeaderHeight = 70
        const targetScrollPosition = titlePosition - stickyHeaderHeight

        window.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        })
      } else {
        // Fallback if title not found - scroll to approximate position for exclusive access
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
        {/* Static background to prevent flashing */}
        <div className="absolute inset-0 bg-black z-5"></div>

        {/* Background Video - Enhanced mobile handling */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload={isMobile ? "metadata" : "auto"}
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{
            objectFit: "cover",
            filter: "brightness(0.7)",
            opacity: isMobile ? "0" : "0.7", // Start transparent on mobile
            transition: isMobile ? "opacity 0.5s ease-in-out" : "none",
          }}
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoLoaded}
          onError={handleVideoError}
          poster="" // Remove poster to prevent flashing
          controls={false}
        >
          <source src={isMobile ? MOBILE_VIDEO_URL : DESKTOP_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback background image for when video fails */}
        {isVideoError && (
          <div
            className="absolute inset-0 z-15 bg-cover bg-center"
            style={{
              backgroundImage: `url(${FALLBACK_IMAGE})`,
              filter: "brightness(0.7)",
            }}
          />
        )}

        {/* Loading state - only show on mobile if video hasn't loaded and no error */}
        {isMobile && !isVideoLoaded && !isVideoError && (
          <div className="absolute inset-0 z-20 bg-black flex items-center justify-center">
            <div className="text-white/70 text-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        )}

        {/* Register Interest Button - Fade in over video with consistent styling */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000 ${
            showRegisterButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center px-4">
            <SlidingButton
              onClick={() => router.push("/register")}
              variant="light"
              duration={1000}
              className="px-8 py-4 text-sm whitespace-nowrap min-w-max"
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
