"use client"

import { useState, useEffect, useCallback } from "react"

export default function EternoManifestoSection() {
  const [isMobile, setIsMobile] = useState(false)

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

  return (
    <section className="w-full bg-[#f9f8f5]" id="manifesto">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-0 md:gap-0 min-h-[400px] md:min-h-[600px]">
          {/* Image Section - Left */}
          <div className="w-full md:w-1/2 flex items-center py-4 md:py-16 px-8 sm:px-12 md:px-16 lg:px-20 mb-0 md:mb-0 pb-8 md:pb-4">
            <div className="w-full h-full bg-[#f5f5f3] flex items-center justify-center">
              <img
                src="/lakeside-balcony-view.png"
                alt="Men in linen clothing overlooking an Italian lake from a balcony"
                className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover object-center"
              />
            </div>
          </div>

          {/* Text Section - Right */}
          <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-8 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-center py-4 md:py-16 items-start pt-8 md:pt-4 mt-0 md:mt-0">
            <div className={`space-y-1 ${isMobile ? "text-center w-full" : "text-left"}`}>
              <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">OUR PHILOSOPHY</p>
              <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base uppercase tracking-wider">MANIFESTO</h3>
            </div>

            <div
              className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm max-w-[550px] space-y-3 ${
                isMobile ? "text-center mx-auto" : "text-left"
              }`}
            >
              <p>We were founded on a simple idea:</p>
              <p>That the best clothes are the ones that become part of your story.</p>
              <p>Linen worn through long lunches on the coast.</p>
              <p>Garments made not just to be seen—but to be lived in.</p>

              <p>Handcrafted in Italy and inspired by summers you never want to end,</p>
              <p>Eterno captures the art of dressing with intention.</p>

              <p>Because the best things in life aren't rushed.</p>
              <p>They're chosen slowly, worn in deeply, and remembered long after.</p>

              <p>For the ones who don't need to say too much—</p>
              <p>because the linen already does.</p>
            </div>

            <p
              className={`font-mulish text-xs uppercase tracking-widest font-light text-[#5a5a56] mt-4 ${
                isMobile ? "text-center w-full" : "text-left"
              }`}
            >
              Made in Italy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
