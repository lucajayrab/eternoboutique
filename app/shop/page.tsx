"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import NavigationMenu from "@/components/navigation-menu"
import SlidingButton from "@/components/sliding-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"

// Product data
const SHIRT_PRICE = 325
const TROUSER_PRICE = 325
const SET_PRICE = 600

const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/images/shirts/new-white-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Black", color: "#2a2a33", image: "/images/shirts/new-black-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Navy", color: "#2d2a3e", image: "/images/shirts/new-navy-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Sky Blue", color: "#c9d7e8", image: "/images/shirts/new-sky-blue-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Pink", color: "#e7d0d3", image: "/images/shirts/new-pink-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Sage", color: "#9ca594", image: "/images/shirts/new-sage-linen-shirt.png", price: SHIRT_PRICE },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png", price: TROUSER_PRICE },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png", price: TROUSER_PRICE },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png", price: TROUSER_PRICE },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png", price: TROUSER_PRICE },
]

const SUGGESTED_COMBINATIONS = [
  { id: "combo-0", shirt: 0, trouser: 0, name: "Classic Natural", price: SET_PRICE },
  { id: "combo-1", shirt: 1, trouser: 3, name: "Monochrome", price: SET_PRICE },
  { id: "combo-2", shirt: 2, trouser: 0, name: "Mediterranean", price: SET_PRICE },
  { id: "combo-3", shirt: 3, trouser: 1, name: "Coastal", price: SET_PRICE },
  { id: "combo-4", shirt: 4, trouser: 0, name: "Sunset", price: SET_PRICE },
  { id: "combo-5", shirt: 5, trouser: 3, name: "Earth Tones", price: SET_PRICE },
]

type ViewMode = "sets" | "shirts" | "trousers" | "tailoring"
type CartItem = {
  type: "shirt" | "trouser" | "set"
  shirtIndex?: number
  trouserIndex?: number
  setIndex?: number
  customSetShirtIndex?: number
  customSetTrouserIndex?: number
  quantity: number
  shirtSize?: string
  trouserSize?: string
  size?: string // For individual items
}

interface ProductCarouselProps {
  products: any[]
  type: "shirt" | "trouser"
  onAddToCart: (type: "shirt" | "trouser", index: number) => void
}

function ProductCarousel({ products, type, onAddToCart }: ProductCarouselProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(products.length >= 3 ? 1 : 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const [viewportHeight, setViewportHeight] = useState(0)
  const isMobile = useIsMobile()

  // Calculate available height for carousel
  useEffect(() => {
    const updateViewportHeight = () => {
      const headerHeight = 70
      const titleSectionHeight = isMobile ? 80 : 120 // Smaller on mobile
      const tabsHeight = isMobile ? 60 : 80 // Smaller on mobile
      const paginationHeight = 60 // Dots + spacing
      const cartSummaryHeight = isMobile ? 0 : 120 // No cart summary on mobile
      const padding = isMobile ? 20 : 40 // Less padding on mobile

      const availableHeight =
        window.innerHeight -
        headerHeight -
        titleSectionHeight -
        tabsHeight -
        paginationHeight -
        cartSummaryHeight -
        padding
      setViewportHeight(Math.max(isMobile ? 300 : 400, availableHeight))
    }

    updateViewportHeight()
    window.addEventListener("resize", updateViewportHeight)
    return () => window.removeEventListener("resize", updateViewportHeight)
  }, [isMobile])

  // Optimized dimensions based on viewport
  const ITEM_WIDTH_CENTER = Math.min(isMobile ? 280 : 420, viewportHeight * (isMobile ? 0.5 : 0.6))
  const ITEM_HEIGHT_CENTER = viewportHeight * (isMobile ? 0.75 : 0.85)
  const ITEM_WIDTH_SIDE = ITEM_WIDTH_CENTER * (isMobile ? 0.7 : 0.8)
  const ITEM_HEIGHT_SIDE = ITEM_HEIGHT_CENTER * (isMobile ? 0.7 : 0.8)
  const ITEM_GAP = isMobile ? 16 : 24
  const TRANSITION_DURATION = 500
  const AUTO_PLAY_INTERVAL = 6000

  // Auto-play without hover interference
  useEffect(() => {
    if (products.length <= 1) return

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prev) => (prev + 1) % products.length)
      }
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [currentIndex, isTransitioning, products.length])

  // Enhanced transition management
  const changeSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= products.length) return

    setIsTransitioning(true)
    setCurrentIndex(newIndex)

    setTimeout(() => {
      setIsTransitioning(false)
    }, TRANSITION_DURATION)
  }

  const handleProductClick = (index: number) => {
    if (isTransitioning) return

    // On mobile, always navigate to the product page when any item is clicked
    if (isMobile) {
      router.push(`/product/${type}/${index}`)
      return
    }

    // On desktop, only navigate if clicking the center item, otherwise just change slide
    if (index === currentIndex) {
      router.push(`/product/${type}/${index}`)
    } else {
      changeSlide(index)
    }
  }

  const calculateOffset = () => {
    if (!carouselRef.current) return 0
    const containerWidth = carouselRef.current.offsetWidth
    let offsetToCenterOfCurrentItem = 0

    for (let i = 0; i < currentIndex; i++) {
      offsetToCenterOfCurrentItem += ITEM_WIDTH_SIDE + ITEM_GAP
    }
    offsetToCenterOfCurrentItem += ITEM_WIDTH_CENTER / 2

    return containerWidth / 2 - offsetToCenterOfCurrentItem
  }

  // Touch handling for mobile swipe
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (isTransitioning) return

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left, go to next
        changeSlide((currentIndex + 1) % products.length)
      } else {
        // Swipe right, go to previous
        changeSlide((currentIndex - 1 + products.length) % products.length)
      }
    }
  }

  return (
    <div
      className="relative w-full max-w-7xl mx-auto overflow-hidden"
      ref={carouselRef}
      style={{ height: `${viewportHeight}px` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex items-center transition-transform ease-out h-full"
        style={{
          transform: `translateX(${calculateOffset()}px)`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
          transitionProperty: "transform",
        }}
      >
        {products.map((product, index) => {
          const isCenter = index === currentIndex
          const distance = Math.abs(index - currentIndex)
          const scale = isCenter ? 1 : Math.max(0.75, 1 - distance * 0.12)
          const opacity = isCenter ? 1 : Math.max(0.5, 1 - distance * 0.25)
          const zIndex = isCenter ? 20 : Math.max(1, 10 - distance)

          const itemWidth = isCenter ? ITEM_WIDTH_CENTER : ITEM_WIDTH_SIDE
          const itemHeight = isCenter ? ITEM_HEIGHT_CENTER : ITEM_HEIGHT_SIDE

          return (
            <div
              key={`${product.name}-${index}`}
              className="relative flex-shrink-0 cursor-pointer flex items-center justify-center transition-all ease-out"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                marginRight: `${ITEM_GAP}px`,
                transform: `scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                transitionDuration: `${TRANSITION_DURATION}ms`,
                transitionProperty: "transform, opacity",
              }}
              onClick={() => handleProductClick(index)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={product.image || `/placeholder.svg?width=${itemWidth}&height=${itemHeight}&query=linen+product`}
                  alt={`${product.name} Linen ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-none" // Remove hover transitions to prevent flickering
                  priority={isCenter || distance <= 1}
                  sizes={`(max-width: 768px) 100vw, ${itemWidth}px`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Simplified pagination dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "bg-[#5a5a56] w-6 sm:w-8 h-2 sm:h-3"
                : "bg-[#5a5a56]/30 hover:bg-[#5a5a56]/50 w-2 sm:w-3 h-2 sm:h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - slightly smaller on mobile */}
      <button
        onClick={() => changeSlide((currentIndex - 1 + products.length) % products.length)}
        disabled={isTransitioning}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 z-30"
        aria-label="Previous product"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => changeSlide((currentIndex + 1) % products.length)}
        disabled={isTransitioning}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 z-30"
        aria-label="Next product"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default function ShopPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ViewMode>("shirts")
  const [viewMode, setViewMode] = useState<ViewMode>("shirts")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedShirt, setSelectedShirt] = useState(0)
  const [selectedTrouser, setSelectedTrouser] = useState(3)
  const [selectedCombinationId, setSelectedCombinationId] = useState<string>("")
  const [selectedShirtSize, setSelectedShirtSize] = useState("M")
  const [selectedTrouserSize, setSelectedTrouserSize] = useState("M")
  const isMobile = useIsMobile()
  const [showSizeChart, setShowSizeChart] = useState<"shirt" | "trouser" | null>(null)

  // Ensure page loads at top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const savedCart = localStorage.getItem("eternoCart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse saved cart", e)
      }
    }
    const initialCombo = SUGGESTED_COMBINATIONS.find((c) => c.shirt === selectedShirt && c.trouser === selectedTrouser)
    if (initialCombo) {
      setSelectedCombinationId(initialCombo.id)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("eternoCart", JSON.stringify(cart))
  }, [cart])

  const handleSuggestedCombinationChange = (comboId: string) => {
    const combination = SUGGESTED_COMBINATIONS.find((c) => c.id === comboId)
    if (combination) {
      setSelectedShirt(combination.shirt)
      setSelectedTrouser(combination.trouser)
      setSelectedCombinationId(comboId)
    } else {
      setSelectedCombinationId("")
    }
  }

  const addItemToCart = (itemToAdd: CartItem) => {
    setCart((prevCart) => {
      let existingItemIndex = -1
      if (itemToAdd.type === "set") {
        if (itemToAdd.setIndex !== undefined) {
          existingItemIndex = prevCart.findIndex(
            (item) =>
              item.type === "set" &&
              item.setIndex === itemToAdd.setIndex &&
              item.shirtSize === itemToAdd.shirtSize &&
              item.trouserSize === itemToAdd.trouserSize,
          )
        } else {
          existingItemIndex = prevCart.findIndex(
            (item) =>
              item.type === "set" &&
              item.customSetShirtIndex === itemToAdd.customSetShirtIndex &&
              item.customSetTrouserIndex === itemToAdd.customSetTrouserIndex &&
              item.shirtSize === itemToAdd.shirtSize &&
              item.trouserSize === itemToAdd.trouserSize,
          )
        }
      } else if (itemToAdd.type === "shirt") {
        existingItemIndex = prevCart.findIndex(
          (item) => item.type === "shirt" && item.shirtIndex === itemToAdd.shirtIndex && item.size === itemToAdd.size,
        )
      } else if (itemToAdd.type === "trouser") {
        existingItemIndex = prevCart.findIndex(
          (item) =>
            item.type === "trouser" && item.trouserIndex === itemToAdd.trouserIndex && item.size === itemToAdd.size,
        )
      }

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += 1
        return updatedCart
      } else {
        return [...prevCart, { ...itemToAdd, quantity: 1 }]
      }
    })
  }

  const addSetFromPanelToCart = () => {
    const matchedSuggestedCombo = SUGGESTED_COMBINATIONS.find(
      (combo) => combo.shirt === selectedShirt && combo.trouser === selectedTrouser,
    )
    let itemToAdd: CartItem
    if (matchedSuggestedCombo) {
      const setIndex = SUGGESTED_COMBINATIONS.findIndex((c) => c.id === matchedSuggestedCombo.id)
      itemToAdd = {
        type: "set",
        setIndex,
        quantity: 1,
        shirtSize: selectedShirtSize,
        trouserSize: selectedTrouserSize,
      }
    } else {
      itemToAdd = {
        type: "set",
        customSetShirtIndex: selectedShirt,
        customSetTrouserIndex: selectedTrouser,
        quantity: 1,
        shirtSize: selectedShirtSize,
        trouserSize: selectedTrouserSize,
      }
    }

    // Add to cart
    addItemToCart(itemToAdd)

    // Always redirect to shirt customization for the SELECTED shirt color
    localStorage.setItem(
      "pendingShirtCustomization",
      JSON.stringify({
        type: "set",
        shirtIndex: selectedShirt, // This ensures the selected shirt color is used
        setData: itemToAdd,
      }),
    )

    // Redirect to customization page for the selected shirt
    router.push("/customize-shirt")
  }

  const addIndividualItemToCart = (type: "shirt" | "trouser", index: number) => {
    const itemToAdd: CartItem = { type, quantity: 1, size: "M" } // Default size for individual items
    if (type === "shirt") itemToAdd.shirtIndex = index
    if (type === "trouser") itemToAdd.trouserIndex = index

    // Add to cart
    addItemToCart(itemToAdd)

    // If it's a shirt, redirect to shirt customization immediately
    if (type === "shirt") {
      localStorage.setItem(
        "pendingShirtCustomization",
        JSON.stringify({
          type: "individual",
          shirtIndex: index,
        }),
      )
      router.push("/customize-shirt")
    }
    // For trousers, just add to cart and stay on page
  }

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0)

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemPrice = 0
      if (item.type === "shirt" && item.shirtIndex !== undefined) {
        itemPrice = SHIRT_COLORS[item.shirtIndex].price
      } else if (item.type === "trouser" && item.trouserIndex !== undefined) {
        itemPrice = TROUSER_COLORS[item.trouserIndex].price
      } else if (item.type === "set") {
        itemPrice = SET_PRICE
      }
      return total + itemPrice * item.quantity
    }, 0)
  }

  const proceedToCustomization = () => {
    // Check if there are any shirts in the cart that need customization
    const hasShirts = cart.some((item) => item.type === "shirt" || item.type === "set")

    if (hasShirts) {
      // Find the first shirt or set that needs customization
      const shirtItem = cart.find((item) => item.type === "shirt")
      const setItem = cart.find((item) => item.type === "set")

      if (shirtItem) {
        // Redirect to shirt customization for individual shirt
        localStorage.setItem(
          "pendingShirtCustomization",
          JSON.stringify({
            type: "individual",
            shirtIndex: shirtItem.shirtIndex,
          }),
        )
        router.push("/customize-shirt")
      } else if (setItem) {
        // Redirect to shirt customization for set
        const shirtIndex =
          setItem.setIndex !== undefined ? SUGGESTED_COMBINATIONS[setItem.setIndex].shirt : setItem.customSetShirtIndex

        localStorage.setItem(
          "pendingShirtCustomization",
          JSON.stringify({
            type: "set",
            shirtIndex: shirtIndex,
            setData: setItem,
          }),
        )
        router.push("/customize-shirt")
      }
    } else {
      // Only trousers in cart, go to general customization
      router.push("/customize")
    }
  }

  const handleTabChange = (tab: ViewMode) => {
    setActiveTab(tab)
    setViewMode(tab)
  }

  const sizes = ["XS", "S", "M", "L", "XL"]

  const sizeChartData = {
    shirt: {
      title: "Shirt Size Chart",
      measurements: [
        { size: "XS", chest: "34-36", length: "28", shoulder: "16.5" },
        { size: "S", chest: "36-38", length: "29", shoulder: "17.5" },
        { size: "M", chest: "38-40", length: "30", shoulder: "18.5" },
        { size: "L", chest: "40-42", length: "31", shoulder: "19.5" },
        { size: "XL", chest: "42-44", length: "32", shoulder: "20.5" },
      ],
    },
    trouser: {
      title: "Trouser Size Chart",
      measurements: [
        { size: "XS", waist: "28-30", inseam: "30", hip: "36" },
        { size: "S", waist: "30-32", inseam: "31", hip: "38" },
        { size: "M", waist: "32-34", inseam: "32", hip: "40" },
        { size: "L", waist: "34-36", inseam: "33", hip: "42" },
        { size: "XL", waist: "36-38", inseam: "34", hip: "44" },
      ],
    },
  }

  return (
    <div
      className={`${isMobile && (viewMode === "sets" || viewMode === "tailoring") ? "min-h-screen" : "h-screen"} bg-white font-mulish flex flex-col overflow-hidden`}
    >
      <NavigationMenu logoWidth={isMobile ? "35mm" : "45mm"} />

      <div className="flex-1 flex flex-col pt-[70px] overflow-hidden">
        {/* Header Section - Fixed Height */}
        <div className="flex-shrink-0 px-3 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4">
              COLLECTION
            </h1>
          </div>

          {/* Tab Navigation - Fixed Height */}
          <div className="flex justify-center">
            <div className="border-b border-[#5a5a56]/20 flex space-x-3 sm:space-x-4 md:space-x-8">
              {["shirts", "trousers", "sets", "tailoring"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as ViewMode)}
                  className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-light uppercase tracking-wider transition-colors duration-300 relative ${
                    activeTab === tab ? "text-[#5a5a56]" : "text-[#5a5a56]/50 hover:text-[#5a5a56]/70"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5a5a56] transform -translate-y-px"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area - Flexible Height */}
        <div
          className={`flex-1 flex flex-col ${isMobile && (viewMode === "sets" || viewMode === "tailoring") ? "overflow-auto" : "overflow-hidden"}`}
        >
          {viewMode === "sets" && (
            <div
              className={`flex-1 max-w-7xl mx-auto px-3 sm:px-4 w-full ${isMobile ? "overflow-auto" : "overflow-hidden h-full"}`}
            >
              <div className={`bg-white shadow-sm ${isMobile ? "min-h-full" : "overflow-hidden h-full"}`}>
                <div className="p-3 sm:p-4 border-b border-[#5a5a56]/10">
                  <h3 className="font-light text-sm sm:text-lg tracking-[0.1em] uppercase text-[#5a5a56]">
                    Create Your Set
                  </h3>
                </div>
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-0 ${isMobile ? "min-h-full" : "h-full"}`}>
                  {/* Mobile-optimized layout for sets view */}
                  {isMobile ? (
                    <div className="flex flex-col min-h-full pb-6">
                      {/* Image section - flexible height on mobile */}
                      <div className="flex-shrink-0 p-4 flex items-center justify-center">
                        <div className="aspect-[4/3] relative w-full max-w-xs">
                          <div className="grid grid-cols-2 h-full gap-2">
                            <div className="relative">
                              <Image
                                src={SHIRT_COLORS[selectedShirt].image || "/placeholder.svg"}
                                alt={`${SHIRT_COLORS[selectedShirt].name} Shirt`}
                                fill
                                style={{ objectFit: "contain" }}
                                priority
                                sizes="50vw"
                              />
                            </div>
                            <div className="relative">
                              <Image
                                src={TROUSER_COLORS[selectedTrouser].image || "/placeholder.svg"}
                                alt={`${TROUSER_COLORS[selectedTrouser].name} Trousers`}
                                fill
                                style={{ objectFit: "contain" }}
                                priority
                                sizes="50vw"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Controls section - flexible height on mobile */}
                      <div className="flex-1 border-t border-[#5a5a56]/10 flex flex-col">
                        <div className="p-4 space-y-4 flex-1">
                          <div>
                            <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-1">
                              Select Shirt:{" "}
                              <span className="font-normal text-[#5a5a56]">{SHIRT_COLORS[selectedShirt].name}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {SHIRT_COLORS.map((shirt, index) => (
                                <button
                                  key={shirt.name}
                                  onClick={() => {
                                    setSelectedShirt(index)
                                    const csId =
                                      SUGGESTED_COMBINATIONS.find(
                                        (c) => c.shirt === index && c.trouser === selectedTrouser,
                                      )?.id || ""
                                    setSelectedCombinationId(csId)
                                  }}
                                  className={`w-5 h-5 rounded-full transition-all duration-200 border-2 ${
                                    selectedShirt === index
                                      ? "ring-1 ring-offset-1 ring-[#5a5a56] border-transparent"
                                      : "border-gray-300/70 hover:border-[#5a5a56]/50"
                                  }`}
                                  style={{ backgroundColor: shirt.color }}
                                  aria-label={`${shirt.name} shirt color`}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-1">
                              Select Trouser:{" "}
                              <span className="font-normal text-[#5a5a56]">{TROUSER_COLORS[selectedTrouser].name}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {TROUSER_COLORS.map((trouser, index) => (
                                <button
                                  key={trouser.name}
                                  onClick={() => {
                                    setSelectedTrouser(index)
                                    const csId =
                                      SUGGESTED_COMBINATIONS.find(
                                        (c) => c.shirt === selectedShirt && c.trouser === index,
                                      )?.id || ""
                                    setSelectedCombinationId(csId)
                                  }}
                                  className={`w-5 h-5 rounded-full transition-all duration-200 border-2 ${
                                    selectedTrouser === index
                                      ? "ring-1 ring-offset-1 ring-[#5a5a56] border-transparent"
                                      : "border-gray-300/70 hover:border-[#5a5a56]/50"
                                  }`}
                                  style={{ backgroundColor: trouser.color }}
                                  aria-label={`${trouser.name} trouser color`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Size Selection for Shirt */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90">
                                Shirt Size: <span className="font-normal text-[#5a5a56]">{selectedShirtSize}</span>
                              </h4>
                              <button
                                onClick={() => setShowSizeChart("shirt")}
                                className="text-[9px] text-[#5a5a56]/70 hover:text-[#5a5a56] underline"
                              >
                                Size Chart
                              </button>
                            </div>
                            <div className="flex gap-1">
                              {sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedShirtSize(size)}
                                  className={`w-8 h-8 border text-xs transition-all duration-200 ${
                                    selectedShirtSize === size
                                      ? "border-[#5a5a56] bg-[#5a5a56] text-white"
                                      : "border-[#5a5a56]/20 text-[#5a5a56] hover:border-[#5a5a56]/50"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Size Selection for Trouser */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90">
                                Trouser Size: <span className="font-normal text-[#5a5a56]">{selectedTrouserSize}</span>
                              </h4>
                              <button
                                onClick={() => setShowSizeChart("trouser")}
                                className="text-[9px] text-[#5a5a56]/70 hover:text-[#5a5a56] underline"
                              >
                                Size Chart
                              </button>
                            </div>
                            <div className="flex gap-1">
                              {sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedTrouserSize(size)}
                                  className={`w-8 h-8 border text-xs transition-all duration-200 ${
                                    selectedTrouserSize === size
                                      ? "border-[#5a5a56] bg-[#5a5a56] text-white"
                                      : "border-[#5a5a56]/20 text-[#5a5a56] hover:border-[#5a5a56]/50"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-light text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-1">
                              Suggested Sets:
                            </label>
                            <Select onValueChange={handleSuggestedCombinationChange} value={selectedCombinationId}>
                              <SelectTrigger className="w-full bg-transparent border-gray-300/70 text-[#5a5a56] text-xs font-light focus:ring-[#5a5a56]/50 focus:border-[#5a5a56]/50 rounded-none h-9">
                                <SelectValue placeholder="Select a combination..." className="font-light" />
                              </SelectTrigger>
                              <SelectContent className="font-mulish rounded-none">
                                {SUGGESTED_COMBINATIONS.map((combo) => (
                                  <SelectItem key={combo.id} value={combo.id} className="font-light text-xs">
                                    {combo.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Enhanced Price and Add to Cart Section */}
                          <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 p-4 mt-4">
                            <div className="text-center mb-3">
                              <div className="text-[10px] uppercase tracking-wider text-[#5a5a56]/70 mb-1">
                                Complete Set
                              </div>
                              <div className="text-xl font-light text-[#5a5a56] mb-1">£{SET_PRICE}</div>
                              <div className="text-[10px] text-[#5a5a56]/60">
                                {SHIRT_COLORS[selectedShirt].name} Shirt ({selectedShirtSize}) +{" "}
                                {TROUSER_COLORS[selectedTrouser].name} Trousers ({selectedTrouserSize})
                              </div>
                            </div>

                            <SlidingButton
                              onClick={addSetFromPanelToCart}
                              variant="dark"
                              duration={800}
                              className="w-full py-3 text-xs font-light tracking-wider mb-2"
                            >
                              Add Complete Set to Cart
                            </SlidingButton>

                            <div className="text-[10px] text-center text-[#5a5a56]/50">
                              Save £{SHIRT_PRICE + TROUSER_PRICE - SET_PRICE} vs individual items
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Desktop layout with size selection
                    <>
                      <div className="lg:col-span-2 p-4 flex items-start justify-center pt-8">
                        <div className="aspect-[4/3] relative w-full max-w-2xl">
                          <div className="grid grid-cols-2 h-full gap-2">
                            <div className="relative">
                              <Image
                                src={SHIRT_COLORS[selectedShirt].image || "/placeholder.svg"}
                                alt={`${SHIRT_COLORS[selectedShirt].name} Shirt`}
                                fill
                                style={{ objectFit: "contain" }}
                                priority
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 30vw"
                              />
                            </div>
                            <div className="relative">
                              <Image
                                src={TROUSER_COLORS[selectedTrouser].image || "/placeholder.svg"}
                                alt={`${TROUSER_COLORS[selectedTrouser].name} Trousers`}
                                fill
                                style={{ objectFit: "contain" }}
                                priority
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 30vw"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:border-l lg:border-[#5a5a56]/10 flex flex-col">
                        <div className="p-4 space-y-4 flex-1">
                          <div>
                            <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-2">
                              Select Shirt:{" "}
                              <span className="font-normal text-[#5a5a56]">{SHIRT_COLORS[selectedShirt].name}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {SHIRT_COLORS.map((shirt, index) => (
                                <button
                                  key={shirt.name}
                                  onClick={() => {
                                    setSelectedShirt(index)
                                    const csId =
                                      SUGGESTED_COMBINATIONS.find(
                                        (c) => c.shirt === index && c.trouser === selectedTrouser,
                                      )?.id || ""
                                    setSelectedCombinationId(csId)
                                  }}
                                  className={`w-6 h-6 rounded-full transition-all duration-200 border-2 ${
                                    selectedShirt === index
                                      ? "ring-2 ring-offset-1 ring-[#5a5a56] border-transparent"
                                      : "border-gray-300/70 hover:border-[#5a5a56]/50"
                                  }`}
                                  style={{ backgroundColor: shirt.color }}
                                  aria-label={`${shirt.name} shirt color`}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-2">
                              Select Trouser:{" "}
                              <span className="font-normal text-[#5a5a56]">{TROUSER_COLORS[selectedTrouser].name}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {TROUSER_COLORS.map((trouser, index) => (
                                <button
                                  key={trouser.name}
                                  onClick={() => {
                                    setSelectedTrouser(index)
                                    const csId =
                                      SUGGESTED_COMBINATIONS.find(
                                        (c) => c.shirt === selectedShirt && c.trouser === index,
                                      )?.id || ""
                                    setSelectedCombinationId(csId)
                                  }}
                                  className={`w-6 h-6 rounded-full transition-all duration-200 border-2 ${
                                    selectedTrouser === index
                                      ? "ring-2 ring-offset-1 ring-[#5a5a56] border-transparent"
                                      : "border-gray-300/70 hover:border-[#5a5a56]/50"
                                  }`}
                                  style={{ backgroundColor: trouser.color }}
                                  aria-label={`${trouser.name} trouser color`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Size Selection for Shirt */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90">
                                Shirt Size: <span className="font-normal text-[#5a5a56]">{selectedShirtSize}</span>
                              </h4>
                              <button
                                onClick={() => setShowSizeChart("shirt")}
                                className="text-[9px] text-[#5a5a56]/70 hover:text-[#5a5a56] underline"
                              >
                                Size Chart
                              </button>
                            </div>
                            <div className="flex gap-2">
                              {sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedShirtSize(size)}
                                  className={`w-10 h-10 border text-xs transition-all duration-200 ${
                                    selectedShirtSize === size
                                      ? "border-[#5a5a56] bg-[#5a5a56] text-white"
                                      : "border-[#5a5a56]/20 text-[#5a5a56] hover:border-[#5a5a56]/50"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Size Selection for Trouser */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-light text-xs uppercase tracking-wider text-[#5a5a56]/90">
                                Trouser Size: <span className="font-normal text-[#5a5a56]">{selectedTrouserSize}</span>
                              </h4>
                              <button
                                onClick={() => setShowSizeChart("trouser")}
                                className="text-[9px] text-[#5a5a56]/70 hover:text-[#5a5a56] underline"
                              >
                                Size Chart
                              </button>
                            </div>
                            <div className="flex gap-2">
                              {sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedTrouserSize(size)}
                                  className={`w-10 h-10 border text-xs transition-all duration-200 ${
                                    selectedTrouserSize === size
                                      ? "border-[#5a5a56] bg-[#5a5a56] text-white"
                                      : "border-[#5a5a56]/20 text-[#5a5a56] hover:border-[#5a5a56]/50"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-light text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-2">
                              Suggested Sets:
                            </label>
                            <Select onValueChange={handleSuggestedCombinationChange} value={selectedCombinationId}>
                              <SelectTrigger className="w-full bg-transparent border-gray-300/70 text-[#5a5a56] font-light focus:ring-[#5a5a56]/50 focus:border-[#5a5a56]/50 rounded-none">
                                <SelectValue placeholder="Select a combination..." className="font-light" />
                              </SelectTrigger>
                              <SelectContent className="font-mulish rounded-none">
                                {SUGGESTED_COMBINATIONS.map((combo) => (
                                  <SelectItem key={combo.id} value={combo.id} className="font-light text-xs">
                                    {combo.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Enhanced Price and Add to Cart Section */}
                          <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 p-3 mt-4">
                            <div className="text-center mb-3">
                              <div className="text-[10px] uppercase tracking-wider text-[#5a5a56]/70 mb-1">
                                Complete Set
                              </div>
                              <div className="text-xl font-light text-[#5a5a56] mb-1">£{SET_PRICE}</div>
                              <div className="text-[10px] text-[#5a5a56]/60">
                                {SHIRT_COLORS[selectedShirt].name} Shirt ({selectedShirtSize}) +{" "}
                                {TROUSER_COLORS[selectedTrouser].name} Trousers ({selectedTrouserSize})
                              </div>
                            </div>

                            <SlidingButton
                              onClick={addSetFromPanelToCart}
                              variant="dark"
                              duration={800}
                              className="w-full py-2 text-xs font-light tracking-wider mb-2"
                            >
                              Add Complete Set to Cart
                            </SlidingButton>

                            <div className="text-[10px] text-center text-[#5a5a56]/50">
                              Save £{SHIRT_PRICE + TROUSER_PRICE - SET_PRICE} vs individual items
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {viewMode === "shirts" && (
            <div className="flex-1 overflow-hidden">
              <ProductCarousel products={SHIRT_COLORS} type="shirt" onAddToCart={addIndividualItemToCart} />
            </div>
          )}

          {viewMode === "trousers" && (
            <div className="flex-1 overflow-hidden">
              <ProductCarousel products={TROUSER_COLORS} type="trouser" onAddToCart={addIndividualItemToCart} />
            </div>
          )}
          {viewMode === "tailoring" && (
            <div className={`flex-1 ${isMobile ? "overflow-auto" : "overflow-hidden"}`}>
              <div
                className={`max-w-6xl mx-auto px-4 sm:px-8 pt-2 sm:pt-4 pb-6 sm:pb-8 ${isMobile ? "min-h-full" : "h-full"}`}
              >
                {/* Main Content Grid - Equal Height Sections */}
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${isMobile ? "min-h-full" : "h-full items-start"}`}
                >
                  {/* Image Section */}
                  <div
                    className={`flex ${isMobile ? "justify-center" : "items-start justify-center lg:justify-end"} pt-4`}
                  >
                    <div className="relative w-full max-w-md lg:max-w-lg">
                      <Image
                        src="/images/vintage-italian-family-new.jpg"
                        alt="Vintage Italian family portrait showcasing traditional craftsmanship heritage"
                        width={400}
                        height={600}
                        className="w-full h-auto object-cover rounded-sm shadow-lg"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                  </div>

                  {/* Content Section - All text content as one cohesive box */}
                  <div
                    className={`flex flex-col ${isMobile ? "items-center text-center" : "items-start text-center lg:text-left"} pt-4 pb-6`}
                  >
                    {/* BOUTIQUE TAILORING Header - now part of the content box */}
                    <h2 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6">
                      BOUTIQUE TAILORING
                    </h2>

                    <div
                      className={`font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-8 max-w-2xl ${isMobile ? "mx-auto text-center" : "mx-auto lg:mx-0"}`}
                    >
                      <p className="mb-3 sm:mb-4">
                        Our showroom in the heart of Mayfair offers a refined setting for your personal tailoring
                        experience. Here, we provide in-person boutique tailoring appointments for clients who wish to
                        have their items fully tailored to their build, as well as those who prefer to view our
                        collection in-person before purchasing.
                      </p>
                      <p>
                        Once tailored to your specifications, an order will be placed, and you will receive your bespoke
                        garments in 4-6 weeks. We will keep your measurements and preferences saved on file for future
                        orders as we expand our operations.
                      </p>
                    </div>

                    {/* Locate Us Box */}
                    <Link
                      href="https://maps.google.com/?q=Mayfair,+London,+UK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block bg-[#eeeeec] p-4 sm:p-6 font-mulish text-[#5a5a56]/80 max-w-[550px] hover:bg-[#e8e4d9] transition-colors duration-300 border border-[#e0ddd2] mb-6 ${isMobile ? "mx-auto" : "mx-auto lg:mx-0"}`}
                    >
                      <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-center">
                        LOCATE US
                      </h4>
                      <p className="text-[10px] sm:text-xs flex items-center justify-center">
                        The Mayfair Showroom
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </p>
                    </Link>

                    {/* Register Interest Button */}
                    <div className={`max-w-[550px] ${isMobile ? "mx-auto" : "mx-auto lg:mx-0"}`}>
                      <div className={`flex ${isMobile ? "justify-center" : "justify-center lg:justify-start"}`}>
                        <SlidingButton
                          onClick={() => router.push("/register")}
                          variant="dark"
                          duration={1000}
                          className="min-w-[140px] sm:min-w-[160px] md:min-w-[200px] py-2 sm:py-3 text-xs sm:text-sm"
                        >
                          ENQUIRE
                        </SlidingButton>
                      </div>
                      <p
                        className={`text-[10px] sm:text-xs mt-3 text-[#5a5a56]/70 ${isMobile ? "text-center" : "text-center lg:text-left"} max-w-[400px] ${isMobile ? "mx-auto" : "mx-auto lg:mx-0"}`}
                      >
                        Submit an enquiry and our team will contact you to discuss your order details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Summary - Fixed at Bottom - Only show on desktop */}
        {cart.length > 0 && !isMobile && (
          <div className="flex-shrink-0 bg-[#f9f8f5] border-t border-[#5a5a56]/10 shadow-sm p-4 mx-4 mb-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-light text-sm text-[#5a5a56]">{getTotalItems()} item(s)</span>
                <span className="text-lg font-medium text-[#5a5a56]">£{getTotalPrice()}</span>
              </div>
              <SlidingButton
                onClick={proceedToCustomization}
                variant="dark"
                duration={800}
                className="w-full py-2 text-sm font-light tracking-wider"
              >
                Proceed to Customization
              </SlidingButton>
            </div>
          </div>
        )}
      </div>
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-sm shadow-lg">
            <div className="p-4 border-b border-[#5a5a56]/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-normal text-[#5a5a56] uppercase tracking-wider">
                  {sizeChartData[showSizeChart].title}
                </h3>
                <button onClick={() => setShowSizeChart(null)} className="text-[#5a5a56]/70 hover:text-[#5a5a56]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#5a5a56]/70 mb-3">All measurements in inches</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#5a5a56]/10">
                    <th className="text-left py-2 text-[#5a5a56] font-normal">Size</th>
                    {showSizeChart === "shirt" ? (
                      <>
                        <th className="text-left py-2 text-[#5a5a56] font-normal">Chest</th>
                        <th className="text-left py-2 text-[#5a5a56] font-normal">Length</th>
                        <th className="text-left py-2 text-[#5a5a56] font-normal">Shoulder</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-2 text-[#5a5a56] font-normal">Waist</th>
                        <th className="text-left py-2 text-[#5a5a56] font-normal">Inseam</th>
                        <th className="text-left py-2 text-[#5a5a56] font-normal">Hip</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeChartData[showSizeChart]).map((measurement) => (
                    <tr key={measurement.size} className="border-b border-[#5a5a56]/5">
                      <td className="py-2 text-[#5a5a56]">{measurement.size}</td>
                      {showSizeChart === "shirt" ? (
                        <>
                          <td className="py-2 text-[#5a5a56]/80">{measurement.chest}</td>
                          <td className="py-2 text-[#5a5a56]/80">{measurement.length}</td>
                          <td className="py-2 text-[#5a5a56]/80">{measurement.shoulder}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 text-[#5a5a56]/80">{measurement.waist}</td>
                          <td className="py-2 text-[#5a5a56]/80">{measurement.inseam}</td>
                          <td className="py-2 text-[#5a5a56]/80">{measurement.hip}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
