"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import EternoLogo from "@/components/eterno-logo"
import MobileMenu from "@/components/main-menu"

// Constants
const LOGO_SIZE = "45mm"
const VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"
const POSTER_URL = "/yacht-images/yacht-image-1.png"
const MAX_VIDEO_ATTEMPTS = 3

export default function ConfirmationPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [videoAttempts, setVideoAttempts] = useState(0)
  const [fallbackActive, setFallbackActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Function to force video playback with multiple fallback strategies
  const forceVideoPlay = useCallback(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    // Set all possible attributes to optimize loading and playback
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.preload = "auto"

    // Try to play with catch for browser restrictions
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Increment attempts counter
        setVideoAttempts((prev) => {
          const newCount = prev + 1
          // If we've tried enough times and failed, activate fallback
          if (newCount >= MAX_VIDEO_ATTEMPTS) {
            setFallbackActive(true)
          } else {
            // Try again with a slight delay
            setTimeout(forceVideoPlay, 100)
          }
          return newCount
        })
      })
    }
  }, [])

  // Preload the video as soon as possible
  useEffect(() => {
    // Create a new video element to preload the video
    const preloadVideo = new Audio(VIDEO_URL)
    preloadVideo.muted = true
    preloadVideo.preload = "auto"
    preloadVideo.load()

    // Try to play the actual video element as soon as component mounts
    if (videoRef.current) {
      // Set critical attributes
      const video = videoRef.current
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      video.preload = "auto"

      // Force load
      video.load()

      // Force play with multiple attempts at staggered intervals
      forceVideoPlay()
      const timers = [setTimeout(forceVideoPlay, 50), setTimeout(forceVideoPlay, 200), setTimeout(forceVideoPlay, 500)]
    }

    setIsLoaded(true)

    // Staggered animation for text
    const messageTimer = setTimeout(() => setShowMessage(true), 300)

    return () => {
      clearTimeout(messageTimer)
      preloadVideo.pause()
      preloadVideo.src = ""
    }
  }, [forceVideoPlay])

  // Add event listeners for user interaction to help with autoplay restrictions
  useEffect(() => {
    const playOnUserInteraction = () => {
      forceVideoPlay()
    }

    // Add multiple event listeners to catch any user interaction
    const events = ["click", "touchstart", "keydown", "scroll"]
    events.forEach((event) => {
      document.addEventListener(event, playOnUserInteraction, { once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, playOnUserInteraction)
      })
    }
  }, [forceVideoPlay])

  // Monitor video state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const videoEvents = {
      loadedmetadata: forceVideoPlay,
      loadeddata: forceVideoPlay,
      canplay: forceVideoPlay,
      canplaythrough: forceVideoPlay,
      playing: () => console.log("Video is playing"),
      error: () => setFallbackActive(true),
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
  }, [forceVideoPlay])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white overflow-hidden">
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Background video - optimized implementation */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Fallback image that shows immediately while video loads */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${videoRef.current?.playing ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url(${POSTER_URL})`, filter: "brightness(0.5)" }}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
          poster={POSTER_URL}
          preload="auto"
          style={{ objectFit: "cover" }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
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

        <p
          className={`font-mulish text-white text-base font-light leading-relaxed tracking-wide transition-all duration-500 ease-out ${
            showMessage ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          }`}
        >
          We'll be in touch when the time is right
        </p>
      </div>
    </main>
  )
}
