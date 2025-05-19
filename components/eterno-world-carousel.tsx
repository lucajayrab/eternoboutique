"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Only include the actual images that exist
const images = [
  {
    src: "/yacht-images/yacht-image-1.png",
    alt: "Relaxing on yacht deck",
  },
  {
    src: "/yacht-images/mediterranean-statue-view.jpeg",
    alt: "Man in navy linen shirt by statue overlooking Mediterranean",
  },
  {
    src: "/yacht-images/yacht-image-2.png",
    alt: "Dining on yacht with city view",
  },
  {
    src: "/yacht-images/terrace-sea-view.jpeg",
    alt: "Relaxing on Mediterranean terrace with sea view",
  },
  {
    src: "/yacht-images/yacht-image-3.png",
    alt: "Taking photos on a boat",
  },
  {
    src: "/yacht-images/beach-club-linen.jpeg",
    alt: "Man in white linen at luxury beach club",
  },
]

export default function EternoWorldCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const visibleImages = isMobile ? 1 : 3

  // Calculate the maximum valid index
  const maxIndex = Math.max(0, images.length - visibleImages)

  // Ensure we only show actual images (no blank tiles)
  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      // If we're at the end, loop back to the beginning
      if (prev >= maxIndex) {
        return 0
      }
      return prev + 1
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      // If we're at the beginning, loop to the end
      if (prev <= 0) {
        return maxIndex
      }
      return prev - 1
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }

    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 4000) // Slightly faster rotation for more dynamic feel

    return () => clearInterval(interval)
  }, [currentIndex, isAnimating])

  // Calculate the number of indicators needed
  const indicatorCount = maxIndex + 1

  return (
    <section className="w-full bg-[#f9f8f5] overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4 md:px-8">
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
          {/* Carousel Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 sm:p-2 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#5a5a56]" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 sm:p-2 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#5a5a56]" />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="overflow-hidden h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleImages)}%)`,
                width: `${(images.length / visibleImages) * 100}%`,
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-full"
                  style={{ width: `${(100 / images.length) * visibleImages}%` }}
                >
                  <div className="h-full aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators - Simplified for mobile */}
          <div className="flex justify-center mt-2 sm:mt-4 space-x-1 sm:space-x-2 absolute bottom-1 sm:bottom-2 left-0 right-0">
            {Array.from({ length: indicatorCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return
                  setIsAnimating(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsAnimating(false), 500)
                }}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#5a5a56] w-3 sm:w-4" : "bg-[#5a5a56]/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
