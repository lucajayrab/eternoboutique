"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// New yacht lifestyle images
const images = [
  {
    src: "/yacht-images/yacht-image-1.png",
    alt: "Relaxing on yacht deck",
  },
  {
    src: "/yacht-images/yacht-image-2.png",
    alt: "Dining on yacht with city view",
  },
  {
    src: "/yacht-images/yacht-image-3.png",
    alt: "Taking photos on a boat",
  },
  {
    src: "/yacht-images/yacht-image-4.png",
    alt: "Climbing aboard yacht",
  },
  {
    src: "/yacht-images/yacht-image-5.png",
    alt: "Luxury yacht with sports car",
  },
  {
    src: "/yacht-images/yacht-image-6.png",
    alt: "Wooden speedboat on blue water",
  },
  {
    src: "/yacht-images/yacht-image-7.png",
    alt: "Couple on yacht with mountain view",
  },
  {
    src: "/yacht-images/yacht-image-8.png",
    alt: "Man in white linen enjoying sunset on yacht",
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
  const maxIndex = images.length - visibleImages

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
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

  return (
    <section className="w-full bg-[#f9f8f5] py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8">
        <div className="relative">
          {/* Carousel Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-[#5a5a56]" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="text-[#5a5a56]" />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleImages)}%)`,
                width: `${(images.length / visibleImages) * 100}%`,
              }}
            >
              {images.map((image, index) => (
                <div key={index} className="relative" style={{ width: `${(100 / images.length) * visibleImages}%` }}>
                  <div className="aspect-[4/3] m-2 overflow-hidden">
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return
                  setIsAnimating(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsAnimating(false), 500)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#5a5a56] w-4" : "bg-[#5a5a56]/30"
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
