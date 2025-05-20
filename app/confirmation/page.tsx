"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import EternoLogo from "@/components/eterno-logo"
import MobileMenu from "@/components/main-menu"
import Head from "next/head"

// Constants
const LOGO_SIZE = "45mm"
const VIDEO_URL =
  "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_HD-K76mJKem8ZBUjscwppFegs0RJxNhwO.mp4"
const POSTER_URL = "/yacht-images/yacht-image-1.png"
const MAX_VIDEO_ATTEMPTS = 5

export default function ConfirmationPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [videoAttempts, setVideoAttempts] = useState(0)
  const [fallbackActive, setFallbackActive] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const preloadVideoRef = useRef<HTMLVideoElement | null>(null)
  const attemptTimersRef = useRef<NodeJS.Timeout[]>([])

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

    // Set playback rate slightly faster to ensure smooth playback
    video.playbackRate = 1.01

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
              const timer = setTimeout(forceVideoPlay, 100 * newCount)
              attemptTimersRef.current.push(timer)
            }
            return newCount
          })
        })
    }
  }, [])

  // Preload the video before component mounts
  useEffect(() => {
    // Create a link preload tag in the head
    const linkElement = document.createElement("link")
    linkElement.rel = "preload"
    linkElement.href = VIDEO_URL
    linkElement.as = "video"
    linkElement.type = "video/mp4"
    document.head.appendChild(linkElement)

    // Create a hidden video element to preload the video
    preloadVideoRef.current = document.createElement("video")
    const preloadVideo = preloadVideoRef.current
    preloadVideo.src = VIDEO_URL
    preloadVideo.muted = true
    preloadVideo.preload = "auto"
    preloadVideo.style.display = "none"
    preloadVideo.load()
    document.body.appendChild(preloadVideo)

    // Try to play the preload video to cache it
    const preloadPromise = preloadVideo.play()
    if (preloadPromise !== undefined) {
      preloadPromise.catch(() => {
        // Ignore errors, this is just for preloading
      })
    }

    return () => {
      // Clean up
      document.head.removeChild(linkElement)
      if (preloadVideoRef.current) {
        preloadVideoRef.current.pause()
        preloadVideoRef.current.src = ""
        document.body.removeChild(preloadVideoRef.current)
      }
    }
  }, [])

  // Initialize video playback as soon as possible
  useEffect(() => {
    // Try to play the actual video element as soon as component mounts
    if (videoRef.current) {
      // Set critical attributes
      const video = videoRef.current
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      video.preload = "auto"
      video.loop = true

      // Force load
      video.load()

      // Force play with multiple attempts at staggered intervals
      forceVideoPlay()

      // Schedule multiple attempts with increasing delays
      const timers = [
        setTimeout(forceVideoPlay, 50),
        setTimeout(forceVideoPlay, 100),
        setTimeout(forceVideoPlay, 200),
        setTimeout(forceVideoPlay, 500),
        setTimeout(forceVideoPlay, 1000),
      ]

      attemptTimersRef.current = timers
    }

    setIsLoaded(true)

    // Staggered animation for text
    const messageTimer = setTimeout(() => setShowMessage(true), 300)

    return () => {
      // Clean up all timers
      attemptTimersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [forceVideoPlay])

  // Add event listeners for user interaction to help with autoplay restrictions
  useEffect(() => {
    const playOnUserInteraction = () => {
      forceVideoPlay()
    }

    // Add multiple event listeners to catch any user interaction
    const events = ["click", "touchstart", "touchend", "touchmove", "keydown", "scroll", "mousemove"]
    events.forEach((event) => {
      document.addEventListener(event, playOnUserInteraction, { once: true })
    })

    // Also try to play on window focus and visibility change
    window.addEventListener("focus", playOnUserInteraction)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playOnUserInteraction()
      }
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, playOnUserInteraction)
      })
      window.removeEventListener("focus", playOnUserInteraction)
    }
  }, [forceVideoPlay])

  // Monitor video state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const videoEvents = {
      loadedmetadata: () => {
        console.log("Video metadata loaded")
        forceVideoPlay()
      },
      loadeddata: () => {
        console.log("Video data loaded")
        forceVideoPlay()
      },
      canplay: () => {
        console.log("Video can play")
        forceVideoPlay()
      },
      canplaythrough: () => {
        console.log("Video can play through")
        forceVideoPlay()
        setVideoPlaying(true)
      },
      playing: () => {
        console.log("Video is playing")
        setVideoPlaying(true)
      },
      pause: () => {
        console.log("Video paused")
        forceVideoPlay() // Try to resume if paused
      },
      error: (e: any) => {
        console.error("Video error:", e)
        setFallbackActive(true)
      },
      stalled: () => {
        console.log("Video stalled")
        forceVideoPlay()
      },
      waiting: () => {
        console.log("Video waiting")
        // Video is waiting for more data, try to play again
        setTimeout(forceVideoPlay, 100)
      },
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
    <>
      <Head>
        {/* Preload video in head */}
        <link rel="preload" href={VIDEO_URL} as="video" type="video/mp4" />
      </Head>

      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white overflow-hidden">
        {/* Mobile Menu */}
        <MobileMenu />

        {/* Background video - optimized implementation */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Fallback image that shows immediately while video loads */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${videoPlaying ? "opacity-0" : "opacity-100"}`}
            style={{ backgroundImage: `url(${POSTER_URL})`, filter: "brightness(0.5)" }}
          />

          {/* Hidden video preloader */}
          <video preload="auto" muted playsInline className="hidden" src={VIDEO_URL} />

          {/* Main video */}
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
            }}
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
    </>
  )
}
