"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Black & White Capsule Collection Images
const SHIRT_IMAGES = {
  white: "/white-linen-shirt-final.png",
  black: "/black-linen-shirt-final.png",
}

const TROUSER_IMAGES = {
  white: "/white-linen-trousers.png",
  black: "/black-linen-trousers-new.png", // Use the version that merges with background
}

export default function OurCollectionSection() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [selectedShirtColor, setSelectedShirtColor] = useState<"white" | "black">("white")
  const [selectedTrouserColor, setSelectedTrouserColor] = useState<"white" | "black">("white")
  const [shirtImageLoaded, setShirtImageLoaded] = useState(false)
  const [trouserImageLoaded, setTrouserImageLoaded] = useState(false)
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

  // Reset image loading states when color changes
  useEffect(() => {
    setShirtImageLoaded(false)
    setShirtImageError(false)
  }, [selectedShirtColor])

  useEffect(() => {
    setTrouserImageLoaded(false)
    setTrouserImageError(false)
  }, [selectedTrouserColor])

  const handleShirtImageError = () => {
    console.warn(`Failed to load shirt image: ${SHIRT_IMAGES[selectedShirtColor]}`)
    setShirtImageError(true)
  }

  const handleTrouserImageError = () => {
    console.warn(`Failed to load trouser image: ${TROUSER_IMAGES[selectedTrouserColor]}`)
    setTrouserImageError(true)
  }

  const handleShirtClick = () => {
    router.push(`/product/shirt/0`)
  }

  const handleTrouserClick = () => {
    router.push(`/product/trouser/0`)
  }

  const handleRegisterInterest = () => {
    router.push("/register")
  }

  return (
    <>
      {/* Shirt Section */}
      <section className="w-full bg-[#f9f8f5]" id="collection">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-0 min-h-[500px] md:min-h-[600px]">
            {/* Image Container - Mobile optimised with shadow */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-4 md:py-12 px-3 sm:px-4 md:px-16 lg:px-20">
              <div className="w-full h-full flex items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[500px] relative">
                <div
                  className="relative w-full h-[240px] sm:h-[280px] md:h-[450px] lg:h-[500px] cursor-pointer"
                  onClick={handleShirtClick}
                >
                  {!shirtImageError ? (
                    <div
                      className={`transition-opacity duration-300 w-full h-full ${shirtImageLoaded ? "opacity-100" : "opacity-0"}`}
                      style={{
                        filter:
                          "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.2)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15))",
                      }}
                    >
                      <Image
                        src={SHIRT_IMAGES[selectedShirtColor] || "/placeholder.svg"}
                        alt={`ETERNO ${selectedShirtColor === "white" ? "White" : "Black"} Linen Shirt - 2026 Capsule`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
                        style={{ objectFit: "contain", objectPosition: "center" }}
                        onLoad={() => {
                          console.log("Shirt image loaded successfully")
                          setShirtImageLoaded(true)
                        }}
                        onError={(e) => {
                          console.error("Shirt image failed to load:", e)
                          handleShirtImageError()
                        }}
                        priority
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#5a5a56]/10 flex items-center justify-center mb-2">
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
                        <p className="text-[10px] text-[#5a5a56]/70">
                          {selectedShirtColor === "white" ? "White" : "Black"} Shirt
                        </p>
                      </div>
                    </div>
                  )}

                  {!shirtImageLoaded && !shirtImageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content - Mobile optimised */}
            <div className="w-full md:w-1/2 space-y-3 md:space-y-4 px-3 sm:px-4 md:px-16 lg:px-20 flex flex-col justify-center py-4 md:py-12">
              <div className={`space-y-2 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-[10px] uppercase tracking-wider text-[#5a5a56]/70">2026 CAPSULE</p>
                <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider">
                  SIGNATURE SHIRT
                </h3>
              </div>

              {/* Color Selection */}
              <div className={`space-y-3 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-xs text-[#5a5a56]/70 uppercase tracking-wider">Select Colorway</p>
                <div className={`flex gap-3 ${isMobile ? "justify-center" : "justify-start"}`}>
                  <button
                    onClick={() => setSelectedShirtColor("white")}
                    className={`w-8 h-8 bg-white border-2 rounded-full transition-all duration-200 ${
                      selectedShirtColor === "white"
                        ? "border-[#5a5a56] shadow-md"
                        : "border-[#5a5a56]/30 hover:border-[#5a5a56]/50"
                    }`}
                    aria-label="Select white shirt"
                  />
                  <button
                    onClick={() => setSelectedShirtColor("black")}
                    className={`w-8 h-8 bg-black border-2 rounded-full transition-all duration-200 ${
                      selectedShirtColor === "black"
                        ? "border-[#5a5a56] shadow-md"
                        : "border-[#5a5a56]/30 hover:border-[#5a5a56]/50"
                    }`}
                    aria-label="Select black shirt"
                  />
                </div>
              </div>

              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-[550px] ${isMobile ? "text-center mx-auto" : "text-left"}`}
              >
                <p>
                  Our signature shirt reimagined in pure monochrome. The clean, single-placket front flows into the soft
                  roll of the paramontura collar, echoed by curved cuffs fastened with genuine mother-of-pearl buttons.
                  A study in timeless elegance.
                </p>
              </div>

              <div className={`mt-4 md:mt-6 max-w-[550px] w-full ${isMobile ? "text-center mx-auto" : "text-left"}`}>
                <p className="text-xs text-[#5a5a56]">Available in Black & White • Arriving 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trouser Section */}
      <section className="w-full bg-[#eeeeec]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row-reverse gap-0 min-h-[500px] md:min-h-[600px]">
            {/* Image Container - Mobile optimised with shadow */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-4 md:py-12 px-3 sm:px-4 md:px-16 lg:px-20">
              <div className="w-full h-full flex items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[500px] relative">
                <div
                  className="relative w-full h-[240px] sm:h-[280px] md:h-[450px] lg:h-[500px] cursor-pointer"
                  onClick={handleTrouserClick}
                >
                  {!trouserImageError ? (
                    <div
                      className={`transition-opacity duration-300 w-full h-full ${trouserImageLoaded ? "opacity-100" : "opacity-0"}`}
                      style={{
                        filter:
                          "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.2)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15))",
                      }}
                    >
                      <Image
                        src={TROUSER_IMAGES[selectedTrouserColor] || "/placeholder.svg"}
                        alt={`ETERNO ${selectedTrouserColor === "white" ? "White" : "Black"} Linen Trousers - 2026 Capsule`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
                        style={{ objectFit: "contain", objectPosition: "center" }}
                        onLoad={() => {
                          console.log("Trouser image loaded successfully")
                          setTrouserImageLoaded(true)
                        }}
                        onError={(e) => {
                          console.error("Trouser image failed to load:", e)
                          handleTrouserImageError()
                        }}
                        priority
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#5a5a56]/10 flex items-center justify-center mb-2">
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
                        <p className="text-[10px] text-[#5a5a56]/70">
                          {selectedTrouserColor === "white" ? "White" : "Black"} Trousers
                        </p>
                      </div>
                    </div>
                  )}

                  {!trouserImageLoaded && !trouserImageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content - Mobile optimised */}
            <div className="w-full md:w-1/2 space-y-3 md:space-y-4 px-3 sm:px-4 md:px-16 lg:px-20 flex flex-col justify-center py-4 md:py-12">
              <div className={`space-y-2 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-[10px] uppercase tracking-wider text-[#5a5a56]/70">2026 CAPSULE</p>
                <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider">
                  SIGNATURE TROUSER
                </h3>
              </div>

              {/* Color Selection */}
              <div className={`space-y-3 ${isMobile ? "text-center" : "text-left"}`}>
                <p className="text-xs text-[#5a5a56]/70 uppercase tracking-wider">Select Colorway</p>
                <div className={`flex gap-3 ${isMobile ? "justify-center" : "justify-start"}`}>
                  <button
                    onClick={() => setSelectedTrouserColor("white")}
                    className={`w-8 h-8 bg-white border-2 rounded-full transition-all duration-200 ${
                      selectedTrouserColor === "white"
                        ? "border-[#5a5a56] shadow-md"
                        : "border-[#5a5a56]/30 hover:border-[#5a5a56]/50"
                    }`}
                    aria-label="Select white trousers"
                  />
                  <button
                    onClick={() => setSelectedTrouserColor("black")}
                    className={`w-8 h-8 bg-black border-2 rounded-full transition-all duration-200 ${
                      selectedTrouserColor === "black"
                        ? "border-[#5a5a56] shadow-md"
                        : "border-[#5a5a56]/30 hover:border-[#5a5a56]/50"
                    }`}
                    aria-label="Select black trousers"
                  />
                </div>
              </div>

              <div
                className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-[550px] ${isMobile ? "text-center mx-auto" : "text-left"}`}
              >
                <p>
                  Our pleated linen trousers refined to their purest form. A single forward pleat introduces movement
                  through the front, while the waistband combines a clean, classic front with discrete elastic at the
                  back. Monochrome sophistication.
                </p>
              </div>

              <div className={`mt-4 md:mt-6 max-w-[550px] w-full ${isMobile ? "text-center mx-auto" : "text-left"}`}>
                <p className="text-xs text-[#5a5a56]">Available in Black & White • Arriving 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
