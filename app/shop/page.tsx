"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import NavigationMenu from "@/components/navigation-menu"
import SlidingButton from "@/components/sliding-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

type ViewMode = "sets" | "shirts" | "trousers"
type CartItem = {
  type: "shirt" | "trouser" | "set"
  shirtIndex?: number
  trouserIndex?: number
  setIndex?: number
  customSetShirtIndex?: number
  customSetTrouserIndex?: number
  quantity: number
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

  // Calculate available height for carousel
  useEffect(() => {
    const updateViewportHeight = () => {
      const headerHeight = 70
      const titleSectionHeight = 120 // Title + description
      const tabsHeight = 80 // Tab navigation
      const paginationHeight = 60 // Dots + spacing
      const cartSummaryHeight = 120 // Estimated cart summary height
      const padding = 40 // Additional padding

      const availableHeight =
        window.innerHeight -
        headerHeight -
        titleSectionHeight -
        tabsHeight -
        paginationHeight -
        cartSummaryHeight -
        padding
      setViewportHeight(Math.max(400, availableHeight)) // Minimum 400px
    }

    updateViewportHeight()
    window.addEventListener("resize", updateViewportHeight)
    return () => window.removeEventListener("resize", updateViewportHeight)
  }, [])

  // Optimized dimensions based on viewport
  const ITEM_WIDTH_CENTER = Math.min(420, viewportHeight * 0.6)
  const ITEM_HEIGHT_CENTER = viewportHeight * 0.85
  const ITEM_WIDTH_SIDE = ITEM_WIDTH_CENTER * 0.8
  const ITEM_HEIGHT_SIDE = ITEM_HEIGHT_CENTER * 0.8
  const ITEM_GAP = 24
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

  return (
    <div
      className="relative w-full max-w-7xl mx-auto overflow-hidden"
      ref={carouselRef}
      style={{ height: `${viewportHeight}px` }}
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
              index === currentIndex ? "bg-[#5a5a56] w-8 h-3" : "bg-[#5a5a56]/30 hover:bg-[#5a5a56]/50 w-3 h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => changeSlide((currentIndex - 1 + products.length) % products.length)}
        disabled={isTransitioning}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 z-30"
        aria-label="Previous product"
      >
        <svg className="w-4 h-4 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => changeSlide((currentIndex + 1) % products.length)}
        disabled={isTransitioning}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 z-30"
        aria-label="Next product"
      >
        <svg className="w-4 h-4 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          existingItemIndex = prevCart.findIndex((item) => item.type === "set" && item.setIndex === itemToAdd.setIndex)
        } else {
          existingItemIndex = prevCart.findIndex(
            (item) =>
              item.type === "set" &&
              item.customSetShirtIndex === itemToAdd.customSetShirtIndex &&
              item.customSetTrouserIndex === itemToAdd.customSetTrouserIndex,
          )
        }
      } else if (itemToAdd.type === "shirt") {
        existingItemIndex = prevCart.findIndex(
          (item) => item.type === "shirt" && item.shirtIndex === itemToAdd.shirtIndex,
        )
      } else if (itemToAdd.type === "trouser") {
        existingItemIndex = prevCart.findIndex(
          (item) => item.type === "trouser" && item.trouserIndex === itemToAdd.trouserIndex,
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
      itemToAdd = { type: "set", setIndex, quantity: 1 }
    } else {
      itemToAdd = {
        type: "set",
        customSetShirtIndex: selectedShirt,
        customSetTrouserIndex: selectedTrouser,
        quantity: 1,
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
    const itemToAdd: CartItem = { type, quantity: 1 }
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

  return (
    <div className="h-screen bg-white font-mulish flex flex-col overflow-hidden">
      <NavigationMenu logoWidth="45mm" />

      <div className="flex-1 flex flex-col pt-[70px] overflow-hidden">
        {/* Header Section - Fixed Height */}
        <div className="flex-shrink-0 px-4 sm:px-8 md:px-12 lg:px-16 py-6">
          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-[#5a5a56] mb-2">
              COLLECTION
            </h1>
            <p className="font-light text-[#5a5a56]/80 text-sm md:text-base max-w-2xl mx-auto">
              Handcrafted Italian linen pieces designed for the modern gentleman.
            </p>
          </div>

          {/* Tab Navigation - Fixed Height */}
          <div className="flex justify-center">
            <div className="border-b border-[#5a5a56]/20 flex space-x-4 md:space-x-8">
              {["shirts", "trousers", "sets"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as ViewMode)}
                  className={`px-3 md:px-4 py-3 text-xs md:text-sm font-light uppercase tracking-wider transition-colors duration-300 relative ${
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
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === "sets" && (
            <div className="flex-1 max-w-7xl mx-auto px-4 w-full overflow-hidden">
              <div className="bg-white shadow-sm overflow-hidden h-full">
                <div className="p-4 border-b border-[#5a5a56]/10">
                  <h3 className="font-light text-lg tracking-[0.1em] uppercase text-[#5a5a56]">Create Your Set</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
                  <div className="lg:col-span-2 p-4 flex items-center justify-center">
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
                        <h4 className="font-light text-sm uppercase tracking-wider text-[#5a5a56]/90 mb-2">
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
                                  SUGGESTED_COMBINATIONS.find((c) => c.shirt === index && c.trouser === selectedTrouser)
                                    ?.id || ""
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
                        <h4 className="font-light text-sm uppercase tracking-wider text-[#5a5a56]/90 mb-2">
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
                                  SUGGESTED_COMBINATIONS.find((c) => c.shirt === selectedShirt && c.trouser === index)
                                    ?.id || ""
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

                      <div>
                        <label className="block font-light text-sm uppercase tracking-wider text-[#5a5a56]/90 mb-2">
                          Suggested Sets:
                        </label>
                        <Select onValueChange={handleSuggestedCombinationChange} value={selectedCombinationId}>
                          <SelectTrigger className="w-full bg-transparent border-gray-300/70 text-[#5a5a56] font-light focus:ring-[#5a5a56]/50 focus:border-[#5a5a56]/50 rounded-none">
                            <SelectValue placeholder="Select a combination..." className="font-light" />
                          </SelectTrigger>
                          <SelectContent className="font-mulish rounded-none">
                            {SUGGESTED_COMBINATIONS.map((combo) => (
                              <SelectItem key={combo.id} value={combo.id} className="font-light text-sm">
                                {combo.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Enhanced Price and Add to Cart Section */}
                      <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 p-4 mt-4">
                        <div className="text-center mb-3">
                          <div className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-1">Complete Set</div>
                          <div className="text-2xl font-light text-[#5a5a56] mb-1">£{SET_PRICE}</div>
                          <div className="text-xs text-[#5a5a56]/60">
                            {SHIRT_COLORS[selectedShirt].name} Shirt + {TROUSER_COLORS[selectedTrouser].name} Trousers
                          </div>
                        </div>

                        <SlidingButton
                          onClick={addSetFromPanelToCart}
                          variant="dark"
                          duration={800}
                          className="w-full py-3 text-sm font-light tracking-wider mb-2"
                        >
                          Add Complete Set to Cart
                        </SlidingButton>

                        <div className="text-xs text-center text-[#5a5a56]/50">
                          Save £{SHIRT_PRICE + TROUSER_PRICE - SET_PRICE} vs individual items
                        </div>
                      </div>
                    </div>
                  </div>
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
        </div>

        {/* Cart Summary - Fixed at Bottom */}
        {cart.length > 0 && (
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
    </div>
  )
}
