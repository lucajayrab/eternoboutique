"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import DesktopNavigation from "@/components/desktop-navigation"
import SlidingButton from "@/components/sliding-button"

type EmbroideryPosition = "left-collar" | "right-collar" | "left-cuff" | "right-cuff" | null
type CuffPosition = "inside" | "outside" | null
type EmbroideryColor = "navy" | "black" | "white" | "gold"

const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/images/shirts/new-white-linen-shirt.png", price: 325 },
  { name: "Black", color: "#2a2a33", image: "/images/shirts/new-black-linen-shirt.png", price: 325 },
  { name: "Navy", color: "#2d2a3e", image: "/images/shirts/new-navy-linen-shirt.png", price: 325 },
  { name: "Sky Blue", color: "#c9d7e8", image: "/images/shirts/new-sky-blue-linen-shirt.png", price: 325 },
  { name: "Pink", color: "#e7d0d3", image: "/images/shirts/new-pink-linen-shirt.png", price: 325 },
  { name: "Sage", color: "#9ca594", image: "/images/shirts/new-sage-linen-shirt.png", price: 325 },
]

export default function CustomizeShirtPage() {
  const router = useRouter()
  const [pendingCustomization, setPendingCustomization] = useState<any>(null)
  const [currentShirt, setCurrentShirt] = useState<any>(null)
  const [embroideryPosition, setEmbroideryPosition] = useState<EmbroideryPosition>(null)
  const [cuffPosition, setCuffPosition] = useState<CuffPosition>(null)
  const [embroideryText, setEmbroideryText] = useState("")
  const [embroideryColor, setEmbroideryColor] = useState<EmbroideryColor>("navy")
  const [hoveredArea, setHoveredArea] = useState<EmbroideryPosition>(null)

  useEffect(() => {
    const pending = localStorage.getItem("pendingShirtCustomization")
    if (pending) {
      try {
        const data = JSON.parse(pending)
        setPendingCustomization(data)
        setCurrentShirt(SHIRT_COLORS[data.shirtIndex])
      } catch (e) {
        console.error("Failed to parse pending customization", e)
        router.push("/shop")
      }
    } else {
      router.push("/shop")
    }
  }, [router])

  const handleEmbroideryPositionClick = (position: EmbroideryPosition) => {
    setEmbroideryPosition(position)
    // Reset cuff position when changing embroidery position
    if (!position?.includes("cuff")) {
      setCuffPosition(null)
    }
  }

  const skipCustomization = () => {
    // Clear pending customization and go to cart
    localStorage.removeItem("pendingShirtCustomization")
    router.push("/shop")
  }

  const proceedWithCustomization = () => {
    if (embroideryPosition && embroideryText) {
      // Save embroidery details to the cart item
      const cart = JSON.parse(localStorage.getItem("eternoCart") || "[]")
      const lastItem = cart[cart.length - 1]

      if (lastItem) {
        lastItem.embroidery = {
          position: embroideryPosition,
          cuffPosition: embroideryPosition?.includes("cuff") ? cuffPosition : null,
          text: embroideryText,
          color: embroideryColor,
          price: 25,
        }
        localStorage.setItem("eternoCart", JSON.stringify(cart))
      }
    }

    // Clear pending customization and proceed
    localStorage.removeItem("pendingShirtCustomization")
    router.push("/shop")
  }

  const getPositionLabel = (position: EmbroideryPosition) => {
    switch (position) {
      case "left-collar":
        return "Left Collar"
      case "right-collar":
        return "Right Collar"
      case "left-cuff":
        return `Left Cuff${cuffPosition ? ` (${cuffPosition.charAt(0).toUpperCase() + cuffPosition.slice(1)})` : ""}`
      case "right-cuff":
        return `Right Cuff${cuffPosition ? ` (${cuffPosition.charAt(0).toUpperCase() + cuffPosition.slice(1)})` : ""}`
      default:
        return ""
    }
  }

  const isCustomizationComplete = () => {
    if (!embroideryPosition || !embroideryText) return false
    if (embroideryPosition?.includes("cuff") && !cuffPosition) return false
    return true
  }

  if (!currentShirt || !pendingCustomization) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a5a56]">Loading customization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Banner */}
      <StickyBanner logoWidth="45mm" />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Desktop Navigation */}
      <DesktopNavigation />

      {/* Main Content */}
      <div className="pt-[70px]">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-full py-12">
          {/* Header - Consistent with other pages */}
          <div className="text-center mb-12">
            <h1 className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-[#5a5a56] mb-2">
              CUSTOMISE
            </h1>
            <p className="font-light text-[#5a5a56]/80 text-sm md:text-base max-w-2xl mx-auto">
              Each ETERNO shirt can be personalised with your initials, adding a subtle touch of individuality to our
              timeless designs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Interactive Shirt Preview - Use Selected Shirt Color */}
            <div className="bg-[#f9f8f5] rounded-lg p-8">
              <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-6 text-center">
                Select Embroidery Position
              </h3>

              <div className="relative aspect-square max-w-md mx-auto">
                {/* Selected Shirt Image for Customization */}
                <Image
                  src={currentShirt.image || "/placeholder.svg"}
                  alt={`${currentShirt.name} Linen Shirt for Customization`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="pointer-events-none"
                  priority
                />

                {/* Clickable Areas with Enhanced Visibility */}
                {/* Left Collar Area (appears on right side from our viewing angle) */}
                <button
                  onClick={() => handleEmbroideryPositionClick("left-collar")}
                  onMouseEnter={() => setHoveredArea("left-collar")}
                  onMouseLeave={() => setHoveredArea(null)}
                  className={`absolute top-[14%] right-[38%] w-[30px] h-[30px] rounded-full transition-all duration-300 transform ${
                    embroideryPosition === "left-collar"
                      ? "bg-[#5a5a56]/50 ring-2 ring-[#5a5a56]/30 scale-110"
                      : hoveredArea === "left-collar"
                        ? "bg-[#5a5a56]/30 ring-1 ring-[#5a5a56]/20 scale-105"
                        : "bg-[#5a5a56]/20 hover:bg-[#5a5a56]/30"
                  }`}
                  aria-label="Select left collar for embroidery"
                />

                {/* Right Collar Area (appears on left side from our viewing angle) */}
                <button
                  onClick={() => handleEmbroideryPositionClick("right-collar")}
                  onMouseEnter={() => setHoveredArea("right-collar")}
                  onMouseLeave={() => setHoveredArea(null)}
                  className={`absolute top-[14%] left-[38%] w-[30px] h-[30px] rounded-full transition-all duration-300 transform ${
                    embroideryPosition === "right-collar"
                      ? "bg-[#5a5a56]/50 ring-2 ring-[#5a5a56]/30 scale-110"
                      : hoveredArea === "right-collar"
                        ? "bg-[#5a5a56]/30 ring-1 ring-[#5a5a56]/20 scale-105"
                        : "bg-[#5a5a56]/20 hover:bg-[#5a5a56]/30"
                  }`}
                  aria-label="Select right collar for embroidery"
                />

                {/* Left Cuff Area (on the right arm from our viewing angle) */}
                <button
                  onClick={() => handleEmbroideryPositionClick("left-cuff")}
                  onMouseEnter={() => setHoveredArea("left-cuff")}
                  onMouseLeave={() => setHoveredArea(null)}
                  className={`absolute bottom-[19%] right-[15%] w-[30px] h-[30px] rounded-full transition-all duration-300 transform ${
                    embroideryPosition === "left-cuff"
                      ? "bg-[#5a5a56]/50 ring-2 ring-[#5a5a56]/30 scale-110"
                      : hoveredArea === "left-cuff"
                        ? "bg-[#5a5a56]/30 ring-1 ring-[#5a5a56]/20 scale-105"
                        : "bg-[#5a5a56]/20 hover:bg-[#5a5a56]/30"
                  }`}
                  aria-label="Select left cuff for embroidery"
                />

                {/* Right Cuff Area (on the left arm from our viewing angle) */}
                <button
                  onClick={() => handleEmbroideryPositionClick("right-cuff")}
                  onMouseEnter={() => setHoveredArea("right-cuff")}
                  onMouseLeave={() => setHoveredArea(null)}
                  className={`absolute bottom-[19%] left-[15%] w-[30px] h-[30px] rounded-full transition-all duration-300 transform ${
                    embroideryPosition === "right-cuff"
                      ? "bg-[#5a5a56]/50 ring-2 ring-[#5a5a56]/30 scale-110"
                      : hoveredArea === "right-cuff"
                        ? "bg-[#5a5a56]/30 ring-1 ring-[#5a5a56]/20 scale-105"
                        : "bg-[#5a5a56]/20 hover:bg-[#5a5a56]/30"
                  }`}
                  aria-label="Select right cuff for embroidery"
                />

                {/* Enhanced Hover Labels */}
                {hoveredArea === "left-collar" && (
                  <div className="absolute top-[8%] right-[38%] transform translate-x-1/2 -translate-y-full">
                    <div className="bg-[#5a5a56] text-white px-3 py-2 rounded-md text-sm font-light shadow-lg">
                      Left Collar
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#5a5a56]"></div>
                    </div>
                  </div>
                )}

                {hoveredArea === "right-collar" && (
                  <div className="absolute top-[8%] left-[38%] transform -translate-x-1/2 -translate-y-full">
                    <div className="bg-[#5a5a56] text-white px-3 py-2 rounded-md text-sm font-light shadow-lg">
                      Right Collar
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#5a5a56]"></div>
                    </div>
                  </div>
                )}

                {hoveredArea === "left-cuff" && (
                  <div className="absolute bottom-[16%] right-[15%] transform translate-x-1/2 translate-y-full">
                    <div className="bg-[#5a5a56] text-white px-3 py-2 rounded-md text-sm font-light shadow-lg">
                      Left Cuff
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#5a5a56]"></div>
                    </div>
                  </div>
                )}

                {hoveredArea === "right-cuff" && (
                  <div className="absolute bottom-[16%] left-[15%] transform -translate-x-1/2 translate-y-full">
                    <div className="bg-[#5a5a56] text-white px-3 py-2 rounded-md text-sm font-light shadow-lg">
                      Right Cuff
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#5a5a56]"></div>
                    </div>
                  </div>
                )}

                {/* Visual Preview of Embroidery */}
                {embroideryPosition === "left-collar" && embroideryText && (
                  <div className="absolute top-[14%] right-[38%] transform translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span
                      className="text-xs font-serif italic drop-shadow-sm"
                      style={{
                        color:
                          embroideryColor === "navy"
                            ? "#2d2a3e"
                            : embroideryColor === "black"
                              ? "#2a2a33"
                              : embroideryColor === "white"
                                ? "#ffffff"
                                : "#d4af37",
                      }}
                    >
                      {embroideryText}
                    </span>
                  </div>
                )}

                {embroideryPosition === "right-collar" && embroideryText && (
                  <div className="absolute top-[14%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span
                      className="text-xs font-serif italic drop-shadow-sm"
                      style={{
                        color:
                          embroideryColor === "navy"
                            ? "#2d2a3e"
                            : embroideryColor === "black"
                              ? "#2a2a33"
                              : embroideryColor === "white"
                                ? "#ffffff"
                                : "#d4af37",
                      }}
                    >
                      {embroideryText}
                    </span>
                  </div>
                )}

                {embroideryPosition === "left-cuff" && embroideryText && cuffPosition && (
                  <div className="absolute bottom-[19%] right-[15%] transform translate-x-1/2 translate-y-1/2 pointer-events-none">
                    <span
                      className="text-xs font-serif italic drop-shadow-sm"
                      style={{
                        color:
                          embroideryColor === "navy"
                            ? "#2d2a3e"
                            : embroideryColor === "black"
                              ? "#2a2a33"
                              : embroideryColor === "white"
                                ? "#ffffff"
                                : "#d4af37",
                      }}
                    >
                      {embroideryText}
                    </span>
                  </div>
                )}

                {embroideryPosition === "right-cuff" && embroideryText && cuffPosition && (
                  <div className="absolute bottom-[19%] left-[15%] transform -translate-x-1/2 translate-y-1/2 pointer-events-none">
                    <span
                      className="text-xs font-serif italic drop-shadow-sm"
                      style={{
                        color:
                          embroideryColor === "navy"
                            ? "#2d2a3e"
                            : embroideryColor === "black"
                              ? "#2a2a33"
                              : embroideryColor === "white"
                                ? "#ffffff"
                                : "#d4af37",
                      }}
                    >
                      {embroideryText}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#5a5a56]/70">
                  {embroideryPosition
                    ? `Selected: ${getPositionLabel(embroideryPosition)}`
                    : "Choose from four refined placement options"}
                </p>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-6">
              {/* Embroidery Options */}
              {embroideryPosition && (
                <div className="bg-[#f9f8f5] rounded-lg p-6 animate-in slide-in-from-right duration-300">
                  <h4 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-4">
                    Embroidery Details
                  </h4>

                  {/* Cuff Position Selection (only show if cuff is selected) */}
                  {embroideryPosition?.includes("cuff") && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[#5a5a56] mb-3">Cuff Position</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setCuffPosition("inside")}
                          className={`px-4 py-3 text-sm rounded-md transition-all duration-200 border ${
                            cuffPosition === "inside"
                              ? "bg-[#5a5a56] text-white border-[#5a5a56]"
                              : "bg-white text-[#5a5a56] hover:bg-[#5a5a56]/5 border-[#5a5a56]/20"
                          }`}
                        >
                          Inside Cuff
                        </button>
                        <button
                          onClick={() => setCuffPosition("outside")}
                          className={`px-4 py-3 text-sm rounded-md transition-all duration-200 border ${
                            cuffPosition === "outside"
                              ? "bg-[#5a5a56] text-white border-[#5a5a56]"
                              : "bg-white text-[#5a5a56] hover:bg-[#5a5a56]/5 border-[#5a5a56]/20"
                          }`}
                        >
                          Outside Cuff
                        </button>
                      </div>
                      <p className="text-xs text-[#5a5a56]/60 mt-2">
                        Inside cuff is more discreet, outside cuff is more visible
                      </p>
                    </div>
                  )}

                  {/* Text Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#5a5a56] mb-2">Initials (max 3 characters)</label>
                    <input
                      type="text"
                      value={embroideryText}
                      onChange={(e) => setEmbroideryText(e.target.value.slice(0, 3).toUpperCase())}
                      className="w-full px-4 py-3 border border-[#5a5a56]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20 bg-white font-light tracking-wider"
                      placeholder="ABC"
                    />
                    <p className="text-xs text-[#5a5a56]/60 mt-1">Hand-embroidered in refined script style</p>
                  </div>

                  {/* Color Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#5a5a56] mb-3">Thread Colour</label>
                    <div className="flex gap-4">
                      {(
                        [
                          { name: "navy", color: "#2d2a3e", label: "Navy" },
                          { name: "black", color: "#2a2a33", label: "Black" },
                          { name: "white", color: "#ffffff", label: "White" },
                          { name: "gold", color: "#d4af37", label: "Gold" },
                        ] as { name: EmbroideryColor; color: string; label: string }[]
                      ).map((color) => (
                        <div key={color.name} className="flex flex-col items-center">
                          <button
                            onClick={() => setEmbroideryColor(color.name)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                              embroideryColor === color.name
                                ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20 scale-110"
                                : "border-gray-300 hover:border-[#5a5a56]/50 hover:scale-105"
                            } ${color.name === "white" ? "shadow-md" : ""}`}
                            style={{ backgroundColor: color.color }}
                            aria-label={`${color.label} embroidery thread`}
                          />
                          <span className="text-xs mt-2 text-[#5a5a56] font-light">{color.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-[#5a5a56]/70 bg-white/50 p-4 rounded-md">
                    <p className="font-medium">Embroidery: £25</p>
                    <p className="text-xs mt-1">Professional hand-stitched personalisation</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-[#f9f8f5] rounded-lg p-6">
                <h4 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-4">
                  Order Summary
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-[#5a5a56]/10">
                    <span className="text-[#5a5a56]">
                      {pendingCustomization.type === "set"
                        ? `Complete Set (${currentShirt.name} Shirt)`
                        : `${currentShirt.name} Shirt`}
                    </span>
                    <span className="text-[#5a5a56]">£{pendingCustomization.type === "set" ? "600" : "325"}</span>
                  </div>

                  {embroideryPosition && embroideryText && isCustomizationComplete() && (
                    <div className="flex justify-between items-center py-2 border-b border-[#5a5a56]/10">
                      <span className="text-[#5a5a56]">
                        Embroidery ({getPositionLabel(embroideryPosition)}: "{embroideryText}")
                      </span>
                      <span className="text-[#5a5a56]">£25</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 font-medium">
                    <span className="text-[#5a5a56]">Total</span>
                    <span className="text-lg text-[#5a5a56]">
                      £{(pendingCustomization.type === "set" ? 600 : 325) + (isCustomizationComplete() ? 25 : 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <SlidingButton
                  onClick={proceedWithCustomization}
                  variant="dark"
                  duration={800}
                  className="w-full py-3 text-sm"
                  disabled={embroideryPosition && !isCustomizationComplete()}
                >
                  {isCustomizationComplete() ? "Add with Embroidery" : "Continue to Cart"}
                </SlidingButton>

                <button
                  onClick={skipCustomization}
                  className="w-full py-3 text-sm font-light tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors duration-200"
                >
                  Skip Personalisation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
