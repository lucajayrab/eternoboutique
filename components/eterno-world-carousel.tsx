"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  {
    src: "/mediterranean-villa-sunset.png",
    alt: "Mediterranean Villa at Sunset",
  },
  {
    src: "/man-linen-yacht.png",
    alt: "Linen Style on a Yacht",
  },
  {
    src: "/amalfi-coast-town.png",
    alt: "Italian Coastal Town",
  },
  {
    src: "/luxury-mediterranean-evening.png",
    alt: "Mediterranean Evening Dining",
  },
  {
    src: "/placeholder.svg?height=600&width=800&query=linen%20fabric%20close%20up%20natural%20texture",
    alt: "Linen Fabric Texture",
  },
  {
    src: "/placeholder.svg?height=600&width=800&query=tailoring%20workshop%20artisan%20detail",
    alt: "Tailoring Craftsmanship",
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
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isAnimating])

  return (
    <section className="w-full bg-[#f5f4f1] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8">
        <h2 className="font-mulish text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56] text-center mb-12">
          The ETERNO World
        </h2>

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
          <div className="flex justify-center mt-6 space-x-2">
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
