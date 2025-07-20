"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import EternoLogo from "@/components/eterno-logo"
import MobileMenu from "@/components/main-menu"
import SlidingButton from "@/components/sliding-button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

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

  const forceVideoPlay = useCallback(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.preload = "auto"
    video.loop = true

    if (isMobile) {
      video.setAttribute("playsinline", "")
      video.setAttribute("webkit-playsinline", "")
      video.setAttribute("x5-playsinline", "")
      video.setAttribute("x5-video-player-type", "h5")
      video.setAttribute("x5-video-player-fullscreen", "true")
      video.currentTime = 0.1
    }

    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setVideoPlaying(true)
        })
        .catch((error) => {
          setVideoAttempts((prev) => {
            const newCount = prev + 1
            if (newCount >= MAX_VIDEO_ATTEMPTS) {
              setFallbackActive(true)
            } else {
              const timer = setTimeout(forceVideoPlay, 50 * newCount)
              attemptTimersRef.current.push(timer)
            }
            return newCount
          })
        })
    }
  }, [isMobile])

  const handleTouchStart = useCallback(() => {
    if (isMobile && videoRef.current) {
      forceVideoPlay()
    }
  }, [isMobile, forceVideoPlay])

  useEffect(() => {
    if (isMobile) {
      fetch(VIDEO_URL)
        .then((response) => response.blob())
        .then((blob) => {
          if (videoRef.current) {
            const blobUrl = URL.createObjectURL(blob)
            videoRef.current.src = blobUrl
            videoRef.current.load()
            forceVideoPlay()
            return () => URL.revokeObjectURL(blobUrl)
          }
        })
        .catch((err) => {
          if (videoRef.current) {
            videoRef.current.src = VIDEO_URL
            videoRef.current.load()
            forceVideoPlay()
          }
        })
    } else {
      if (videoRef.current) {
        videoRef.current.load()
        forceVideoPlay()
      }
    }

    const intervals = isMobile ? [10, 50, 100, 200, 300, 500, 1000, 1500, 2000, 3000] : [50, 200, 500]
    const timers = intervals.map((interval) => setTimeout(forceVideoPlay, interval))
    attemptTimersRef.current = timers

    setIsLoaded(true)
    const messageTimer = setTimeout(() => setShowMessage(true), 300)

    return () => {
      attemptTimersRef.current.forEach((timer) => clearTimeout(timer))
      clearTimeout(messageTimer)
    }
  }, [forceVideoPlay, isMobile])

  useEffect(() => {
    if (!isMobile) return

    const playOnUserInteraction = () => {
      forceVideoPlay()
    }

    const mobileEvents = ["touchstart", "touchend", "touchmove", "click", "scroll", "orientationchange"]

    mobileEvents.forEach((event) => {
      document.addEventListener(event, playOnUserInteraction, {
        passive: true,
        capture: true,
      })

      if (videoContainerRef.current) {
        videoContainerRef.current.addEventListener(event, playOnUserInteraction, {
          passive: true,
          capture: true,
        })
      }
    })

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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const videoEvents = {
      loadedmetadata: forceVideoPlay,
      loadeddata: forceVideoPlay,
      canplay: forceVideoPlay,
      canplaythrough: forceVideoPlay,
      playing: () => {
        setVideoPlaying(true)
      },
      pause: forceVideoPlay,
      error: (e: any) => {
        setFallbackActive(true)
      },
      stalled: forceVideoPlay,
      waiting: forceVideoPlay,
      ...(isMobile && {
        suspend: forceVideoPlay,
        abort: forceVideoPlay,
        emptied: forceVideoPlay,
        ratechange: () => {},
      }),
    }

    Object.entries(videoEvents).forEach(([event, handler]) => {
      video.addEventListener(event, handler as EventListener)
    })

    return () => {
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
      <MobileMenu />

      <div ref={videoContainerRef} className="absolute inset-0 z-0 bg-black" onTouchStart={handleTouchStart}>
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${videoPlaying ? "opacity-0" : "opacity-100"}`}
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
          style={{
            objectFit: "cover",
            transform: "translateZ(0)",
            willChange: "transform",
            width: "100%",
            height: "100%",
          }}
          x-webkit-airplay="allow"
          x5-video-orientation="portrait"
          controlsList="nodownload"
        >
          {!isMobile && <source src={VIDEO_URL} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>

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
