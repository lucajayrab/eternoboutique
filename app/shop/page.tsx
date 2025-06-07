"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import DesktopNavigation from "@/components/desktop-navigation"
import SlidingButton from "@/components/sliding-button"

// Product data
const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/white-linen-shirt-final.png", price: 350 },
  { name: "Black", color: "#2a2a33", image: "/black-linen-shirt-final.png", price: 350 },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-shirt-final.png", price: 350 },
  { name: "Sky Blue", color: "#c9d7e8", image: "/sky-blue-linen-shirt-final.png", price: 350 },
  { name: "Pink", color: "#e7d0d3", image: "/pink-linen-shirt-updated.png", price: 350 },
  { name: "Sage", color: "#9ca594", image: "/sage-linen-shirt-final.png", price: 350 },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png", price: 350 },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png", price: 350 },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png", price: 350 },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png", price: 350 },
]

const SUGGESTED_COMBINATIONS = [
  { shirt: 0, trouser: 0, name: "Classic Natural", price: 650 },
  { shirt: 1, trouser: 1, name: "Monochrome", price: 650 },
  { shirt: 2, trouser: 0, name: "Mediterranean", price: 650 },
  { shirt: 3, trouser: 1, name: "Coastal", price: 650 },
  { shirt: 4, trouser: 0, name: "Sunset", price: 650 },
  { shirt: 5, trouser: 3, name: "Earth Tones", price: 650 },
]

type ViewMode = "sets" | "shirts" | "trousers"
type CartItem = {
  type: "shirt" | "trouser" | "set"
  shirtIndex?: number
  trouserIndex?: number
  setIndex?: number
  quantity: number
}

// Carousel Component
function ProductCarousel({ products, type }: { products: any[]; type: "shirt" | "trouser" }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const ITEM_WIDTH_CENTER = 400
  const ITEM_HEIGHT_CENTER = 533
  const ITEM_WIDTH_SIDE = 300
  const ITEM_HEIGHT_SIDE = 400
  const ITEM_GAP = 32

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev + 1) % products.length)
        setTimeout(() => setIsTransitioning(false), 600)
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [products.length, isTransitioning])

  const handleProductClick = (index: number) => {
    if (index === currentIndex) {
      router.push(`/product/${type}/${index}`)
    } else {
      if (!isTransitioning) {
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 600)
      }
    }
  }

  const changeSlide = (newIndex: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(newIndex)
      setTimeout(() => setIsTransitioning(false), 600)
    }
  }

  const calculateOffset = () => {
    if (!carouselRef.current) return 0
    const containerWidth = carouselRef.current.offsetWidth

    let offset = 0
    for (let i = 0; i < currentIndex; i++) {
      offset += ITEM_WIDTH_SIDE + ITEM_GAP
    }
    offset += (ITEM_WIDTH_CENTER + ITEM_GAP) / 2
    return containerWidth / 2 - offset
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 overflow-hidden" ref={carouselRef}>
      <div
        className="flex items-center transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${calculateOffset()}px)` }}
      >
        {products.map((product, index) => {
          const isCenter = index === currentIndex
          const scale = isCenter ? "scale-100" : "scale-75"
          const opacity = isCenter ? "opacity-100" : "opacity-40"
          const zIndex = isCenter ? "z-20" : "z-10"
          const itemWidth = isCenter ? ITEM_WIDTH_CENTER : ITEM_WIDTH_SIDE
          const itemHeight = isCenter ? ITEM_HEIGHT_CENTER : ITEM_HEIGHT_SIDE

          return (
            <div
              key={product.image}
              className={`relative flex-shrink-0 transition-all duration-500 ease-in-out transform cursor-pointer flex items-center justify-center`}
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                marginRight: `${ITEM_GAP}px`,
                transform: `${scale}`,
                opacity: opacity,
                zIndex: zIndex,
              }}
              onClick={() => handleProductClick(index)}
            >
              <div className={`relative w-full h-full`}>
                <Image
                  src={product.image || `/placeholder.svg?width=${itemWidth}&height=${itemHeight}&query=linen+product`}
                  alt={`${product.name} Linen ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority={isCenter}
                  sizes={`(max-width: 768px) 100vw, ${itemWidth}px`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center space-x-2 mt-12">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-[#5a5a56] w-8" : "bg-[#5a5a56]/30 hover:bg-[#5a5a56]/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => changeSlide((currentIndex - 1 + products.length) % products.length)}
        className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 transform bg-white/70 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200 z-30"
        aria-label="Previous slide"
      >
        <svg className="w-7 h-7 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => changeSlide((currentIndex + 1) % products.length)}
        className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 transform bg-white/70 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200 z-30"
        aria-label="Next slide"
      >
        <svg className="w-7 h-7 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default function ShopPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>("sets")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedShirt, setSelectedShirt] = useState(0)
  const [selectedTrouser, setSelectedTrouser] = useState(0)
  const [activeTab, setActiveTab] = useState<ViewMode>("sets")

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

  useEffect(() => {
    localStorage.setItem("eternoCart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.type === item.type &&
          cartItem.shirtIndex === item.shirtIndex &&
          cartItem.trouserIndex === item.trouserIndex &&
          cartItem.setIndex === item.setIndex,
      )

      if (existingIndex >= 0) {
        const newCart = [...prev]
        newCart[existingIndex].quantity += 1
        return newCart
      } else {
        return [...prev, item]
      }
    })
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemPrice = 0
      if (item.type === "shirt") {
        itemPrice = SHIRT_COLORS[item.shirtIndex!].price
      } else if (item.type === "trouser") {
        itemPrice = TROUSER_COLORS[item.trouserIndex!].price
      } else if (item.type === "set") {
        itemPrice = SUGGESTED_COMBINATIONS[item.setIndex!].price
      }
      return total + itemPrice * item.quantity
    }, 0)
  }

  const proceedToCustomization = () => {
    localStorage.setItem("eternoCart", JSON.stringify(cart))
    router.push("/customize")
  }

  const handleTabChange = (tab: ViewMode) => {
    setActiveTab(tab)
    setViewMode(tab)
  }

  const addCustomSetToCart = () => {
    addToCart({
      type: "set",
      shirtIndex: selectedShirt,
      trouserIndex: selectedTrouser,
      quantity: 1,
    })
  }

  const selectSuggestedCombination = (combo: (typeof SUGGESTED_COMBINATIONS)[0]) => {
    setSelectedShirt(combo.shirt)
    setSelectedTrouser(combo.trouser)
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
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-mulish text-2xl md:text-3xl font-light tracking-widest uppercase text-[#5a5a56] mb-4">
              Eterno Collection
            </h1>
            <p className="font-mulish font-light text-[#5a5a56]/80 text-sm md:text-base max-w-2xl mx-auto">
              Handcrafted Italian linen pieces designed for the modern gentleman. Each piece tells a story of timeless
              elegance.
            </p>
          </div>

          {/* View Mode Selector */}
          <div className="flex justify-center mb-12">
            <div className="border-b border-[#5a5a56]/20 flex space-x-4 md:space-x-8">
              <button
                onClick={() => handleTabChange("sets")}
                className={`px-3 md:px-4 py-3 text-xs md:text-sm uppercase tracking-wider transition-all duration-300 relative ${
                  activeTab === "sets" ? "text-[#5a5a56]" : "text-[#5a5a56]/50 hover:text-[#5a5a56]/70"
                }`}
              >
                Complete Sets
                {activeTab === "sets" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5a5a56] transform -translate-y-px"></span>
                )}
              </button>
              <button
                onClick={() => handleTabChange("shirts")}
                className={`px-3 md:px-4 py-3 text-xs md:text-sm uppercase tracking-wider transition-all duration-300 relative ${
                  activeTab === "shirts" ? "text-[#5a5a56]" : "text-[#5a5a56]/50 hover:text-[#5a5a56]/70"
                }`}
              >
                Shirts
                {activeTab === "shirts" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5a5a56] transform -translate-y-px"></span>
                )}
              </button>
              <button
                onClick={() => handleTabChange("trousers")}
                className={`px-3 md:px-4 py-3 text-xs md:text-sm uppercase tracking-wider transition-all duration-300 relative ${
                  activeTab === "trousers" ? "text-[#5a5a56]" : "text-[#5a5a56]/50 hover:text-[#5a5a56]/70"
                }`}
              >
                Trousers
                {activeTab === "trousers" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5a5a56] transform -translate-y-px"></span>
                )}
              </button>
            </div>
          </div>

          {/* Complete Sets View with Interactive Customizer */}
          {viewMode === "sets" && (
            <div className="mb-16 max-w-7xl mx-auto px-4">
              <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 shadow-sm overflow-hidden mb-12">
                <div className="p-6 border-b border-[#5a5a56]/10">
                  <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56]">
                    Create Your Custom Set
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Main Preview */}
                  <div className="col-span-2 bg-[#f9f8f5] p-6">
                    <div className="aspect-[4/3] relative bg-[#f9f8f5] border border-[#5a5a56]/10">
                      <div className="grid grid-cols-2 h-full">
                        <div className="relative">
                          <Image
                            src={SHIRT_COLORS[selectedShirt].image || "/placeholder.svg"}
                            alt={`${SHIRT_COLORS[selectedShirt].name} Shirt`}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src={TROUSER_COLORS[selectedTrouser].image || "/placeholder.svg"}
                            alt={`${TROUSER_COLORS[selectedTrouser].name} Trousers`}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selection Controls */}
                  <div className="bg-white p-6 flex flex-col">
                    {/* Shirt Selection */}
                    <div className="mb-6">
                      <h4 className="font-mulish text-sm uppercase tracking-wider text-[#5a5a56]/80 mb-3">
                        Select Shirt Color
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {SHIRT_COLORS.map((shirt, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedShirt(index)}
                            className={`w-8 h-8 rounded-full transition-all duration-200 ${
                              selectedShirt === index
                                ? "ring-2 ring-offset-2 ring-[#5a5a56] scale-110"
                                : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: shirt.color }}
                            aria-label={`${shirt.name} shirt color`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[#5a5a56] mt-2">{SHIRT_COLORS[selectedShirt].name} Shirt</p>
                    </div>

                    {/* Trouser Selection */}
                    <div className="mb-6">
                      <h4 className="font-mulish text-sm uppercase tracking-wider text-[#5a5a56]/80 mb-3">
                        Select Trouser Color
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {TROUSER_COLORS.map((trouser, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedTrouser(index)}
                            className={`w-8 h-8 rounded-full transition-all duration-200 ${
                              selectedTrouser === index
                                ? "ring-2 ring-offset-2 ring-[#5a5a56] scale-110"
                                : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: trouser.color }}
                            aria-label={`${trouser.name} trouser color`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[#5a5a56] mt-2">{TROUSER_COLORS[selectedTrouser].name} Trousers</p>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[#5a5a56]">Total Price</span>
                        <span className="text-lg font-medium text-[#5a5a56]">£650</span>
                      </div>
                      <SlidingButton
                        onClick={addCustomSetToCart}
                        variant="dark"
                        duration={800}
                        className="w-full py-3 text-sm"
                      >
                        Add to Cart
                      </SlidingButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Combinations */}
              <h3 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mb-6 text-center">
                Suggested Combinations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {SUGGESTED_COMBINATIONS.map((combo, index) => (
                  <div key={index} className="bg-[#f9f8f5] border border-[#5a5a56]/10 shadow-sm overflow-hidden group">
                    <div className="aspect-square bg-[#f9f8f5] relative border-b border-[#5a5a56]/10">
                      <div className="grid grid-cols-2 h-full">
                        <div className="relative">
                          <Image
                            src={SHIRT_COLORS[combo.shirt].image || "/placeholder.svg"}
                            alt={`${SHIRT_COLORS[combo.shirt].name} Shirt`}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src={TROUSER_COLORS[combo.trouser].image || "/placeholder.svg"}
                            alt={`${TROUSER_COLORS[combo.trouser].name} Trousers`}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => selectSuggestedCombination(combo)}
                          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-md text-sm uppercase tracking-wider text-[#5a5a56] hover:bg-white transition-all duration-200"
                        >
                          Try This Combination
                        </button>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-2">
                        {combo.name}
                      </h3>
                      <p className="text-sm text-[#5a5a56]/70 mb-4">
                        {SHIRT_COLORS[combo.shirt].name} Shirt + {TROUSER_COLORS[combo.trouser].name} Trousers
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-[#5a5a56]">£{combo.price}</span>
                        <SlidingButton
                          onClick={() => addToCart({ type: "set", setIndex: index, quantity: 1 })}
                          variant="dark"
                          duration={600}
                          className="px-4 py-2 text-xs"
                        >
                          Add to Cart
                        </SlidingButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shirts Carousel */}
          {viewMode === "shirts" && (
            <div className="mb-16">
              <h3 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mb-2 md:mb-8 text-center">
                Our Shirt Collection
              </h3>
              <ProductCarousel products={SHIRT_COLORS} type="shirt" />
            </div>
          )}

          {/* Trousers Carousel */}
          {viewMode === "trousers" && (
            <div className="mb-16">
              <h3 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mb-2 md:mb-8 text-center">
                Our Trouser Collection
              </h3>
              <ProductCarousel products={TROUSER_COLORS} type="trouser" />
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 shadow-sm p-6 mb-8 max-w-7xl mx-auto px-4">
              <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-4">
                Cart Summary
              </h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#5a5a56]">{getTotalItems()} item(s)</span>
                <span className="text-lg font-medium text-[#5a5a56]">£{getTotalPrice()}</span>
              </div>
              <SlidingButton
                onClick={proceedToCustomization}
                variant="dark"
                duration={800}
                className="w-full py-3 text-sm"
              >
                Proceed to Customization
              </SlidingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
