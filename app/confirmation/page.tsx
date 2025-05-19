"use client"

import { useState, useEffect, useRef } from "react"
import EternoLogo from "@/components/eterno-logo"
import MobileMenu from "@/components/main-menu"

export default function ConfirmationPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoAttempts, setVideoAttempts] = useState(0)
  const [fallbackActive, setFallbackActive] = useState(false)

  // Define logo size to match sticky banner
  const LOGO_SIZE = "45mm"

  // Properly formatted video URL - ensuring there are no typos or extra spaces
  const videoUrl =
    "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

  // Function to force video playback with multiple fallback strategies
  const forceVideoPlay = () => {
    if (!videoRef.current) return

    const video = videoRef.current

    // Set all possible attributes to optimize loading and playback
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.preload = "auto"
    video.currentTime = 0

    // Try to play with catch for browser restrictions
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Video play failed:", error)

        // Increment attempts counter
        setVideoAttempts((prev) => prev + 1)

        // If we've tried 3 times and failed, activate fallback
        if (videoAttempts >= 2) {
          setFallbackActive(true)
        } else {
          // Try again with a slight delay
          setTimeout(forceVideoPlay, 100)
        }
      })
    }
  }

  // Preload the video as soon as possible
  useEffect(() => {
    // Create a new video element to preload the video
    const preloadVideo = new Audio(videoUrl)
    preloadVideo.muted = true
    preloadVideo.preload = "auto"

    // Start loading the video immediately
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

      // Force play with multiple attempts
      forceVideoPlay()

      // Backup attempts with increasing delays
      setTimeout(forceVideoPlay, 50)
      setTimeout(forceVideoPlay, 200)
      setTimeout(forceVideoPlay, 500)
    }

    setIsLoaded(true)

    // Staggered animation for text
    const messageTimer = setTimeout(() => setShowMessage(true), 300)

    return () => {
      clearTimeout(messageTimer)
      preloadVideo.pause()
      preloadVideo.src = ""
    }
  }, [])

  // Add event listeners for user interaction to help with autoplay restrictions
  useEffect(() => {
    const playOnUserInteraction = () => {
      forceVideoPlay()
    }

    // Add multiple event listeners to catch any user interaction
    document.addEventListener("click", playOnUserInteraction, { once: true })
    document.addEventListener("touchstart", playOnUserInteraction, { once: true })
    document.addEventListener("keydown", playOnUserInteraction, { once: true })
    document.addEventListener("scroll", playOnUserInteraction, { once: true })

    return () => {
      document.removeEventListener("click", playOnUserInteraction)
      document.removeEventListener("touchstart", playOnUserInteraction)
      document.removeEventListener("keydown", playOnUserInteraction)
      document.removeEventListener("scroll", playOnUserInteraction)
    }
  }, [])

  // Monitor video state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      console.log("Video can play now")
      forceVideoPlay()
    }

    const handleLoadedData = () => {
      console.log("Video data loaded")
      forceVideoPlay()
    }

    const handlePlaying = () => {
      console.log("Video is playing")
    }

    const handleError = (e: Event) => {
      console.error("Video error:", e)
      setFallbackActive(true)
    }

    // Add all possible event listeners to catch any loading state
    video.addEventListener("loadedmetadata", forceVideoPlay)
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("canplaythrough", forceVideoPlay)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadedmetadata", forceVideoPlay)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("canplaythrough", forceVideoPlay)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("error", handleError)
    }
  }, [])

  // Create a poster image URL for immediate visual feedback
  const posterUrl = "/yacht-images/yacht-image-1.png"

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white overflow-hidden">
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Background video - optimized implementation */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Fallback image that shows immediately while video loads */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${videoRef.current?.playing ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url(${posterUrl})`, filter: "brightness(0.5)" }}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
          poster={posterUrl}
          preload="auto"
          style={{ objectFit: "cover" }}
        >
          <source src={videoUrl} type="video/mp4" />
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
