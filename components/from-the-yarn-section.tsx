"use client"

import { useRef, useEffect, useState } from "react"

export default function FromTheYarnSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setVideoLoaded(true)
    }

    const handleError = () => {
      console.error("Video failed to load")
      setIsVideoError(true)
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)

    // Attempt to load and play the video
    try {
      video.load()
    } catch (error) {
      console.error("Error loading video:", error)
      setIsVideoError(true)
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
    }
  }, [])

  return (
    <section className="w-full bg-[#f9f8f5] py-12 sm:py-16 md:py-28">
      <div className="w-full px-0">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content - Left side on desktop, top on mobile */}
          <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 px-8 sm:px-12 md:px-16 lg:px-20">
            <h2 className="font-mulish text-lg sm:text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56]">
              From the Yarn
            </h2>
            <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-[600px]">
              <p>
                Our journey begins with the finest flax fibers, cultivated in the nutrient-rich soils of Northern Italy.
                These exceptional raw materials are transformed into luxurious linen through a meticulous process that
                honors centuries-old traditions while embracing modern precision. Each thread is carefully spun to
                achieve the perfect balance of strength and softness, creating a fabric that breathes with the wearer
                and develops a unique character over time.
              </p>
            </div>
          </div>

          {/* Video Content - Right side on desktop, bottom on mobile */}
          <div className="w-full md:w-1/2 px-8 sm:px-12 md:px-16 lg:px-20">
            <div className="h-[250px] sm:h-[300px] md:h-[500px] relative overflow-hidden bg-[#e8e4d9]">
              {/* Fallback while video loads */}
              {(!videoLoaded || isVideoError) && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#e8e4d9]">
                  {isVideoError ? (
                    <p className="text-[#5a5a56]/50 text-xs sm:text-sm">Video preview unavailable</p>
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                  )}
                </div>
              )}

              {/* Linen Production Video */}
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <source
                  src="https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/linen-production-NJnQXXQXnXXXXXXXXXXXXXXXXXXXXXXX.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
