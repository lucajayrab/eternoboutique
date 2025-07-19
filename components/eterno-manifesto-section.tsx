"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

export default function EternoManifestoSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Check if device is mobile
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Initialize mobile detection
  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [checkMobile])

  // Handle image error
  const handleImageError = () => {
    console.error("Failed to load manifesto image")
    // You could set a state to show a fallback image here
  }

  return (
    <section className="w-full bg-transparent" id="manifesto">
      <div className="w-full">
        <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-0 min-h-[400px] md:min-h-[600px]">
          {/* Image Section - Left on desktop, top on mobile */}
          <div className="w-full md:w-1/2 flex items-center py-4 md:py-16 px-4 sm:px-8 md:px-16 lg:px-20 mb-0 md:mb-0">
            <div className="w-full aspect-[4/3] md:h-full bg-[#f5f5f3] flex items-center justify-center overflow-hidden relative">
              {/* Using next/image for better performance and error handling */}
              <div className="relative w-full h-full">
                <Image
                  src="/vintage-party-celebration.jpeg"
                  alt="Vintage photo of people celebrating and dancing at a summer party"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f3]">
                    <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Section - Right on desktop, bottom on mobile */}
          <div className="w-full md:w-1/2 px-6 sm:px-8 md:px-16 lg:px-20 flex flex-col justify-center py-8 md:py-16">
            {/* Mobile-optimized content container */}
            <div className={`max-w-[550px] ${isMobile ? "mx-auto" : ""}`}>
              {/* Section heading */}
              <div className={`mb-6 md:mb-8 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-[#5a5a56] font-normal text-sm sm:text-base uppercase tracking-wider">
                  OUR PHILOSOPHY
                </p>
              </div>

              {/* Manifesto text */}
              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm space-y-4 ${
                  isMobile ? "text-center" : "text-left"
                }`}
              >
                <div className="space-y-2">
                  <p>Eterno was born from a simple idea:</p>
                  <p>The best clothes become part of your story.</p>
                </div>

                <div className="space-y-2">
                  <p>Linen worn through long lunches on the coast.</p>
                  <p>Not made to be seen—made to be lived in.</p>
                </div>

                <div className="space-y-2">
                  <p>Handcrafted in Italy. Inspired by endless summers.</p>
                  <p>Eterno is dressing with intention.</p>
                </div>

                <div className="space-y-2">
                  <p>Because the best things aren't rushed—</p>
                  <p>they're chosen, worn, remembered.</p>
                </div>

                <div className="space-y-2">
                  <p>For those who don't speak loudly—</p>
                  <p>because the linen already does.</p>
                </div>
              </div>

              {/* Made in Italy tag */}
              <p
                className={`font-mulish text-xs uppercase tracking-widest font-light text-[#5a5a56] mt-8 ${
                  isMobile ? "text-center" : "text-left"
                }`}
              >
                Made in Italy
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
