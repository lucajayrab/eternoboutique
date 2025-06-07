"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import DesktopNavigation from "@/components/desktop-navigation"
import SlidingButton from "@/components/sliding-button"

type EmbroideryPosition = "cuff" | "collar" | null
type EmbroideryStyle = "script" | "block" | "italic"
type EmbroideryColor = "navy" | "black" | "white" | "gold"

export default function CustomizePage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [embroideryPosition, setEmbroideryPosition] = useState<EmbroideryPosition>(null)
  const [embroideryText, setEmbroideryText] = useState("")
  const [embroideryStyle, setEmbroideryStyle] = useState<EmbroideryStyle>("script")
  const [embroideryColor, setEmbroideryColor] = useState<EmbroideryColor>("navy")
  const [showEmbroideryOptions, setShowEmbroideryOptions] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("eternoCart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse saved cart", e)
      }
    }
  }, [])

  const getTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => {
      let itemPrice = 0
      if (item.type === "shirt") itemPrice = 350
      else if (item.type === "trouser") itemPrice = 350
      else if (item.type === "set") itemPrice = 650
      return total + itemPrice * item.quantity
    }, 0)

    const embroideryPrice = embroideryPosition && embroideryText ? 25 : 0
    return cartTotal + embroideryPrice
  }

  const handleEmbroideryPositionClick = (position: EmbroideryPosition) => {
    setEmbroideryPosition(position)
    setShowEmbroideryOptions(true)
  }

  const proceedToCheckout = () => {
    const orderData = {
      cart,
      embroidery: embroideryPosition
        ? {
            position: embroideryPosition,
            text: embroideryText,
            style: embroideryStyle,
            color: embroideryColor,
            price: 25,
          }
        : null,
      totalPrice: getTotalPrice(),
    }

    localStorage.setItem("eternoOrder", JSON.stringify(orderData))
    router.push("/checkout")
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
        <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 max-w-7xl py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-mulish text-2xl md:text-3xl font-light tracking-widest uppercase text-[#5a5a56] mb-4">
              Customize Your Order
            </h1>
            <p className="font-mulish font-light text-[#5a5a56]/80 text-sm md:text-base max-w-2xl mx-auto">
              Add a personal touch with custom embroidery. Click on the shirt areas below to select embroidery
              placement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Interactive Shirt Preview */}
            <div className="bg-[#f9f8f5] rounded-lg p-8">
              <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-6 text-center">
                Select Embroidery Position
              </h3>

              <div className="relative aspect-square max-w-md mx-auto">
                {/* White Shirt Image */}
                <Image
                  src="/white-linen-shirt-final.png"
                  alt="White Linen Shirt for Customization"
                  fill
                  style={{ objectFit: "contain" }}
                  className="pointer-events-none"
                />

                {/* Clickable Areas */}
                {/* Collar Area */}
                <button
                  onClick={() => handleEmbroideryPositionClick("collar")}
                  className={`absolute top-[15%] left-[45%] w-[10%] h-[8%] rounded-full transition-all duration-300 ${
                    embroideryPosition === "collar"
                      ? "bg-[#5a5a56]/30 ring-2 ring-[#5a5a56]"
                      : "bg-transparent hover:bg-[#5a5a56]/20"
                  }`}
                  aria-label="Select collar for embroidery"
                />

                {/* Cuff Area */}
                <button
                  onClick={() => handleEmbroideryPositionClick("cuff")}
                  className={`absolute bottom-[25%] right-[20%] w-[12%] h-[6%] rounded-full transition-all duration-300 ${
                    embroideryPosition === "cuff"
                      ? "bg-[#5a5a56]/30 ring-2 ring-[#5a5a56]"
                      : "bg-transparent hover:bg-[#5a5a56]/20"
                  }`}
                  aria-label="Select cuff for embroidery"
                />

                {/* Visual Indicators */}
                {embroideryPosition === "collar" && embroideryText && (
                  <div className="absolute top-[15%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
                    <span
                      className={`text-xs font-${embroideryStyle === "script" ? "serif" : "sans"} ${
                        embroideryStyle === "italic" ? "italic" : ""
                      }`}
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

                {embroideryPosition === "cuff" && embroideryText && (
                  <div className="absolute bottom-[25%] right-[20%] transform translate-x-1/2 translate-y-1/2">
                    <span
                      className={`text-xs font-${embroideryStyle === "script" ? "serif" : "sans"} ${
                        embroideryStyle === "italic" ? "italic" : ""
                      }`}
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
                    ? `Selected: ${embroideryPosition.charAt(0).toUpperCase() + embroideryPosition.slice(1)}`
                    : "Click on the collar or cuff to add embroidery"}
                </p>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-6">
              {/* Embroidery Options */}
              {showEmbroideryOptions && (
                <div className="bg-[#f9f8f5] rounded-lg p-6">
                  <h4 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-4">
                    Embroidery Details
                  </h4>

                  {/* Text Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#5a5a56] mb-2">Initials (max 3 characters)</label>
                    <input
                      type="text"
                      value={embroideryText}
                      onChange={(e) => setEmbroideryText(e.target.value.slice(0, 3).toUpperCase())}
                      className="w-full px-3 py-2 border border-[#5a5a56]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a5a56]/20 bg-white"
                      placeholder="ABC"
                    />
                  </div>

                  {/* Style Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#5a5a56] mb-2">Embroidery Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["script", "block", "italic"] as EmbroideryStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => setEmbroideryStyle(style)}
                          className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                            embroideryStyle === style
                              ? "bg-[#5a5a56] text-white"
                              : "bg-white text-[#5a5a56] hover:bg-[#5a5a56]/5"
                          }`}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#5a5a56] mb-2">Embroidery Color</label>
                    <div className="flex gap-2">
                      {(
                        [
                          { name: "navy", color: "#2d2a3e" },
                          { name: "black", color: "#2a2a33" },
                          { name: "white", color: "#ffffff" },
                          { name: "gold", color: "#d4af37" },
                        ] as { name: EmbroideryColor; color: string }[]
                      ).map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setEmbroideryColor(color.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            embroideryColor === color.name
                              ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20"
                              : "border-gray-300 hover:border-[#5a5a56]/50"
                          }`}
                          style={{ backgroundColor: color.color }}
                          aria-label={`${color.name} embroidery color`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-[#5a5a56]/70">
                    <p>Embroidery cost: £25</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-[#f9f8f5] rounded-lg p-6">
                <h4 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-4">
                  Order Summary
                </h4>

                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-[#5a5a56]/10">
                    <span className="text-[#5a5a56]">
                      {item.type === "set" ? "Complete Set" : item.type.charAt(0).toUpperCase() + item.type.slice(1)} x
                      {item.quantity}
                    </span>
                    <span className="text-[#5a5a56]">
                      £{item.type === "set" ? 650 * item.quantity : 350 * item.quantity}
                    </span>
                  </div>
                ))}

                {embroideryPosition && embroideryText && (
                  <div className="flex justify-between items-center py-2 border-b border-[#5a5a56]/10">
                    <span className="text-[#5a5a56]">
                      Embroidery ({embroideryPosition}: "{embroideryText}")
                    </span>
                    <span className="text-[#5a5a56]">£25</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 font-medium">
                  <span className="text-[#5a5a56]">Total</span>
                  <span className="text-lg text-[#5a5a56]">£{getTotalPrice()}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <SlidingButton
                onClick={proceedToCheckout}
                variant="dark"
                duration={800}
                className="w-full py-3 text-sm"
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </SlidingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
