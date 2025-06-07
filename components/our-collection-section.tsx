"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Updated SHIRT_COLORS with new image paths
const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/images/shirts/new-white-linen-shirt.png" },
  { name: "Black", color: "#2a2a33", image: "/images/shirts/new-black-linen-shirt.png" },
  { name: "Navy", color: "#2d2a3e", image: "/images/shirts/new-navy-linen-shirt.png" },
  { name: "Sky Blue", color: "#c9d7e8", image: "/images/shirts/new-sky-blue-linen-shirt.png" },
  { name: "Pink", color: "#e7d0d3", image: "/images/shirts/new-pink-linen-shirt.png" },
  { name: "Sage", color: "#9ca594", image: "/images/shirts/new-sage-linen-shirt.png" },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png" },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png" },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png" },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png" },
]

const SHIRT_PRICE = 325
const TROUSER_PRICE = 325

export default function OurCollectionSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [shirtImageLoaded, setShirtImageLoaded] = useState(false)
  const [trouserImageLoaded, setTrouserImageLoaded] = useState(false)
  const [currentShirtIndex, setCurrentShirtIndex] = useState(0)
  const [currentTrouserIndex, setCurrentTrouserIndex] = useState(0)
  const [isShirtTransitioning, setIsShirtTransitioning] = useState(false)
  const [isTrouserTransitioning, setIsTrouserTransitioning] = useState(false)
  const [shirtImageError, setShirtImageError] = useState(false)
  const [trouserImageError, setTrouserImageError] = useState(false)

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [checkMobile])

  useEffect(() => {
    setShirtImageLoaded(false)
    setShirtImageError(false)
  }, [currentShirtIndex])

  useEffect(() => {
    setTrouserImageLoaded(false)
    setTrouserImageError(false)
  }, [currentTrouserIndex])

  const navigateShirt = (direction: "next" | "prev") => {
    if (isShirtTransitioning) return
    setIsShirtTransitioning(true)
    setShirtImageLoaded(false)
    setShirtImageError(false)
    const totalShirts = SHIRT_COLORS.length
    setCurrentShirtIndex((prev) =>
      direction === "next" ? (prev + 1) % totalShirts : (prev - 1 + totalShirts) % totalShirts,
    )
    setTimeout(() => setIsShirtTransitioning(false), 300)
  }

  const navigateTrouser = (direction: "next" | "prev") => {
    if (isTrouserTransitioning) return
    setIsTrouserTransitioning(true)
    setTrouserImageLoaded(false)
    setTrouserImageError(false)
    const totalTrousers = TROUSER_COLORS.length
    setCurrentTrouserIndex((prev) =>
      direction === "next" ? (prev + 1) % totalTrousers : (prev - 1 + totalTrousers) % totalTrousers,
    )
    setTimeout(() => setIsTrouserTransitioning(false), 300)
  }

  const handleShirtImageError = () => {
    console.warn(`Failed to load shirt image: ${SHIRT_COLORS[currentShirtIndex].image}`)
    setShirtImageError(true)
    setShirtImageLoaded(true)
  }

  const handleTrouserImageError = () => {
    console.warn(`Failed to load trouser image: ${TROUSER_COLORS[currentTrouserIndex].image}`)
    setTrouserImageError(true)
    setTrouserImageLoaded(true)
  }

  return (
    <>
      {/* Shirt Section */}
      <section className="w-full bg-[#eeeeec]" id="collection">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-0 min-h-[500px] md:min-h-[600px]">
            {/* Image Container - Mobile optimized */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-6 md:py-16 px-4 sm:px-6 md:px-16 lg:px-20">
              <div className="w-full h-full bg-[#eeeeec] flex items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[500px] relative">
                <button
                  onClick={() => navigateShirt("prev")}
                  className="absolute left-2 md:left-4 z-10 rounded-full p-2 md:p-3 bg-white/80 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20 touch-manipulation"
                  aria-label="Previous shirt color"
                  style={{ touchAction: "manipulation" }}
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#5a5a56]" />
                </button>
                <button
                  onClick={() => navigateShirt("next")}
                  className="absolute right-2 md:right-4 z-10 rounded-full p-2 md:p-3 bg-white/80 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20 touch-manipulation"
                  aria-label="Next shirt color"
                  style={{ touchAction: "manipulation" }}
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#5a5a56]" />
                </button>

                <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                  {!shirtImageError && (
                    <div
                      className={`transition-opacity duration-300 ${shirtImageLoaded ? "opacity-100" : "opacity-0"}`}
                    >
                      <Image
                        src={SHIRT_COLORS[currentShirtIndex].image || "/placeholder.svg"}
                        alt={`ETERNO ${SHIRT_COLORS[currentShirtIndex].name} Linen Shirt`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
                        style={{ objectFit: "contain", objectPosition: "center" }}
                        onLoad={() => setShirtImageLoaded(true)}
                        onError={handleShirtImageError}
                        priority
                      />
                    </div>
                  )}
                  {shirtImageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#eeeeec]">
                      <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#5a5a56]/10 rounded-full flex items-center justify-center mb-2">
                          <svg
                            className="w-6 h-6 md:w-8 md:h-8 text-[#5a5a56]/50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-[#5a5a56]/70">{SHIRT_COLORS[currentShirtIndex].name} Shirt</p>
                      </div>
                    </div>
                  )}
                  {!shirtImageLoaded && !shirtImageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#eeeeec]">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content - Mobile optimized */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-4 sm:px-6 md:px-16 lg:px-20 flex flex-col justify-center py-6 md:py-16">
              <div className={`space-y-2 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">SIGNATURE PIECE</p>
                <h3 className="text-[#5a5a56] font-normal text-base sm:text-lg md:text-xl uppercase tracking-wider">
                  SHIRT
                </h3>
              </div>

              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm sm:text-base max-w-[550px] ${isMobile ? "text-center mx-auto" : "text-left"}`}
              >
                <p>
                  Our signature shirt captures the spirit of Southern Italy through thoughtful tailoring and refined
                  detail. The clean, single-placket front flows into the soft roll of the paramontura collar, echoed by
                  curved cuffs fastened with genuine mother-of-pearl buttons.
                </p>
              </div>

              <div className={`mt-4 md:mt-6 max-w-[550px] w-full ${isMobile ? "text-center mx-auto" : "text-left"}`}>
                <p className="text-sm text-[#5a5a56] mb-3 sm:mb-4">Available in 6 colorways:</p>
                <div className={`flex flex-wrap gap-3 sm:gap-4 ${isMobile ? "justify-center" : "justify-start"}`}>
                  {SHIRT_COLORS.map((swatch, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <button
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border cursor-pointer transition-all duration-200 touch-manipulation ${
                          index === currentShirtIndex
                            ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20 scale-110"
                            : "border-[#ddd] hover:border-[#5a5a56]/50"
                        }`}
                        style={{ backgroundColor: swatch.color, touchAction: "manipulation" }}
                        onClick={() => {
                          if (!isShirtTransitioning) {
                            setIsShirtTransitioning(true)
                            setShirtImageLoaded(false)
                            setShirtImageError(false)
                            setCurrentShirtIndex(index)
                            setTimeout(() => setIsShirtTransitioning(false), 300)
                          }
                        }}
                        aria-label={`Select ${swatch.name} shirt`}
                      />
                      <span className="text-xs sm:text-sm mt-1 text-[#5a5a56]">{swatch.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#5a5a56] font-medium mt-4">£{SHIRT_PRICE}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trouser Section */}
      <section className="w-full bg-[#f9f8f5]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row-reverse gap-0 min-h-[500px] md:min-h-[600px]">
            {/* Image Container - Mobile optimized */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-6 md:py-16 px-4 sm:px-6 md:px-16 lg:px-20">
              <div className="w-full h-full bg-[#f9f8f5] flex items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[500px] relative">
                <button
                  onClick={() => navigateTrouser("prev")}
                  className="absolute left-2 md:left-4 z-10 rounded-full p-2 md:p-3 bg-white/80 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20 touch-manipulation"
                  aria-label="Previous trouser color"
                  style={{ touchAction: "manipulation" }}
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#5a5a56]" />
                </button>
                <button
                  onClick={() => navigateTrouser("next")}
                  className="absolute right-2 md:right-4 z-10 rounded-full p-2 md:p-3 bg-white/80 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20 touch-manipulation"
                  aria-label="Next trouser color"
                  style={{ touchAction: "manipulation" }}
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#5a5a56]" />
                </button>

                <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                  {!trouserImageError && (
                    <div
                      className={`transition-opacity duration-300 ${trouserImageLoaded ? "opacity-100" : "opacity-0"}`}
                    >
                      <Image
                        src={TROUSER_COLORS[currentTrouserIndex].image || "/placeholder.svg"}
                        alt={`ETERNO ${TROUSER_COLORS[currentTrouserIndex].name} Linen Trousers`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
                        style={{ objectFit: "contain", objectPosition: "center" }}
                        onLoad={() => setTrouserImageLoaded(true)}
                        onError={handleTrouserImageError}
                        priority
                      />
                    </div>
                  )}
                  {trouserImageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#f9f8f5]">
                      <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#5a5a56]/10 rounded-full flex items-center justify-center mb-2">
                          <svg
                            className="w-6 h-6 md:w-8 md:h-8 text-[#5a5a56]/50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-[#5a5a56]/70">{TROUSER_COLORS[currentTrouserIndex].name} Trousers</p>
                      </div>
                    </div>
                  )}
                  {!trouserImageLoaded && !trouserImageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#f9f8f5]">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content - Mobile optimized */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-4 sm:px-6 md:px-16 lg:px-20 flex flex-col justify-center py-6 md:py-16">
              <div className={`space-y-2 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">SIGNATURE PIECE</p>
                <h3 className="text-[#5a5a56] font-normal text-base sm:text-lg md:text-xl uppercase tracking-wider">
                  TROUSER
                </h3>
              </div>

              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm sm:text-base max-w-[550px] ${isMobile ? "text-center mx-auto" : "text-left"}`}
              >
                <p>
                  Our pleated linen trousers are a quiet study in refinement. A single forward pleat introduces movement
                  through the front, while the waistband combines a clean, classic front with discrete elastic at the
                  back for added comfort.
                </p>
              </div>

              <div className={`mt-4 md:mt-6 max-w-[550px] ${isMobile ? "text-center mx-auto" : "text-left"}`}>
                <p className="text-sm text-[#5a5a56] mb-3 sm:mb-4">Available in 4 colorways:</p>
                <div className={`flex flex-wrap gap-3 sm:gap-4 ${isMobile ? "justify-center" : "justify-start"}`}>
                  {TROUSER_COLORS.map((swatch, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <button
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border cursor-pointer transition-all duration-200 touch-manipulation ${
                          index === currentTrouserIndex
                            ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20 scale-110"
                            : "border-[#ddd] hover:border-[#5a5a56]/50"
                        }`}
                        style={{ backgroundColor: swatch.color, touchAction: "manipulation" }}
                        onClick={() => {
                          if (!isTrouserTransitioning) {
                            setIsTrouserTransitioning(true)
                            setTrouserImageLoaded(false)
                            setTrouserImageError(false)
                            setCurrentTrouserIndex(index)
                            setTimeout(() => setIsTrouserTransitioning(false), 300)
                          }
                        }}
                        aria-label={`Select ${swatch.name} trousers`}
                      />
                      <span className="text-xs sm:text-sm mt-1 text-[#5a5a56]">{swatch.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#5a5a56] font-medium mt-4">£{TROUSER_PRICE}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
