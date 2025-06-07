"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Let's use images we know exist in the project
const SHIRT_IMAGE = "/white-linen-shirt-final.png" // This exists in the project
const TROUSER_IMAGE = "/cream-linen-trousers-new.png" // This exists in the project

export default function OurCollectionSection() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
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

  const handleShirtImageError = () => {
    console.warn(`Failed to load shirt image: ${SHIRT_IMAGE}`)
    setShirtImageError(true)
  }

  const handleTrouserImageError = () => {
    console.warn(`Failed to load trouser image: ${TROUSER_IMAGE}`)
    setTrouserImageError(true)
  }

  const handleShirtClick = () => {
    router.push(`/product/shirt/0`)
  }

  const handleTrouserClick = () => {
    router.push(`/product/trouser/0`)
  }

  return (
    <>
      {/* Shirt Section */}
      <section className="w-full bg-[#eeeeec]" id="collection">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-0 min-h-[500px] md:min-h-[600px]">
            {/* Image Container - Mobile optimised with shadow */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-6 md:py-16 px-4 sm:px-6 md:px-16 lg:px-20">
              <div className="w-full h-full flex items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[500px] relative">
                <div
                  className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] cursor-pointer"
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
                        src={SHIRT_IMAGE || "/placeholder.svg"}
                        alt="ETERNO White Linen Shirt"
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
                        <p className="text-xs text-[#5a5a56]/70">White Shirt</p>
                      </div>
                    </div>
                  )}

                  {!shirtImageLoaded && !shirtImageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content - Mobile optimised */}
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
                <p className="text-sm text-[#5a5a56]">Available in an array of colourways</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trouser Section */}
      <section className="w-full bg-[#f9f8f5]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row-reverse gap-0 min-h-[500px] md:min-h-[600px]">
            {/* Image Container - Mobile optimised with shadow */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-6 md:py-16 px-4 sm:px-6 md:px-16 lg:px-20">
              <div className="w-full h-full flex items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[500px] relative">
                <div
                  className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] cursor-pointer"
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
                        src={TROUSER_IMAGE || "/placeholder.svg"}
                        alt="ETERNO Natural Linen Trousers"
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
                        <p className="text-xs text-[#5a5a56]/70">Natural Trousers</p>
                      </div>
                    </div>
                  )}

                  {!trouserImageLoaded && !trouserImageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content - Mobile optimised */}
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

              <div className={`mt-4 md:mt-6 max-w-[550px] w-full ${isMobile ? "text-center mx-auto" : "text-left"}`}>
                <p className="text-sm text-[#5a5a56]">Available in an array of colourways</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
