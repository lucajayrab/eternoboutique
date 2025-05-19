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
          {/* Image Section - Left on desktop, top on mobile */}
          <div className="w-full md:w-1/2 flex items-center py-4 md:py-16 px-4 sm:px-8 md:px-16 lg:px-20 mb-0 md:mb-0">
            <div className="w-full aspect-[4/3] md:h-full bg-[#f5f5f3] flex items-center justify-center overflow-hidden">
              <img
                src="/lakeside-balcony-view.png"
                alt="Men in linen clothing overlooking an Italian lake from a balcony"
                className="w-full h-full object-cover object-center"
              />
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
                  <p>We were founded on a simple idea:</p>
                  <p>That the best clothes are the ones that become part of your story.</p>
                  <p>Linen worn through long lunches on the coast.</p>
                  <p>Garments made not just to be seen—but to be lived in.</p>
                </div>

                <div className="space-y-2">
                  <p>Handcrafted in Italy and inspired by summers you never want to end,</p>
                  <p>Eterno captures the art of dressing with intention.</p>
                </div>

                <div className="space-y-2">
                  <p>Because the best things in life aren't rushed.</p>
                  <p>They're chosen slowly, worn in deeply, and remembered long after.</p>
                </div>

                <div className="space-y-2">
                  <p>For the ones who don't need to say too much—</p>
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
