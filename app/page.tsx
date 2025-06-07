"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import FromTheYarnSection from "@/components/from-the-yarn-section"
import BoutiqueTailoringSection from "@/components/boutique-tailoring-section"
import EternoManifestoSection from "@/components/eterno-manifesto-section"
import OurCollectionSection from "@/components/our-collection-section"
import SlidingButton from "@/components/sliding-button"
import DesktopNavigation from "@/components/desktop-navigation"
import NavigationMenu from "@/components/navigation-menu"
import InteractiveButtonArea from "@/components/interactive-button-area"
import ProcessSteps from "@/components/process-steps"
import EternoWorldCarousel from "@/components/eterno-world-carousel"
import { useVideoBackground } from "@/hooks/use-video-background"

// Define a consistent logo size
const LOGO_SIZE = "45mm"

// Default fallback video URL
const FALLBACK_VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

export default function HomePage() {
  const router = useRouter()
  const { videoUrl, isLoading } = useVideoBackground()
  const [isMounted, setIsMounted] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isArrowClicked, setIsArrowClicked] = useState(false)
  const [hasTouched, setHasTouched] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
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

    // Play on user interaction
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

  const handleScrollDown = useCallback(() => {
    setIsArrowClicked(true)

    setTimeout(() => {
      setIsArrowClicked(false)
    }, 300)

    if (!aboutSectionRef.current) return

    if (isMobile) {
      // For mobile, use the exact same positioning as the menu navigation
      // to ensure consistent behavior
      const stickyHeaderHeight = 70 // Height of sticky banner
      const targetPosition = aboutSectionRef.current.getBoundingClientRect().top + window.pageYOffset

      // Use the same offset as the "From The Yarn" section in the menu navigation
      // This ensures the sticky banner is positioned at the top of the section content
      const scrollOffset = stickyHeaderHeight

      // Scroll to position with proper offset
      window.scrollTo({
        top: targetPosition - scrollOffset,
        behavior: "smooth",
      })
    } else {
      // Desktop behavior remains unchanged
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isMobile])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Sticky Banner (visible on all devices) */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      {/* Mobile Menu (only visible on mobile) */}
      <MobileMenu />

      {/* Desktop Navigation (only visible on desktop) */}
      <DesktopNavigation />

      {/* Navigation Menu */}
      <NavigationMenu logoWidth="45mm" />

      {/* HERO SECTION - Video Background */}
      <section ref={heroSectionRef} className="relative h-screen w-screen overflow-hidden bg-black pt-[70px]" id="home">
        {/* Fallback background while video loads or if video fails */}
        {(isLoading || !videoUrl) && (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero.jpg')", filter: "brightness(0.8)" }}
          >
            {isVideoError && <p className="text-white/50 text-sm">Video loading failed. Please check the video URL.</p>}
          </div>
        )}

        {/* Background Video with optimized loading */}
        {!isLoading && videoUrl && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 opacity-100"
            style={{ objectFit: "cover", filter: "brightness(0.8)" }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Interactive Button Area */}
        <InteractiveButtonArea />
      </section>

      {/* ROW 1: FROM THE YARN SECTION - Added extra padding with matching background */}
      <div ref={aboutSectionRef} className="md:pt-0 pt-6 bg-[#f9f8f5]">
        <FromTheYarnSection />
      </div>

      {/* ROW 2: OUR COLLECTION SECTION - Added extra padding with matching background */}
      <div className="md:pt-0 pt-6 bg-[#eeeeec]">
        <OurCollectionSection />
      </div>

      {/* ROW 2.5: SHOP NOW SECTION - Replaces Style Combinations */}
      <div className="md:pt-0 pt-6 bg-[#eeeeec]">
        <section className="w-full bg-[#eeeeec] py-12 sm:py-16 md:py-20" id="shop-now">
          <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 max-w-7xl">
            <div className="text-center">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-2">COMPLETE THE LOOK</p>
                <h2 className="font-mulish text-lg sm:text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56] mb-4">
                  Explore Our Collection
                </h2>
                <p className="font-mulish font-light text-[#5a5a56]/80 text-xs sm:text-sm max-w-2xl mx-auto mb-8">
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

      {/* ROW 3: BOUTIQUE LINEN TAILORING - Added extra padding with matching background */}
      <div className="md:pt-0 pt-6 bg-[#f9f8f5]">
        <BoutiqueTailoringSection />
      </div>

      {/* ROW 4: ETERNO MANIFESTO - Added extra padding with matching background */}
      <div className="md:pt-0 pt-6 bg-[#eeeeec]">
        <EternoManifestoSection />
      </div>

      {/* ROW 5: PROCESS STEPS */}
      <div className="md:pt-0 pt-6 bg-[#f9f8f5]">
        <ProcessSteps />
      </div>

      {/* ROW 6: ETERNO WORLD CAROUSEL */}
      <div className="md:pt-0 pt-6 bg-[#eeeeec]">
        <EternoWorldCarousel />
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
