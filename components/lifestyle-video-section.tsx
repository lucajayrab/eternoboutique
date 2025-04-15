"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function LifestyleVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Updated video URL with the provided BLOB API link
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
  }, [])

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error("Error playing video:", error)
          })
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsLoaded(true)
  }

  return (
    <section ref={sectionRef} className="w-full bg-black relative">
      {/* Video container */}
      <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
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
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="text-white" size={20} /> : <Play className="text-white" size={20} />}
          </button>

          {/* Mute/Unmute button */}
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="text-white" size={20} /> : <Volume2 className="text-white" size={20} />}
          </button>
        </div>
      </div>
    </section>
  )
}
