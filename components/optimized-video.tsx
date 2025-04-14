"use client"

import { useState, useEffect } from "react"

interface OptimizedVideoProps {
  src: string
  poster?: string
  className?: string
  priority?: boolean
}

export default function OptimizedVideo({ src, poster, className = "", priority = false }: OptimizedVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if IntersectionObserver is available
    if ("IntersectionObserver" in window && !priority) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.1 },
      )

      const videoElement = document.getElementById("optimized-video")
      if (videoElement) {
        observer.observe(videoElement)
      }

      return () => {
        if (videoElement) {
          observer.unobserve(videoElement)
        }
      }
    } else {
      // If IntersectionObserver is not available or priority is true, load immediately
      setIsVisible(true)
    }
  }, [priority])

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  return (
    <div className={`video-container ${className}`}>
      {(isVisible || priority) && (
        <video
          id="optimized-video"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          onLoadedData={handleLoadedData}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {!isLoaded && poster && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${poster})` }} />
      )}
    </div>
  )
}
