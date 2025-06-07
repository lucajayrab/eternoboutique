"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import EternoLogo from "@/components/eterno-logo"
import MobileMenu from "@/components/main-menu"
import SlidingButton from "@/components/sliding-button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

// Constants
const LOGO_SIZE = "45mm"
const VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_HD-K76mJKem8ZBUjscwppFegs0RJxNhwO.mp4"
const POSTER_URL = "/yacht-images/yacht-image-1.png"
const MAX_VIDEO_ATTEMPTS = 10

export default function ConfirmationPage() {
  const isMobile = useIsMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [videoAttempts, setVideoAttempts] = useState(0)
  const [fallbackActive, setFallbackActive] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  const videoRef = useRef<HTMLVideoElement>(null)
  const attemptTimersRef = useRef<NodeJS.Timeout[]>([])
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Function to force video playback with multiple fallback strategies
  const forceVideoPlay = useCallback(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    // Set all possible attributes to optimize loading and playback
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.preload = "auto"
    video.loop = true

    // Mobile-specific optimizations
    if (isMobile) {
      // Lower resolution for faster loading on mobile
      video.setAttribute("playsinline", "")
      video.setAttribute("webkit-playsinline", "")
      video.setAttribute("x5-playsinline", "")
      video.setAttribute("x5-video-player-type", "h5")
      video.setAttribute("x5-video-player-fullscreen", "true")

      // Force low quality on mobile for faster start
      video.currentTime = 0.1 // Skip to slightly after the beginning to force load
    }

    // Try to play with catch for browser restrictions
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setVideoPlaying(true)
          console.log("Video playing successfully")
        })
        .catch((error) => {
          console.log("Video play failed:", error)
          // Increment attempts counter
          setVideoAttempts((prev) => {
            const newCount = prev + 1
            // If we've tried enough times and failed, activate fallback
            if (newCount >= MAX_VIDEO_ATTEMPTS) {
              setFallbackActive(true)
            } else {
              // Try again with a slight delay
              const timer = setTimeout(forceVideoPlay, 50 * newCount)
              attemptTimersRef.current.push(timer)
            }
            return newCount
          })
        })
    }
  }, [isMobile])

  // Mobile-specific touch handler to force play
  const handleTouchStart = useCallback(() => {
    if (isMobile && videoRef.current) {
      forceVideoPlay()
    }
  }, [isMobile, forceVideoPlay])

  // Initialize video playback as soon as possible
  useEffect(() => {
    // For mobile, we'll create a blob URL to improve loading speed
    if (isMobile) {
      // Fetch the video as a blob for faster mobile loading
      fetch(VIDEO_URL)
        .then((response) => response.blob())
        .then((blob) => {
          if (videoRef.current) {
            // Create a local blob URL for faster access
            const blobUrl = URL.createObjectURL(blob)
            videoRef.current.src = blobUrl

            // Force load and play
            videoRef.current.load()
            forceVideoPlay()

            // Clean up function to revoke the blob URL
            return () => URL.revokeObjectURL(blobUrl)
          }
        })
        .catch((err) => {
          console.error("Failed to fetch video as blob:", err)
          // Fallback to direct URL
          if (videoRef.current) {
            videoRef.current.src = VIDEO_URL
            videoRef.current.load()
            forceVideoPlay()
          }
        })
    } else {
      // Desktop behavior
      if (videoRef.current) {
        videoRef.current.load()
        forceVideoPlay()
      }
    }

    // Force play with multiple attempts at staggered intervals
    // More aggressive for mobile
    const intervals = isMobile ? [10, 50, 100, 200, 300, 500, 1000, 1500, 2000, 3000] : [50, 200, 500]

    const timers = intervals.map((interval) => setTimeout(forceVideoPlay, interval))

    attemptTimersRef.current = timers

    setIsLoaded(true)

    // Staggered animation for text
    const messageTimer = setTimeout(() => setShowMessage(true), 300)

    return () => {
      // Clean up all timers
      attemptTimersRef.current.forEach((timer) => clearTimeout(timer))
      clearTimeout(messageTimer)
    }
  }, [forceVideoPlay, isMobile])

  // Add event listeners for user interaction to help with autoplay restrictions
  useEffect(() => {
    if (!isMobile) return // Only needed for mobile

    // For mobile, we need to be more aggressive with event listeners
    const playOnUserInteraction = () => {
      forceVideoPlay()
    }

    // Add multiple event listeners to catch any user interaction
    // Mobile-specific events
    const mobileEvents = ["touchstart", "touchend", "touchmove", "click", "scroll", "orientationchange"]

    mobileEvents.forEach((event) => {
      document.addEventListener(event, playOnUserInteraction, {
        passive: true, // Improve scroll performance
        capture: true, // Capture in the capture phase
      })

      // Also add to the video container specifically
      if (videoContainerRef.current) {
        videoContainerRef.current.addEventListener(event, playOnUserInteraction, {
          passive: true,
          capture: true,
        })
      }
    })

    // Also try to play on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playOnUserInteraction()
      }
    })

    return () => {
      mobileEvents.forEach((event) => {
        document.removeEventListener(event, playOnUserInteraction)
        if (videoContainerRef.current) {
          videoContainerRef.current.removeEventListener(event, playOnUserInteraction)
        }
      })
    }
  }, [forceVideoPlay, isMobile])

  // Monitor video state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // More aggressive for mobile
    const videoEvents = {
      loadedmetadata: forceVideoPlay,
      loadeddata: forceVideoPlay,
      canplay: forceVideoPlay,
      canplaythrough: forceVideoPlay,
      playing: () => {
        console.log("Video is playing")
        setVideoPlaying(true)
      },
      pause: forceVideoPlay, // Try to resume if paused
      error: (e: any) => {
        console.error("Video error:", e)
        setFallbackActive(true)
      },
      stalled: forceVideoPlay,
      waiting: forceVideoPlay,
      // Mobile-specific events
      ...(isMobile && {
        suspend: forceVideoPlay,
        abort: forceVideoPlay,
        emptied: forceVideoPlay,
        ratechange: () => console.log("Rate changed"),
      }),
    }

    // Add all event listeners
    Object.entries(videoEvents).forEach(([event, handler]) => {
      video.addEventListener(event, handler as EventListener)
    })

    return () => {
      // Clean up all event listeners
      if (video) {
        Object.entries(videoEvents).forEach(([event, handler]) => {
          video.removeEventListener(event, handler as EventListener)
        })
      }
    }
  }, [forceVideoPlay, isMobile])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      onTouchStart={handleTouchStart}
    >
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Background video - optimized implementation */}
      <div ref={videoContainerRef} className="absolute inset-0 z-0 bg-black" onTouchStart={handleTouchStart}>
        {/* Fallback image that shows immediately while video loads */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${videoPlaying ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url(${POSTER_URL})`, filter: "brightness(0.5)" }}
        />

        {/* Main video with mobile optimizations */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
          poster={POSTER_URL}
          preload="auto"
          style={{
            objectFit: "cover",
            transform: "translateZ(0)", // Hardware acceleration
            willChange: "transform", // Hint for browser optimization
            width: "100%",
            height: "100%",
          }}
          // Mobile-specific attributes
          x-webkit-airplay="allow"
          x5-video-orientation="portrait"
          controlsList="nodownload"
        >
          {!isMobile && <source src={VIDEO_URL} type="video/mp4" />}
          {/* No source for mobile - we'll set it dynamically */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-md text-center">
        <div className={`transition-all duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <EternoLogo width={LOGO_SIZE} inverted={true} className="mx-auto mb-8" />
        </div>

        <div className="pt-[70px]">
          <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] uppercase text-[#5a5a56]">Thank You</h1>
                <p className="text-lg md:text-xl font-light text-[#5a5a56]/80 leading-relaxed">
                  Your enquiry has been successfully submitted. We will be in touch with you shortly to discuss your
                  bespoke tailoring requirements.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-sm font-light text-[#5a5a56]/60">
                  Redirecting to homepage in {countdown} seconds...
                </p>

                <SlidingButton
                  onClick={() => router.push("/")}
                  variant="dark"
                  duration={800}
                  className="px-8 py-3 text-sm font-light tracking-wider"
                >
                  Return to Homepage
                </SlidingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
