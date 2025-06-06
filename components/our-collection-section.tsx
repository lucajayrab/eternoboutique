"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Color swatches data
const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5" },
  { name: "Black", color: "#2a2a33" },
  { name: "Navy", color: "#2d2a3e" },
  { name: "Sky Blue", color: "#c9d7e8" },
  { name: "Pink", color: "#e7d0d3" },
  { name: "Sage", color: "#9ca594" },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png" },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png" },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png" },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png" },
]

export default function OurCollectionSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [shirtImageLoaded, setShirtImageLoaded] = useState(false)
  const [trouserImageLoaded, setTrouserImageLoaded] = useState(false)
  const [currentTrouserIndex, setCurrentTrouserIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

  // Handle trouser navigation
  const navigateTrouser = (direction: "next" | "prev") => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setTrouserImageLoaded(false)

    const totalTrousers = TROUSER_COLORS.length

    if (direction === "next") {
      setCurrentTrouserIndex((prev) => (prev + 1) % totalTrousers)
    } else {
      setCurrentTrouserIndex((prev) => (prev - 1 + totalTrousers) % totalTrousers)
    }

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  // Render a color swatch
  const renderSwatch = (swatch: { name: string; color: string }, index: number) => (
    <div key={index} className="flex flex-col items-center">
      <div
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#ddd]"
        style={{ backgroundColor: swatch.color }}
      ></div>
      <span className="text-[10px] sm:text-xs mt-1">{swatch.name}</span>
    </div>
  )

  // Handle image loading errors
  const handleImageError = (imageType: string) => {
    console.error(`Failed to load ${imageType} image`)
    // You could set a state to show a fallback image here
  }

  return (
    <>
      {/* SHIRT Row - Lighter background spanning full width */}
      <section className="w-full bg-[#eeeeec]" id="collection">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-0 md:gap-0 min-h-[400px] md:min-h-[600px]">
            {/* Image Section - Left */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-4 md:py-16 px-8 sm:px-12 md:px-16 lg:px-20">
              <div className="w-full h-full bg-[#eeeeec] flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                {/* Using next/image for better performance and error handling */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                  <Image
                    src="/white-linen-shirt-new.png"
                    alt="ETERNO White Linen Shirt"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    onLoad={() => setShirtImageLoaded(true)}
                    onError={() => handleImageError("shirt")}
                    priority
                  />
                  {!shirtImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#eeeeec]">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Section - Right */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-8 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-center py-4 md:py-16 items-start pt-8 md:pt-4 mt-0 md:mt-0">
              <div className={`space-y-1 ${isMobile ? "text-center w-full" : "text-left"}`}>
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">SIGNATURE PIECE</p>
                <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base uppercase tracking-wider">SHIRT</h3>
              </div>

              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-[550px] ${isMobile ? "text-center mx-auto" : "text-left"}`}
              >
                <p>
                  Our signature shirt captures the spirit of Southern Italy through thoughtful tailoring and refined
                  detail. The clean, single-placket front flows into the soft roll of the paramontura collar, echoed by
                  curved cuffs fastened with genuine mother-of-pearl buttons. Hand-finished edges and perfect
                  buttonholes complete each piece.
                </p>
              </div>

              {/* Colorways */}
              <div className={`mt-4 md:mt-6 max-w-[550px] w-full ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-xs text-[#5a5a56] mb-2 sm:mb-3">Available to view in 6 colorways:</p>
                <div className={`flex flex-wrap gap-3 sm:gap-4 ${isMobile ? "justify-center" : "justify-start"}`}>
                  {SHIRT_COLORS.map(renderSwatch)}
                </div>

                {/* Price */}
                <p className="text-sm text-[#5a5a56] font-medium mt-4">£350</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TROUSER Row - Darker background spanning full width */}
      <section className="w-full bg-[#f9f8f5]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row-reverse gap-0 md:gap-0 min-h-[400px] md:min-h-[600px]">
            {/* Image Section - Right */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-4 md:py-16 px-8 sm:px-12 md:px-16 lg:px-20">
              <div className="w-full h-full bg-[#f9f8f5] flex items-center justify-center min-h-[400px] md:min-h-[500px] relative">
                {/* Navigation arrows */}
                <button
                  onClick={() => navigateTrouser("prev")}
                  className="absolute left-4 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20"
                  aria-label="Previous trouser color"
                >
                  <ChevronLeft className="w-5 h-5 text-[#5a5a56]" />
                </button>

                <button
                  onClick={() => navigateTrouser("next")}
                  className="absolute right-4 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20"
                  aria-label="Next trouser color"
                >
                  <ChevronRight className="w-5 h-5 text-[#5a5a56]" />
                </button>

                {/* Using next/image for better performance and error handling */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                  <div
                    className={`transition-opacity duration-300 ${trouserImageLoaded ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image
                      src={TROUSER_COLORS[currentTrouserIndex].image || "/placeholder.svg"}
                      alt={`ETERNO ${TROUSER_COLORS[currentTrouserIndex].name} Linen Trousers`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "contain", objectPosition: "center" }}
                      onLoad={() => setTrouserImageLoaded(true)}
                      onError={() => handleImageError("trouser")}
                      priority
                    />
                  </div>
                  {!trouserImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#f9f8f5]">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Section - Left */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-8 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-center py-4 md:py-16 pt-8 md:pt-4 mt-0 md:mt-0">
              <div className={`space-y-1 ${isMobile ? "text-center w-full" : "text-center md:text-left"}`}>
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">SIGNATURE PIECE</p>
                <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base uppercase tracking-wider">TROUSER</h3>
              </div>

              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-[550px] ${isMobile ? "text-center mx-auto" : ""}`}
              >
                <p>
                  Our pleated linen trousers are a quiet study in refinement. A single forward pleat introduces movement
                  through the front, while the waistband combines a clean, classic front with discrete elastic at the
                  back for added comfort. A single jetted pocket and classic-finished hem maintain the streamlined
                  silhouette. Woven from the finest Italian linen and tailored in Italy.
                </p>
              </div>

              {/* Colorways with active indicator */}
              <div className={`mt-4 md:mt-6 max-w-[550px] ${isMobile ? "text-center mx-auto" : ""}`}>
                <p className="text-xs text-[#5a5a56] mb-2 sm:mb-3">Available to view in 4 colorways:</p>
                <div
                  className={`flex flex-wrap gap-3 sm:gap-4 ${isMobile ? "justify-center" : "justify-center md:justify-start"}`}
                >
                  {TROUSER_COLORS.map((swatch, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border cursor-pointer transition-all duration-200 ${index === currentTrouserIndex ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20" : "border-[#ddd] hover:border-[#5a5a56]/50"}`}
                        style={{ backgroundColor: swatch.color }}
                        onClick={() => {
                          if (!isTransitioning) {
                            setIsTransitioning(true)
                            setTrouserImageLoaded(false)
                            setCurrentTrouserIndex(index)
                            setTimeout(() => setIsTransitioning(false), 300)
                          }
                        }}
                      ></div>
                      <span className="text-[10px] sm:text-xs mt-1">{swatch.name}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <p className="text-sm text-[#5a5a56] font-medium mt-4 text-center md:text-left">£350</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
