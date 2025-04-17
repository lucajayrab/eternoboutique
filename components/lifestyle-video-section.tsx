"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function LifestyleVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // The video URL as provided by the user
  const videoUrl =
    "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/520905_Vacation_Hotels_Bay_Ships_By_Cinematic_Vision_Artlist_HD-wWcGxA8CvSFjpibyIPjxhGY5nlOHoQ.mp4"

  // Set up Intersection Observer to detect when the section is in view
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Auto-play video when it comes into view
            if (videoRef.current && isLoaded && !isError) {
              videoRef.current
                .play()
                .then(() => {
                  setIsPlaying(true)
                  console.log("Video playing automatically when in view")
                })
                .catch((err) => {
                  console.error("Could not autoplay video:", err)
                })
            }
          } else {
            setIsInView(false)
            // Pause video when out of view
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause()
              setIsPlaying(false)
            }
          }
        })
      },
      { threshold: 0.3 },
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isLoaded, isError])

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
            console.log("Video playing (manual)")
          })
          .catch((error) => {
            console.error("Error playing video:", error)
          })
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
        console.log("Video paused")
      }
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
      console.log("Video muted state:", videoRef.current.muted)
    }
  }

  // Handle video loaded
  const handleVideoLoaded = () => {
    console.log("Video loaded successfully from URL:", videoUrl)
    setIsLoaded(true)
    setIsError(false)

    // Try to play the video if it's in view
    if (isInView && videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.error("Could not autoplay video after loading:", err)
        })
    }
  }

  // Handle video error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget
    console.error("Error loading video:", videoElement.error)
    console.error("Video URL that failed:", videoUrl)
    setIsError(true)
    setIsLoaded(false)
  }

  // Preload the video when the component mounts
  useEffect(() => {
    // Create a new Image to preload the video poster
    const posterImage = new Image()
    posterImage.src = "/placeholder.svg?height=1080&width=1920&text=ETERNO+Lifestyle"

    // Attempt to preload the video
    const preloadVideo = document.createElement("video")
    preloadVideo.src = videoUrl
    preloadVideo.preload = "auto"

    console.log("Attempting to preload video from URL:", videoUrl)

    return () => {
      // Clean up
      preloadVideo.src = ""
    }
  }, [videoUrl])

  return (
    <section ref={sectionRef} className="w-full bg-black relative">
      {/* Video container */}
      <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
        {/* Loading indicator */}
        {!isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error message */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white/70 text-center p-4">
              <p>Unable to load video.</p>
              <p className="text-sm mt-2">Please check the video URL and try again.</p>
              <button
                onClick={() => {
                  setIsError(false)
                  if (videoRef.current) {
                    videoRef.current.load() // Attempt to reload the video
                  }
                }}
                className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          playsInline
          loop
          muted={isMuted}
          poster="/placeholder.svg?height=1080&width=1920&text=ETERNO+Lifestyle"
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              isError ? "bg-white/10 cursor-not-allowed" : "bg-white/20 hover:bg-white/30"
            }`}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            disabled={isError}
          >
            {isPlaying ? <Pause className="text-white" size={20} /> : <Play className="text-white" size={20} />}
          </button>

          {/* Mute/Unmute button */}
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              isError ? "bg-white/10 cursor-not-allowed" : "bg-white/20 hover:bg-white/30"
            }`}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            disabled={isError}
          >
            {isMuted ? <VolumeX className="text-white" size={20} /> : <Volume2 className="text-white" size={20} />}
          </button>
        </div>
      </div>
    </section>
  )
}
