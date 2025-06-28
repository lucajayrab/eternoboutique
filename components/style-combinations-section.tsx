"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

// Reuse the existing color data
const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/white-linen-shirt-final.png" },
  { name: "Black", color: "#2a2a33", image: "/black-linen-shirt-final.png" },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-shirt-final.png" },
  { name: "Sky Blue", color: "#c9d7e8", image: "/sky-blue-linen-shirt-final.png" },
  { name: "Pink", color: "#e7d0d3", image: "/pink-linen-shirt-updated.png" },
  { name: "Sage", color: "#9ca594", image: "/sage-linen-shirt-final.png" },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png" },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png" },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png" },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png" },
]

// Curated combinations that work well together
const SUGGESTED_COMBINATIONS = [
  { shirt: 0, trouser: 0, name: "Classic Natural" }, // White shirt + Natural trousers
  { shirt: 1, trouser: 1, name: "Monochrome" }, // Black shirt + White trousers
  { shirt: 2, trouser: 0, name: "Mediterranean" }, // Navy shirt + Natural trousers
  { shirt: 3, trouser: 1, name: "Coastal" }, // Sky Blue shirt + White trousers
  { shirt: 4, trouser: 0, name: "Sunset" }, // Pink shirt + Natural trousers
  { shirt: 5, trouser: 3, name: "Earth Tones" }, // Sage shirt + Black trousers
]

export default function StyleCombinationsSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedShirt, setSelectedShirt] = useState(0)
  const [selectedTrouser, setSelectedTrouser] = useState(0)
  const [shirtImageLoaded, setShirtImageLoaded] = useState(false)
  const [trouserImageLoaded, setTrouserImageLoaded] = useState(false)
  const [shirtImageError, setShirtImageError] = useState(false)
  const [trouserImageError, setTrouserImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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

  // Reset image states when selections change
  useEffect(() => {
    setShirtImageLoaded(false)
    setShirtImageError(false)
  }, [selectedShirt])

  useEffect(() => {
    setTrouserImageLoaded(false)
    setTrouserImageError(false)
  }, [selectedTrouser])

  // Handle suggested combination selection
  const selectCombination = (combination: (typeof SUGGESTED_COMBINATIONS)[0]) => {
    setSelectedShirt(combination.shirt)
    setSelectedTrouser(combination.trouser)
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  // Calculate total price
  const totalPrice = 350 + 350 // £350 each

  return (
    <section className="w-full bg-[#eeeeec] py-8 sm:py-12 md:py-16" id="style-combinations">
      {/* Use consistent container width like other sections */}
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl">
        {/* Clickable Section Header */}
        <div className={`mb-8 md:mb-12 text-center cursor-pointer`} onClick={toggleExpanded}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">COMPLETE THE LOOK</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 text-[#5a5a56]/70 ${isExpanded ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <h2 className="font-mulish text-base sm:text-lg md:text-xl font-light tracking-widest uppercase text-[#5a5a56]">
            Style Combinations
          </h2>
          <p className="font-mulish font-light text-[#5a5a56]/80 text-[10px] sm:text-xs mt-4 max-w-2xl mx-auto">
            Explore how our signature pieces work together. Mix and match colors to create your perfect ensemble.
          </p>
        </div>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Suggested Combinations - Now at the top as prominent cards */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-xs uppercase tracking-wider text-[#5a5a56] mb-6 text-center font-light">
              Curated Combinations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
              {SUGGESTED_COMBINATIONS.map((combo, index) => (
                <button
                  key={index}
                  onClick={() => selectCombination(combo)}
                  className={`p-2 md:p-3 rounded transition-all duration-200 text-center ${
                    selectedShirt === combo.shirt && selectedTrouser === combo.trouser
                      ? "bg-[#5a5a56]/10 border-2 border-[#5a5a56]/30"
                      : "bg-[#f9f8f5] hover:bg-[#5a5a56]/5 border-2 border-transparent"
                  }`}
                >
                  <div className="flex justify-center space-x-1 mb-2">
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-[#ddd]"
                      style={{ backgroundColor: SHIRT_COLORS[combo.shirt].color }}
                    />
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-[#ddd]"
                      style={{ backgroundColor: TROUSER_COLORS[combo.trouser].color }}
                    />
                  </div>
                  <p className="text-[8px] md:text-[10px] font-medium text-[#5a5a56] mb-1">{combo.name}</p>
                  <p className="text-[7px] md:text-[8px] text-[#5a5a56]/70 leading-tight">
                    {SHIRT_COLORS[combo.shirt].name} + {TROUSER_COLORS[combo.trouser].name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Better organized */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column - Outfit Visualization (spans 2 columns on large screens) */}
            <div className="lg:w-2/3">
              <div className="bg-[#f9f8f5] p-4 md:p-6 lg:p-8 h-full">
                {/* Current Selection Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xs uppercase tracking-wider text-[#5a5a56] font-light mb-2">Current Selection</h3>
                  <p className="text-xs text-[#5a5a56]/70">
                    {SHIRT_COLORS[selectedShirt].name} Shirt + {TROUSER_COLORS[selectedTrouser].name} Trousers
                  </p>
                </div>

                {/* Outfit Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 min-h-[400px] md:min-h-[500px]">
                  {/* Shirt Display */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] font-light">
                        {SHIRT_COLORS[selectedShirt].name} Shirt
                      </h4>
                      <span className="text-xs text-[#5a5a56]/70">£350</span>
                    </div>

                    <div className="relative flex-1 bg-[#eeeeec] flex items-center justify-center rounded">
                      {!shirtImageError && (
                        <div
                          className={`transition-opacity duration-300 w-full h-full ${shirtImageLoaded ? "opacity-100" : "opacity-0"}`}
                        >
                          <Image
                            src={SHIRT_COLORS[selectedShirt].image || "/placeholder.svg"}
                            alt={`${SHIRT_COLORS[selectedShirt].name} Linen Shirt`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: "contain", objectPosition: "center" }}
                            onLoad={() => setShirtImageLoaded(true)}
                            onError={() => setShirtImageError(true)}
                            priority
                          />
                        </div>
                      )}

                      {/* Error/Loading states */}
                      {(shirtImageError || (!shirtImageLoaded && !shirtImageError)) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {shirtImageError ? (
                            <div className="text-center">
                              <div className="w-12 h-12 bg-[#5a5a56]/10 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-[#5a5a56]/50" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <p className="text-xs text-[#5a5a56]/70">Shirt Preview</p>
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trouser Display */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] font-light">
                        {TROUSER_COLORS[selectedTrouser].name} Trousers
                      </h4>
                      <span className="text-xs text-[#5a5a56]/70">£350</span>
                    </div>

                    <div className="relative flex-1 bg-[#eeeeec] flex items-center justify-center rounded">
                      {!trouserImageError && (
                        <div
                          className={`transition-opacity duration-300 w-full h-full ${trouserImageLoaded ? "opacity-100" : "opacity-0"}`}
                        >
                          <Image
                            src={TROUSER_COLORS[selectedTrouser].image || "/placeholder.svg"}
                            alt={`${TROUSER_COLORS[selectedTrouser].name} Linen Trousers`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: "contain", objectPosition: "center" }}
                            onLoad={() => setTrouserImageLoaded(true)}
                            onError={() => setTrouserImageError(true)}
                            priority
                          />
                        </div>
                      )}

                      {/* Error/Loading states */}
                      {(trouserImageError || (!trouserImageLoaded && !trouserImageError)) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {trouserImageError ? (
                            <div className="text-center">
                              <div className="w-12 h-12 bg-[#5a5a56]/10 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-[#5a5a56]/50" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <p className="text-xs text-[#5a5a56]/70">Trouser Preview</p>
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="mt-8 pt-6 border-t border-[#e0ddd2] text-center">
                  <p className="text-lg font-medium text-[#5a5a56]">Complete Set: £{totalPrice}</p>
                  <p className="text-xs text-[#5a5a56]/70 mt-1">Save when ordering both pieces together</p>
                </div>
              </div>
            </div>

            {/* Right Column - Color Selectors (more compact and organized) */}
            <div className="lg:w-1/3 flex flex-col space-y-8">
              {/* Shirt Color Selector */}
              <div className="bg-[#f9f8f5] p-4 rounded flex-1 flex flex-col">
                <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] mb-4 font-light text-center">
                  Shirt Colors
                </h4>
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  {SHIRT_COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedShirt(index)}
                      className={`flex flex-col items-center p-3 rounded transition-all duration-200 ${
                        selectedShirt === index ? "bg-[#5a5a56]/10 ring-2 ring-[#5a5a56]/30" : "hover:bg-[#5a5a56]/5"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 mb-2 ${
                          selectedShirt === index ? "border-[#5a5a56]" : "border-[#ddd]"
                        }`}
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-xs text-[#5a5a56] text-center leading-tight">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trouser Color Selector */}
              <div className="bg-[#f9f8f5] p-4 rounded flex-1 flex flex-col">
                <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] mb-4 font-light text-center">
                  Trouser Colors
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {TROUSER_COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTrouser(index)}
                      className={`flex flex-col items-center p-3 rounded transition-all duration-200 ${
                        selectedTrouser === index ? "bg-[#5a5a56]/10 ring-2 ring-[#5a5a56]/30" : "hover:bg-[#5a5a56]/5"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 mb-2 ${
                          selectedTrouser === index ? "border-[#5a5a56]" : "border-[#ddd]"
                        }`}
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-xs text-[#5a5a56] text-center leading-tight">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-[#f9f8f5] p-4 rounded text-center flex-1 flex flex-col justify-center">
                <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] mb-3 font-light">About This Set</h4>
                <p className="text-xs text-[#5a5a56]/80 leading-relaxed">
                  Both pieces are handcrafted in Italy from premium linen. Perfect for Mediterranean summers and
                  sophisticated casual occasions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider text-[#5a5a56] hover:bg-[#5a5a56]/5 rounded transition-colors border border-[#5a5a56]/20"
          >
            {isExpanded ? "Hide Combinations" : "Show Combinations"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
